import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { MarkdownEditor } from '../components/editor/MarkdownEditor';
import { FileUpload, ImagePreview } from '../components/ui/FileUpload';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Post, getPosts, createDocument, deleteDocument, generateSlug, COLLECTIONS } from '../lib/firestore';
import { useAuth } from '../hooks/useAuth';
import { Timestamp } from 'firebase/firestore';

export function PostsManager() {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route path="/new" element={<PostEditor />} />
      <Route path="/edit/:id" element={<PostEditor />} />
    </Routes>
  );
}

function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await getPosts(false); // Get both published and drafts
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setPostToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.POSTS, postToDelete.id);
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts and articles</p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/new">Create New Post</Link>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No posts match your search.' : 'Get started by creating your first post.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/admin/posts/new">Create Your First Post</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <Badge variant={post.published ? 'accent' : 'secondary'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                      {post.featured && <Badge variant="primary">Featured</Badge>}
                    </div>
                    <CardDescription>{post.summary}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="small" asChild>
                      <Link to={`/admin/posts/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteClick(post.id!, post.title)}
                      className="text-error-600 hover:text-error-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>
                      Created: {post.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    {post.publishedAt && (
                      <span>
                        Published: {post.publishedAt.toDate().toLocaleDateString()}
                      </span>
                    )}
                    {post.viewCount && <span>{post.viewCount} views</span>}
                  </div>
                  <div className="flex gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Post"
        description={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
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

function PostEditor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    slug: '',
    summary: '',
    body: '',
    tags: [],
    published: false,
    featured: false,
    authorId: user?.uid || '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!post.tags?.includes(newTag)) {
        setPost(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleImageUpload = (url: string) => {
    setPost(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const handleSave = async (published: boolean) => {
    if (!post.title || !post.summary || !post.body) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const postData: Omit<Post, 'id'> = {
        title: post.title,
        slug: post.slug || generateSlug(post.title),
        summary: post.summary,
        body: post.body,
        tags: post.tags || [],
        published,
        featured: post.featured || false,
        imageUrl: post.imageUrl,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        authorId: user?.uid || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        viewCount: 0,
      };

      if (published) {
        postData.publishedAt = Timestamp.now();
      }

      await createDocument(COLLECTIONS.POSTS, postData);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Write and publish your blog post</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/posts">← Back to Posts</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                required
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
              <Input
                label="URL Slug"
                value={post.slug}
                onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                helperText="Automatically generated from title"
              />
              <Input
                label="Summary"
                required
                value={post.summary}
                onChange={(e) => setPost(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief description for post listings"
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={post.body || ''}
                onChange={(body) => setPost(prev => ({ ...prev, body }))}
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSave(false)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="w-full"
              >
                Publish Post
              </Button>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {post.imageUrl ? (
                <ImagePreview
                  src={post.imageUrl}
                  alt="Featured image"
                  onRemove={() => setPost(prev => ({ ...prev, imageUrl: undefined }))}
                />
              ) : (
                <FileUpload
                  onUpload={handleImageUpload}
                  folder="posts"
                  accept="image/*"
                />
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                helperText="Press Enter to add tags"
              />
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ✕
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={post.featured}
                  onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Featured post</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}