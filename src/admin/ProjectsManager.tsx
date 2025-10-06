import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { FileUpload, ImagePreview } from '../components/ui/FileUpload';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Project, getProjects, getProjectById, createDocument, updateDocument, deleteDocument, COLLECTIONS } from '../lib/firestore';
import { syncRepositoryData } from '../lib/github';
import { Timestamp } from 'firebase/firestore';

export function ProjectsManager() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsList />} />
      <Route path="/new" element={<ProjectEditor />} />
      <Route path="/edit/:id" element={<ProjectEditor />} />
    </Routes>
  );
}

function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await getProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setProjectToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.PROJECTS, projectToDelete.id);
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleToggleVisibility = async (project: Project) => {
    if (!project.id) return;

    try {
      await updateDocument(COLLECTIONS.PROJECTS, project.id, {
        isVisible: !project.isVisible,
        updatedAt: Timestamp.now(),
      });
      setProjects(projects.map(p =>
        p.id === project.id ? { ...p, isVisible: !p.isVisible } : p
      ));
    } catch (error) {
      console.error('Error updating project visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleTogglePin = async (project: Project) => {
    if (!project.id) return;

    try {
      await updateDocument(COLLECTIONS.PROJECTS, project.id, {
        isPinned: !project.isPinned,
        updatedAt: Timestamp.now(),
      });
      setProjects(projects.map(p =>
        p.id === project.id ? { ...p, isPinned: !p.isPinned } : p
      ));
    } catch (error) {
      console.error('Error updating project pin status:', error);
      alert('Failed to update pin status. Please try again.');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your project portfolio</p>
        </div>
        <Link to="/admin/projects/new">
          <Button>+ New Project</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No projects match your search.' : 'No projects yet. Create your first project!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{project.name}</CardTitle>
                      {project.isPinned && (
                        <Badge variant="accent">📌 Pinned</Badge>
                      )}
                      <Badge variant={project.isVisible ? 'accent' : 'secondary'}>
                        {project.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      <Badge variant={project.source === 'github' ? 'secondary' : 'primary'}>
                        {project.source === 'github' ? '🔗 GitHub' : '✏️ Manual'}
                      </Badge>
                    </div>
                    <CardDescription>{project.summary}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleTogglePin(project)}
                    >
                      {project.isPinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleToggleVisibility(project)}
                    >
                      {project.isVisible ? 'Hide' : 'Show'}
                    </Button>
                    <Link to={`/admin/projects/edit/${project.id}`}>
                      <Button variant="secondary" size="small">Edit</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => project.id && handleDeleteClick(project.id, project.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="flex gap-3 pt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          → Live Demo
                        </a>
                      )}
                    </div>
                  )}
                  {project.githubData && (
                    <div className="flex gap-4 pt-2 text-sm text-muted-foreground">
                      <span>⭐ {project.githubData.stars} stars</span>
                      <span>📝 {project.githubData.language}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        destructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    technologies: [] as string[],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    isVisible: true,
    isPinned: false,
    source: 'manual' as 'manual' | 'github',
    completedAt: '',
  });

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const project = await getProjectById(projectId);
      if (project) {
        setFormData({
          name: project.name,
          summary: project.summary,
          description: project.description,
          technologies: project.technologies,
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          imageUrl: project.imageUrl || '',
          isVisible: project.isVisible,
          isPinned: project.isPinned,
          source: project.source,
          completedAt: project.completedAt
            ? new Date(project.completedAt.seconds * 1000).toISOString().split('T')[0]
            : '',
        });
        setCurrentImageUrl(project.imageUrl || '');

        // Load last sync timestamp if available
        if (project.lastSyncAt) {
          setLastSyncedAt(new Date(project.lastSyncAt.seconds * 1000));
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.summary.trim()) {
      alert('Please fill in all required fields (name and summary).');
      return;
    }

    setSaving(true);

    try {
      const projectData: Partial<Project> = {
        name: formData.name.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies.filter(t => t.trim()),
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        isVisible: formData.isVisible,
        isPinned: formData.isPinned,
        source: formData.source || 'manual', // Ensure source is always set
        updatedAt: Timestamp.now(),
      };

      if (formData.completedAt) {
        projectData.completedAt = Timestamp.fromDate(new Date(formData.completedAt));
      }

      // Persist last sync timestamp if available
      if (lastSyncedAt) {
        projectData.lastSyncAt = Timestamp.fromDate(lastSyncedAt);
      }

      if (id) {
        await updateDocument(COLLECTIONS.PROJECTS, id, projectData);
        alert('Project updated successfully!');
      } else {
        projectData.createdAt = Timestamp.now();
        await createDocument(COLLECTIONS.PROJECTS, projectData);
        alert('Project created successfully!');
      }

      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      if (error instanceof Error) {
        alert(`Failed to save project: ${error.message}`);
      } else {
        alert('Failed to save project. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setCurrentImageUrl(url);
  };

  const handleTechInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tech = input.value.trim();
      if (tech && !formData.technologies.includes(tech)) {
        setFormData({
          ...formData,
          technologies: [...formData.technologies, tech]
        });
        input.value = '';
      }
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleSyncFromGitHub = async () => {
    if (!formData.githubUrl) {
      alert('Please enter a GitHub URL first.');
      return;
    }

    setSyncing(true);

    try {
      const syncedData = await syncRepositoryData(formData.githubUrl);

      // Merge synced data with existing form data
      // Allow manual overrides to persist, but update GitHub-sourced fields
      setFormData({
        ...formData,
        name: formData.name || syncedData.githubUrl.split('/').pop() || '',
        description: syncedData.description,
        technologies: syncedData.technologies,
        githubUrl: syncedData.githubUrl,
        liveUrl: syncedData.liveUrl || formData.liveUrl,
        source: 'github',
      });

      setLastSyncedAt(new Date());
      alert('Successfully synced from GitHub! Review the data and save when ready.');
    } catch (error) {
      console.error('Error syncing from GitHub:', error);
      alert(`Failed to sync from GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/projects">
          <Button variant="secondary" size="small">← Back to Projects</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Project' : 'New Project'}</CardTitle>
          <CardDescription>
            {id ? 'Update project information' : 'Add a new project to your portfolio'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Awesome Project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Summary * <span className="text-muted-foreground font-normal">(Brief overview for cards)</span>
              </label>
              <Input
                type="text"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="A brief one-line description of the project"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed project description, features, challenges, and outcomes..."
                className="w-full min-h-[150px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Technologies <span className="text-muted-foreground font-normal">(Press Enter or comma to add)</span>
              </label>
              <Input
                type="text"
                onKeyDown={handleTechInput}
                placeholder="React, TypeScript, Firebase..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="ml-2 hover:text-error"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub URL
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSyncFromGitHub}
                    disabled={syncing || !formData.githubUrl}
                  >
                    {syncing ? '⏳ Syncing...' : '🔄 Sync from GitHub'}
                  </Button>
                </div>
                {lastSyncedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last synced: {lastSyncedAt.toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Live Demo URL
                </label>
                <Input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Image
              </label>
              {currentImageUrl && (
                <ImagePreview src={currentImageUrl} alt="Project preview" />
              )}
              <FileUpload
                onUpload={handleImageUpload}
                folder="projects"
                accept="image/*"
              >
                Upload Project Screenshot
              </FileUpload>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Completion Date
              </label>
              <Input
                type="date"
                value={formData.completedAt}
                onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Make project visible on public site</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Pin to top (featured project)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
              </Button>
              <Link to="/admin/projects">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}