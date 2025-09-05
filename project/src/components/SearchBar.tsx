import React from 'react';
import { Search, Filter } from 'lucide-react';
import { NoteFilters } from '../types/Note';

interface SearchBarProps {
  filters: NoteFilters;
  onFiltersChange: (filters: NoteFilters) => void;
  availableTags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, availableTags }) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      
      <div className="relative">
        <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={filters.tag}
          onChange={(e) => onFiltersChange({ ...filters, tag: e.target.value })}
          className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[140px]"
        >
          <option value="">All Tags</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};