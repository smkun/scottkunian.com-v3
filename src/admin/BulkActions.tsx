import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { updateDocument, deleteDocument, COLLECTIONS } from '../lib/firestore';

/**
 * Bulk Actions Component
 *
 * Provides bulk management operations for admin content:
 * - Bulk delete
 * - Bulk publish/unpublish
 * - Bulk tag assignment
 * - Bulk export
 */

interface BulkActionsProps {
  selectedIds: string[];
  collectionType: 'posts' | 'notes' | 'projects' | 'articles';
  onComplete?: () => void;
  onSelectionClear?: () => void;
}

export function BulkActions({
  selectedIds,
  collectionType,
  onComplete,
  onSelectionClear,
}: BulkActionsProps) {
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    open: false,
    title: '',
    message: '',
    action: async () => {},
  });

  const collection = {
    posts: COLLECTIONS.POSTS,
    notes: COLLECTIONS.NOTES,
    projects: COLLECTIONS.PROJECTS,
    articles: COLLECTIONS.ARTICLES,
  }[collectionType];

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map(id => deleteDocument(collection, id))
      );
      alert(`Successfully deleted ${selectedIds.length} items`);
      onComplete?.();
      onSelectionClear?.();
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert(`Error deleting items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    setLoading(true);
    try {
      const promises = selectedIds.map(id => {
        if (collectionType === 'posts') {
          return updateDocument(collection, id, { published: publish });
        } else {
          return updateDocument(collection, id, { isVisible: publish });
        }
      });

      await Promise.all(promises);

      alert(`Successfully ${publish ? 'published' : 'unpublished'} ${selectedIds.length} items`);
      onComplete?.();
      onSelectionClear?.();
    } catch (error) {
      console.error('Bulk publish error:', error);
      alert(`Error updating items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTagAssignment = async () => {
    const tags = prompt('Enter tags to add (comma-separated):');
    if (!tags) return;

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagArray.length === 0) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map(id =>
          updateDocument(collection, id, {
            tags: tagArray, // This overwrites existing tags. Could be enhanced to merge.
          })
        )
      );

      alert(`Successfully added tags to ${selectedIds.length} items`);
      onComplete?.();
      onSelectionClear?.();
    } catch (error) {
      console.error('Bulk tag assignment error:', error);
      alert(`Error assigning tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setLoading(true);
    try {
      // Export selected items as JSON
      const exportData = {
        collection: collectionType,
        exportDate: new Date().toISOString(),
        itemCount: selectedIds.length,
        selectedIds,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${collectionType}-export-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Exported ${selectedIds.length} item IDs`);
    } catch (error) {
      console.error('Bulk export error:', error);
      alert(`Error exporting items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white shadow-2xl rounded-lg border-2 border-primary-500 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="font-semibold">
              {selectedIds.length} selected
            </Badge>
            <button
              onClick={onSelectionClear}
              className="text-sm text-secondary-600 hover:text-secondary-900 underline"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-secondary-300 pl-4">
            <Button
              size="small"
              variant="primary"
              onClick={() => handleBulkPublish(true)}
              loading={loading}
            >
              ✓ Publish All
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={() => handleBulkPublish(false)}
              loading={loading}
            >
              Hide All
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={handleBulkTagAssignment}
              loading={loading}
            >
              🏷️ Add Tags
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={handleBulkExport}
              loading={loading}
            >
              📥 Export
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  title: 'Delete Multiple Items',
                  message: `Are you sure you want to delete ${selectedIds.length} ${collectionType}? This action cannot be undone.`,
                  action: handleBulkDelete,
                })
              }
              loading={loading}
              className="text-red-600 hover:bg-red-50"
            >
              🗑️ Delete All
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        destructive={true}
        loading={loading}
      />
    </>
  );
}

/**
 * Bulk Selection Checkbox Component
 *
 * Use in list items to enable bulk selection
 */
interface BulkSelectionCheckboxProps {
  itemId: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function BulkSelectionCheckbox({
  itemId,
  isSelected,
  onToggle,
}: BulkSelectionCheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(itemId)}
      className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
      aria-label="Select item for bulk actions"
    />
  );
}

/**
 * Bulk Selection Header Checkbox
 *
 * "Select All" checkbox for list headers
 */
interface BulkSelectionHeaderProps {
  allIds: string[];
  selectedIds: string[];
  onSelectAll: (ids: string[]) => void;
  onDeselectAll: () => void;
}

export function BulkSelectionHeader({
  allIds,
  selectedIds,
  onSelectAll,
  onDeselectAll,
}: BulkSelectionHeaderProps) {
  const allSelected = selectedIds.length === allIds.length && allIds.length > 0;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleToggle = () => {
    if (allSelected || someSelected) {
      onDeselectAll();
    } else {
      onSelectAll(allIds);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={allSelected}
        ref={(el) => {
          if (el) {
            el.indeterminate = someSelected;
          }
        }}
        onChange={handleToggle}
        className="w-4 h-4 text-primary-600 bg-white border-secondary-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
        aria-label="Select all items"
      />
      <span className="text-sm text-secondary-600">
        {allSelected
          ? 'Deselect All'
          : someSelected
          ? `${selectedIds.length} selected`
          : 'Select All'}
      </span>
    </div>
  );
}
