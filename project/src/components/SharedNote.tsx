import React from 'react';
import { Note } from '../types/Note';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface SharedNoteProps {
  note: Note;
  onBack: () => void;
}

export const SharedNote: React.FC<SharedNoteProps> = ({ note, onBack }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Notes
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title || 'Untitled Note'}
          </h1>

          <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(note.updatedAt)}
            </div>
            {note.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <div className="flex gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
              {note.content || 'This note is empty.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};