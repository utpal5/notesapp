export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  shareId?: string;
}

export interface NoteFilters {
  search: string;
  tag: string;
}