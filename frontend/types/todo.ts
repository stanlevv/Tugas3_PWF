export type Todo = {
  id: number;
  user_id?: number;
  project_id?: number | null;
  task?: string;
  title: string;
  description?: string;
  is_completed?: number | boolean;
  completed: boolean;
  creator_username?: string;
  project_name?: string;
  createdAt?: string;
};

export interface ProjectData {
  id: number;
  name: string;
  code: string;
  created_by: number;
  created_at?: string;
  creator_username?: string;
  member_count?: number;
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: number;
  username: string;
  email: string;
  joined_at: string;
}

export function normalizeTodo(raw: any): Todo {
  const isDone = Boolean(raw.is_completed === 1 || raw.is_completed === true || raw.completed === true);
  const taskText = raw.task || raw.title || 'Tugas Baru';
  return {
    id: Number(raw.id),
    user_id: raw.user_id ? Number(raw.user_id) : undefined,
    project_id: raw.project_id ? Number(raw.project_id) : null,
    task: taskText,
    title: taskText,
    description: raw.description || `Tugas ID #${raw.id} tersimpan di basis data Laragon MySQL (todo_db).`,
    is_completed: isDone ? 1 : 0,
    completed: isDone,
    creator_username: raw.creator_username || undefined,
    project_name: raw.project_name || undefined,
    createdAt: raw.createdAt || new Date().toISOString().split('T')[0]
  };
}