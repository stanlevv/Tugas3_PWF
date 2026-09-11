export type Todo = {
  id: number;
  user_id?: number;
  task?: string;
  title: string;
  description?: string;
  is_completed?: number | boolean;
  completed: boolean;
  createdAt?: string;
};

export function normalizeTodo(raw: any): Todo {
  const isDone = Boolean(raw.is_completed === 1 || raw.is_completed === true || raw.completed === true);
  const taskText = raw.task || raw.title || 'Tugas Baru';
  return {
    id: Number(raw.id),
    user_id: raw.user_id ? Number(raw.user_id) : undefined,
    task: taskText,
    title: taskText,
    description: raw.description || `Tugas ID #${raw.id} tersimpan di basis data Laragon MySQL (todo_db).`,
    is_completed: isDone ? 1 : 0,
    completed: isDone,
    createdAt: raw.createdAt || new Date().toISOString().split('T')[0]
  };
}