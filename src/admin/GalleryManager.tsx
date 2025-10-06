import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  COLLECTIONS,
  GalleryCategory,
  getGalleryCategories,
  getGalleryCategoryById,
  createDocument,
  updateDocument,
  deleteDocument,
  generateSlug,
} from '../lib/firestore';
import { Timestamp } from 'firebase/firestore';

export function GalleryManager() {
  return (
    <Routes>
      <Route index element={<CategoryList />} />
      <Route path="new" element={<CategoryEditor />} />
      <Route path="edit/:id" element={<CategoryEditor />} />
    </Routes>
  );
}

function CategoryList() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<GalleryCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getGalleryCategories(false);
      setCategories(data);
    } catch (error) {
      console.error('Error loading gallery categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category: GalleryCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete?.id) return;

    setDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.GALLERIES, categoryToDelete.id);
      await loadCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const toggleVisibility = async (category: GalleryCategory) => {
    if (!category.id) return;
    try {
      await updateDocument(COLLECTIONS.GALLERIES, category.id, {
        isVisible: !category.isVisible,
      });
      await loadCategories();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.folderPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading gallery categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Gallery Categories</h2>
        <Button onClick={() => navigate('/admin/gallery/new')}>
          Add New Category
        </Button>
      </div>

      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid gap-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {searchTerm ? 'No categories match your search' : 'No gallery categories yet. Create your first one!'}
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.isVisible
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {category.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        Order: {category.sortOrder}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Folder:</strong> /public/images/gallery/{category.folderPath}
                    </p>
                    {category.description && (
                      <p className="text-sm text-foreground/80 mb-2">{category.description}</p>
                    )}
                    {category.imageCount !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        {category.imageCount} {category.imageCount === 1 ? 'image' : 'images'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => toggleVisibility(category)}
                      title={category.isVisible ? 'Hide category' : 'Show category'}
                    >
                      {category.isVisible ? '👁️' : '🙈'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => navigate(`/admin/gallery/edit/${category.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteClick(category)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Gallery Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This will not delete the actual images, only the category reference.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
        loading={deleting}
      />
    </div>
  );
}

function CategoryEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    folderPath: '',
    description: '',
    sortOrder: 0,
    isVisible: true,
  });

  useEffect(() => {
    if (id) {
      loadCategory(id);
    }
  }, [id]);

  const loadCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const category = await getGalleryCategoryById(categoryId);
      if (category) {
        setFormData({
          name: category.name,
          folderPath: category.folderPath,
          description: category.description || '',
          sortOrder: category.sortOrder,
          isVisible: category.isVisible,
        });
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.folderPath.trim()) {
      alert('Name and folder path are required');
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(formData.name);
      const categoryData: Omit<GalleryCategory, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        slug,
        folderPath: formData.folderPath.trim(),
        description: formData.description.trim() || undefined,
        isVisible: formData.isVisible,
        sortOrder: formData.sortOrder,
        imageCount: 0, // Will be updated when images are scanned
      };

      if (id) {
        await updateDocument(COLLECTIONS.GALLERIES, id, categoryData);
      } else {
        await createDocument(COLLECTIONS.GALLERIES, {
          ...categoryData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      navigate('/admin/gallery');
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading category...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/gallery" className="text-primary hover:underline">
          ← Back to Categories
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit' : 'New'} Gallery Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Category Name *
              </label>
              <Input
                id="name"
                placeholder="Asia Trip, Pets, Miniatures..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Display name for the gallery category
              </p>
            </div>

            <div>
              <label htmlFor="folderPath" className="block text-sm font-medium text-foreground mb-2">
                Folder Path *
              </label>
              <Input
                id="folderPath"
                placeholder="AsiaTrip, Pets, Miniatures..."
                value={formData.folderPath}
                onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Folder name in <code className="bg-muted px-1 rounded">/public/images/gallery/</code> (no slashes)
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Brief description of this gallery..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-foreground mb-2">
                Sort Order
              </label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first on the gallery page
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="isVisible" className="text-sm font-medium text-foreground">
                Visible to public
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={saving}>
                {id ? 'Update Category' : 'Create Category'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/gallery')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
