import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Note,
  getNotes,
  createDocument,
  deleteDocument,
  updateDocument,
  getDocument,
  COLLECTIONS,
} from '../lib/firestore';
import { auth } from '../lib/firebase';
import { Timestamp } from 'firebase/firestore';

export function NotesManager() {
  return (
    <Routes>
      <Route path="/" element={<NotesList />} />
      <Route path="/new" element={<NybleEditor />} />
      <Route path="/edit/:id" element={<NybleEditor />} />
    </Routes>
  );
}

function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await getNotes(false);
      // Sort by newest first
      const sortedNotes = allNotes.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, content: string) => {
    const preview =
      content.length > 50 ? content.substring(0, 50) + '...' : content;
    setNoteToDelete({ id, content: preview });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    setDeleting(true);
    try {
      await deleteDocument(COLLECTIONS.NOTES, noteToDelete.id);
      setNotes(notes.filter((note) => note.id !== noteToDelete.id));
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nybles</h1>
          <p className="text-muted-foreground">Quick thoughts and stories</p>
        </div>
        <Button asChild>
          <Link to="/admin/notes/new">Add Nyble</Link>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search nybles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notes yet
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'No nybles match your search.'
                : 'Start capturing your thoughts and stories.'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/admin/notes/new">Add Nyble</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {note.mood && (
                        <Badge
                          variant={
                            note.mood === 'positive'
                              ? 'accent'
                              : note.mood === 'critical'
                                ? 'error'
                                : 'secondary'
                          }
                        >
                          {note.mood}
                        </Badge>
                      )}
                      <Badge variant={note.isPublic ? 'accent' : 'secondary'}>
                        {note.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                    <CardDescription className="text-foreground whitespace-pre-wrap">
                      {note.content.length > 300
                        ? `${note.content.substring(0, 300)}...`
                        : note.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="small" asChild>
                      <Link to={`/admin/notes/edit/${note.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteClick(note.id!, note.content)}
                      className="text-error-600 hover:text-error-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <span>
                    Created: {note.createdAt?.toDate().toLocaleDateString()}
                  </span>
                  {note.updatedAt && (
                    <span className="ml-4">
                      Updated: {note.updatedAt.toDate().toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Note"
        description={`Are you sure you want to delete this note: "${noteToDelete?.content}"? This action cannot be undone.`}
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

function NybleEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id);
  const [nyble, setNyble] = useState({
    heading: '',
    content: '',
    isPublic: false,
    mood: 'neutral' as 'positive' | 'neutral' | 'critical',
  });

  useEffect(() => {
    if (id) {
      loadNyble();
    }
  }, [id]);

  const loadNyble = async () => {
    if (!id) return;

    setLoadingData(true);
    try {
      const noteData = await getDocument<Note>(COLLECTIONS.NOTES, id);
      if (noteData) {
        // Parse existing content - look for markdown heading pattern **Title**
        const titleMatch = noteData.content.match(/\*\*(.*?)\*\*/);
        const heading = titleMatch ? titleMatch[1] : '';
        const content = titleMatch
          ? noteData.content.replace(/\*\*.*?\*\*\n\n/, '').trim()
          : noteData.content;

        setNyble({
          heading,
          content,
          isPublic: noteData.isPublic,
          mood: noteData.mood || 'neutral',
        });
      }
    } catch (error) {
      console.error('Error loading nyble:', error);
      alert('Failed to load nyble. Please try again.');
      navigate('/admin/notes');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    if (!nyble.content.trim()) {
      alert('Please enter some content for your nyble');
      return;
    }

    setLoading(true);
    try {
      // Ensure the current user has admin claim before allowing writes
      const user = auth.currentUser;
      if (!user) {
        alert('You must be signed in as an admin to save nybles.');
        setLoading(false);
        return;
      }
      const idToken = await user.getIdTokenResult();
      if (!idToken.claims || !idToken.claims.admin) {
        alert(
          'Insufficient permissions: only admins can create or edit nybles.'
        );
        setLoading(false);
        return;
      }
      // Format content with heading if provided
      const formattedContent = nyble.heading.trim()
        ? `**${nyble.heading.trim()}**\n\n${nyble.content.trim()}`
        : nyble.content.trim();

      const noteData: Omit<Note, 'id'> = {
        content: formattedContent,
        tags: [], // No tags in simplified version
        type: 'quick', // All nybles are 'quick' type now
        mood: nyble.mood,
        isPublic: nyble.isPublic,
        createdAt: id ? (undefined as any) : Timestamp.now(), // Don't update createdAt on edit
        updatedAt: Timestamp.now(),
      };

      if (id) {
        // Update existing nyble
        await updateDocument(COLLECTIONS.NOTES, id, noteData);
      } else {
        // Create new nyble
        await createDocument(COLLECTIONS.NOTES, noteData);
      }

      navigate('/admin/notes');
    } catch (error) {
      console.error('Error saving nyble:', error);
      alert('Failed to save nyble. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading nyble...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {id ? 'Edit Nyble' : 'New Nyble'}
          </h1>
          <p className="text-muted-foreground">
            {id
              ? 'Update your thought or story'
              : 'Capture a quick thought or story'}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/notes">← Back to Nybles</Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit' : 'Create'} Nyble</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Heading */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heading (Optional)
              </label>
              <Input
                placeholder="Enter a heading for your nyble..."
                value={nyble.heading}
                onChange={(e) =>
                  setNyble((prev) => ({ ...prev, heading: e.target.value }))
                }
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {nyble.heading.length}/100 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                className="w-full h-48 p-3 border border-border rounded-lg resize-y bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={nyble.content}
                onChange={(e) =>
                  setNyble((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="What's on your mind?"
              />
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mood
                </label>
                <div className="flex gap-2">
                  {(['positive', 'neutral', 'critical'] as const).map(
                    (mood) => (
                      <Button
                        key={mood}
                        variant={nyble.mood === mood ? 'secondary' : 'ghost'}
                        size="small"
                        onClick={() => setNyble((prev) => ({ ...prev, mood }))}
                      >
                        {mood === 'positive'
                          ? '😊'
                          : mood === 'critical'
                            ? '🤔'
                            : '😐'}{' '}
                        {mood}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={nyble.isPublic}
                  onChange={(e) =>
                    setNyble((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Make this nyble public</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={loading || !nyble.content.trim()}
                className="flex-1"
              >
                {loading ? 'Saving...' : id ? 'Update Nyble' : 'Save Nyble'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/notes')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
