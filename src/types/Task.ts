export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskCreateInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskFilter {
  searchTerm: string;
  status: 'all' | 'active' | 'completed';
  priority: '' | TaskPriority;
  tags: string[];
}