import { apiClient, ApiResponse } from './api';
import { Todo, normalizeTodo } from '@/types/todo';
import { ApiTodo, TodosApiResponse } from '@/types/api-todo';

export interface GetTodosParams {
    page?: number;
    perPage?: number;
    projectId?: number | null;
    limit?: number;
    skip?: number;
}

export type FetchTodosParams = GetTodosParams;

export const todoService = {
    // 1. Primary CRUD against Express Backend MySQL
    async getTodos(params: GetTodosParams = {}): Promise<{ todos: Todo[]; total: number }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.perPage) queryParams.append('perPage', String(params.perPage));
        if (params.projectId) queryParams.append('project_id', String(params.projectId));

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const res = await apiClient<ApiResponse<any[]>>(`/todos${queryString}`);

        const rawList = Array.isArray(res.data) ? res.data : [];
        const todos = rawList.map(normalizeTodo);
        const total = res.meta?.total || todos.length;

        return { todos, total };
    },

    async getTodoById(id: number | string): Promise<Todo> {
        const res = await apiClient<ApiResponse<any>>(`/todos/${id}`);
        if (!res.data) {
            throw new Error('Tugas tidak ditemukan.');
        }
        return normalizeTodo(res.data);
    },

    async createTodo(task: string, projectId?: number | null): Promise<Todo> {
        const res = await apiClient<ApiResponse<any>>('/todos', {
            method: 'POST',
            body: JSON.stringify({ task, project_id: projectId || undefined }),
        });
        return normalizeTodo(res.data);
    },

    async updateTodo(
        id: number | string,
        payload: { task?: string; is_completed?: boolean | number }
    ): Promise<void> {
        await apiClient<ApiResponse>(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    async deleteTodo(id: number | string): Promise<void> {
        await apiClient<ApiResponse>(`/todos/${id}`, {
            method: 'DELETE',
        });
    },

    // 2. Compatibility helpers for practice route handlers
    async fetchTodos(params: FetchTodosParams = { limit: 15, skip: 0 }): Promise<TodosApiResponse> {
        const { limit = 15, skip = 0 } = params;
        const page = Math.floor(skip / limit) + 1;
        const result = await this.getTodos({ page, perPage: limit });
        return {
            todos: result.todos.map((t) => ({
                id: t.id,
                todo: t.title,
                completed: t.completed,
                userId: t.user_id || 1,
            })),
            total: result.total,
            skip,
            limit,
        };
    },

    async fetchTodoById(id: number | string): Promise<ApiTodo> {
        const t = await this.getTodoById(id);
        return {
            id: t.id,
            todo: t.title,
            completed: t.completed,
            userId: t.user_id || 1,
        };
    },

    async updateTodoStatus(id: number | string, completed: boolean): Promise<ApiTodo> {
        await this.updateTodo(id, { is_completed: completed });
        return {
            id: Number(id),
            todo: '',
            completed,
            userId: 1,
        };
    }
};