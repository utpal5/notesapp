import React from 'react';
import { Note } from '../types/Note';
import { Edit3, Trash2, Share, Tag } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onShare }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-700 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {note.title || 'Untitled'}
        </h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onShare(note.id)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-lg transition-all"
          >
            <Share size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {note.content && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {truncateContent(note.content)}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(note.updatedAt)}
        </span>
      </div>

      {note.isPublic && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">
            <Share size={10} />
            Public
          </span>
        </div>
      )}
    </div>
  );
};