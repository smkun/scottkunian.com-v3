import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Image } from '../../components/ui/Image';
import { Project, getProjects, getProjectsByTechnology, getProjectById } from '../../lib/firestore';
import { highlightCode, getLanguageLabel } from '../../lib/syntaxHighlighter';

export function Projects() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsListing />} />
      <Route path="/:id" element={<ProjectDetail />} />
    </Routes>
  );
}

function ProjectsListing() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, [selectedTech]);

  const loadProjects = async () => {
    try {
      const allProjects = selectedTech
        ? await getProjectsByTechnology(selectedTech, true)
        : await getProjects(true); // Only visible projects
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique technologies from projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  const pinnedProjects = projects.filter(p => p.isPinned);
  const regularProjects = projects.filter(p => !p.isPinned);

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-muted-foreground">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md rounded-3xl shadow-2xl p-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of my work showcasing various technologies and problem-solving approaches
          </p>
        </div>

      {/* Technology Filter */}
      {allTechnologies.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTech === null ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setSelectedTech(null)}
            >
              All Projects
            </Button>
            {allTechnologies.map((tech) => (
              <Button
                key={tech}
                variant={selectedTech === tech ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Projects */}
      {pinnedProjects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </div>
      )}

      {/* Regular Projects */}
      {regularProjects.length > 0 && (
        <div>
          {pinnedProjects.length > 0 && (
            <h2 className="text-2xl font-bold mb-6">Other Projects</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {selectedTech
              ? `No projects found using ${selectedTech}. Try selecting a different technology.`
              : 'No projects available at the moment. Check back soon!'}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Card className={`flex flex-col h-full ${featured ? 'ring-2 ring-primary' : ''}`}>
      <Link to={`/projects/${project.id}`}>
        {project.imageUrl && (
          <div className="overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={project.imageUrl}
              alt={project.name}
              aspectRatio="16/9"
              objectFit="cover"
              showSkeleton
              className="w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </Link>
      <CardHeader>
        <div className="space-y-2">
          <Link to={`/projects/${project.id}`}>
            <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
              {project.name}
            </CardTitle>
          </Link>
          <CardDescription>{project.summary}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4 mb-4">
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          {project.githubData && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {project.githubData.stars} stars
              </span>
              {project.githubData.language && (
                <span className="flex items-center gap-1">
                  {project.githubData.language}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="secondary" size="small" className="w-full">
                View Code →
              </Button>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="primary" size="small" className="w-full">
                Live Demo →
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const projectData = await getProjectById(projectId);
      if (projectData && projectData.isVisible) {
        setProject(projectData);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-6 list-decimal">$1</li>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, language, code) => {
      const lang = language || 'text';
      const highlightedCode = highlightCode(code.trim(), lang);
      const langLabel = getLanguageLabel(lang);
      return `<div class="relative my-6">
        <div class="flex items-center justify-between bg-muted px-4 py-2 border-b border-border rounded-t-lg">
          <span class="text-xs font-medium text-muted-foreground">${langLabel}</span>
        </div>
        <pre class="p-4 bg-muted border border-border rounded-b-lg overflow-x-auto"><code>${highlightedCode}</code></pre>
      </div>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-muted text-sm rounded">$1</code>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = `<p class="mb-4">${html}</p>`;

    return html;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-muted-foreground">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button>← Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/projects">
            <Button variant="secondary" size="small">← Back to Projects</Button>
          </Link>
        </div>

        {project.imageUrl && (
          <div className="overflow-hidden rounded-lg bg-muted mb-8">
            <Image
              src={project.imageUrl}
              alt={project.name}
              aspectRatio="16/9"
              objectFit="cover"
              showSkeleton
              className="w-full h-full"
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">{project.summary}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary">{tech}</Badge>
            ))}
          </div>

          <div className="flex gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">
                  View on GitHub →
                </Button>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                  Live Demo →
                </Button>
              </a>
            )}
          </div>
        </div>

        {project.githubData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Repository Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Stars</div>
                  <div className="text-2xl font-bold">{project.githubData.stars}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Primary Language</div>
                  <div className="text-2xl font-bold">{project.githubData.language}</div>
                </div>
                {project.completedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                    <div className="text-lg font-bold">
                      {new Date(project.completedAt.seconds * 1000).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(project.description) }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}