import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
// FileUpload no longer needed - using numbered images
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Article, getArticles, getArticleById, createDocument, updateDocument, deleteDocument, COLLECTIONS } from '../lib/firestore';
import { Timestamp } from 'firebase/firestore';

export function ArticlesManager() {
  return (
    <Routes>
      <Route path="/" element={<ArticlesList />} />
      <Route path="/new" element={<ArticleEditor />} />
      <Route path="/edit/:id" element={<ArticleEditor />} />
    </Routes>
  );
}

function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const allArticles = await getArticles(false); // Get both visible and hidden
      setArticles(allArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setArticleToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;

    setDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.ARTICLES, articleToDelete.id);
      setArticles(articles.filter(article => article.id !== articleToDelete.id));
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const handleToggleVisibility = async (article: Article) => {
    if (!article.id) return;

    try {
      await updateDocument(COLLECTIONS.ARTICLES, article.id, {
        isVisible: !article.isVisible,
      });
      setArticles(articles.map(a =>
        a.id === article.id ? { ...a, isVisible: !a.isVisible } : a
      ));
    } catch (error) {
      console.error('Error updating article visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground mt-1">Manage LinkedIn articles and manual entries</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => alert('LinkedIn import configured via server-side script.\n\nRun: node scripts/linkedinImport.cjs <profile-url>\n\nSee docs/LINKEDIN_IMPORT_SETUP.md for details.')}
            title="Import articles from LinkedIn via RapidAPI"
          >
            🔗 Import from LinkedIn
          </Button>
          <Link to="/admin/articles/new">
            <Button>+ New Article</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search articles by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No articles match your search.' : 'No articles yet. Create your first article!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{article.title}</CardTitle>
                      <Badge variant={article.isVisible ? 'accent' : 'secondary'}>
                        {article.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      <Badge variant={article.source === 'linkedin' ? 'secondary' : 'primary'}>
                        {article.source === 'linkedin' ? '🔗 LinkedIn' : '✏️ Manual'}
                      </Badge>
                    </div>
                    {article.description && (
                      <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Published: {formatDate(article.publishedAt)}</span>
                      {article.linkedinData && (
                        <>
                          <span>👍 {article.linkedinData.reactionsCount || 0}</span>
                          <span>💬 {article.linkedinData.commentsCount || 0}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleToggleVisibility(article)}
                    >
                      {article.isVisible ? 'Hide' : 'Show'}
                    </Button>
                    <Link to={`/admin/articles/edit/${article.id}`}>
                      <Button variant="secondary" size="small">Edit</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => article.id && handleDeleteClick(article.id, article.title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Article"
        description={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
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

function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    imageNumber: '', // Just store the number, not full path
    publishedDate: '',
    isVisible: true,
    source: 'manual' as 'manual' | 'linkedin',
    reactionsCount: 0,
    commentsCount: 0,
    engagementCount: 0,
  });

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      const article = await getArticleById(articleId);
      if (article) {
        // Extract image number from URL like /images/articles/5.webp -> 5
        let imageNumber = '';
        if (article.imageUrl) {
          const match = article.imageUrl.match(/\/images\/articles\/(\d+)\.(webp|png|jpg)/);
          if (match) {
            imageNumber = match[1];
          }
        }

        setFormData({
          title: article.title,
          url: article.url,
          description: article.description || '',
          imageNumber: imageNumber,
          publishedDate: article.publishedAt
            ? new Date(article.publishedAt.seconds * 1000).toISOString().split('T')[0]
            : '',
          isVisible: article.isVisible,
          source: article.source,
          reactionsCount: article.linkedinData?.reactionsCount || 0,
          commentsCount: article.linkedinData?.commentsCount || 0,
          engagementCount: article.linkedinData?.engagementCount || 0,
        });
        setCurrentImageUrl(article.imageUrl || '');
      }
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Please fill in all required fields (title and URL).');
      return;
    }

    setSaving(true);

    try {
      // Generate image URL from number: 5 -> /images/articles/5.webp
      const imageUrl = formData.imageNumber.trim()
        ? `/images/articles/${formData.imageNumber.trim()}.webp`
        : undefined;

      const articleData: Partial<Article> = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: imageUrl,
        isVisible: formData.isVisible,
        source: formData.source,
      };

      if (formData.publishedDate) {
        // Parse date as local midnight to avoid timezone issues
        const [year, month, day] = formData.publishedDate.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 12, 0, 0); // Use noon to avoid DST issues
        articleData.publishedAt = Timestamp.fromDate(localDate);
      } else {
        articleData.publishedAt = Timestamp.now();
      }

      if (formData.source === 'linkedin') {
        articleData.linkedinData = {
          reactionsCount: formData.reactionsCount,
          commentsCount: formData.commentsCount,
          engagementCount: formData.engagementCount,
        };
      }

      if (id) {
        articleData.lastSyncAt = Timestamp.now();
        await updateDocument(COLLECTIONS.ARTICLES, id, articleData);
        alert('Article updated successfully!');
      } else {
        articleData.createdAt = Timestamp.now();
        await createDocument(COLLECTIONS.ARTICLES, articleData);
        alert('Article created successfully!');
      }

      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link to="/admin/articles">
          <Button variant="secondary" size="small">← Back to Articles</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Article' : 'New Article'}</CardTitle>
          <CardDescription>
            {id ? 'Update article information' : 'Add a new article entry'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Article Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title from LinkedIn or custom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Article URL *
              </label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.linkedin.com/pulse/..."
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
                placeholder="Article summary or excerpt..."
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image Number
              </label>
              <Input
                type="number"
                value={formData.imageNumber}
                onChange={(e) => {
                  const num = e.target.value;
                  setFormData({ ...formData, imageNumber: num });
                  // Update preview URL
                  if (num.trim()) {
                    setCurrentImageUrl(`/images/articles/${num.trim()}.webp`);
                  } else {
                    setCurrentImageUrl('');
                  }
                }}
                placeholder="Enter article number (e.g., 5)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Will use: /images/articles/{formData.imageNumber || 'N'}.webp
              </p>
              {currentImageUrl && (
                <div className="mt-2">
                  <img
                    src={currentImageUrl}
                    alt="Article preview"
                    className="max-w-xs rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Published Date
              </label>
              <Input
                type="date"
                value={formData.publishedDate}
                onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.source === 'manual'}
                    onChange={() => setFormData({ ...formData, source: 'manual' })}
                  />
                  <span className="text-sm">Manual Entry</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.source === 'linkedin'}
                    onChange={() => setFormData({ ...formData, source: 'linkedin' })}
                  />
                  <span className="text-sm">LinkedIn Import</span>
                </label>
              </div>
            </div>

            {/* LinkedIn engagement stats removed - no longer tracking manually */}
            {formData.source === 'linkedin' && (
              <div className="text-xs text-muted-foreground italic p-3 bg-muted/30 rounded-md">
                Note: LinkedIn engagement stats are not tracked in this version.
              </div>
            )}

            {false && formData.source === 'linkedin' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reactions Count
                  </label>
                  <Input
                    type="number"
                    value={formData.reactionsCount}
                    onChange={(e) => setFormData({ ...formData, reactionsCount: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comments Count
                  </label>
                  <Input
                    type="number"
                    value={formData.commentsCount}
                    onChange={(e) => setFormData({ ...formData, commentsCount: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Engagement Count
                  </label>
                  <Input
                    type="number"
                    value={formData.engagementCount}
                    onChange={(e) => setFormData({ ...formData, engagementCount: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Make article visible on public site</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : id ? 'Update Article' : 'Create Article'}
              </Button>
              <Link to="/admin/articles">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
