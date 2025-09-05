import React, { useState, useMemo } from 'react';
import { PlusCircle, Moon, Sun, FileText, Share } from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { SearchBar } from './components/SearchBar';
import { ShareModal } from './components/ShareModal';
import { SharedNote } from './components/SharedNote';
import { Note, NoteFilters } from './types/Note';

function App() {
  const { notes, loading, createNote, updateNote, deleteNote, shareNote, getSharedNote, filterNotes } = useNotes();
  const { theme, toggleTheme } = useTheme();
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({ search: '', tag: '' });
  const [currentView, setCurrentView] = useState<'main' | 'shared'>('main');
  const [sharedNote, setSharedNote] = useState<Note | null>(null);

  // Check if we're viewing a shared note
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/share/')) {
      const shareId = path.split('/share/')[1];
      const note = getSharedNote(shareId);
      if (note) {
        setSharedNote(note);
        setCurrentView('shared');
      }
    }
  }, [getSharedNote, notes]);

  const filteredNotes = useMemo(() => filterNotes(filters), [filterNotes, filters]);
  
  const availableTags = useMemo(() => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  }, [notes]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = (title: string, content: string, tags: string[]) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content, tags });
    } else {
      createNote(title, content, tags);
    }
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleShareNote = (noteId: string) => {
    const url = shareNote(noteId);
    if (url) {
      setShareUrl(url);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSharedNote(null);
    window.history.pushState({}, '', '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentView === 'shared' && sharedNote) {
    return <SharedNote note={sharedNote} onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <PlusCircle size={20} />
              New Note
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          filters={filters}
          onFiltersChange={setFilters}
          availableTags={availableTags}
        />

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <FileText size={64} className="mx-auto text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {notes.length === 0 ? 'No notes yet' : 'No notes found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              {notes.length === 0 
                ? 'Create your first note to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {notes.length === 0 && (
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all hover:scale-105 mx-auto"
              >
                <PlusCircle size={20} />
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onShare={handleShareNote}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showEditor && (
          <NoteEditor
            note={editingNote}
            onSave={handleSaveNote}
            onCancel={() => {
              setShowEditor(false);
              setEditingNote(null);
            }}
            onShare={editingNote ? handleShareNote : undefined}
          />
        )}

        {shareUrl && (
          <ShareModal
            shareUrl={shareUrl}
            onClose={() => setShareUrl(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;