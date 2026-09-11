// API Client & Service Layer terintegrasi dengan Backend Express.js & MySQL Laragon

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 1. Session Storage Helpers
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getAuthUser = (): { id: number; username: string; email: string } | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthSession = (token: string, user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Sinkronkan cookie untuk Server Components / Middleware
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
};

// 2. HTTP Request Wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada request.');
  }

  return data;
}

// 3. Auth API Endpoints
export const authApi = {
  register: async (payload: { username: string; email: string; password: string }) => {
    return request<{ success: boolean; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: { username?: string; email?: string; password: string }) => {
    return request<{
      success: boolean;
      message: string;
      token: string;
      data?: { id: number; username: string; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// 4. Todo API Endpoints (CRUD MySQL)
export const todoApi = {
  getAll: async () => {
    return request<{
      success: boolean;
      data: Array<{ id: number; user_id: number; task: string; is_completed: number }>;
    }>('/todos');
  },

  getById: async (id: number | string) => {
    return request<{
      success: boolean;
      data: { id: number; user_id: number; task: string; is_completed: number };
    }>(`/todos/${id}`);
  },

  create: async (task: string) => {
    return request<{
      success: boolean;
      message: string;
      data: { id: number; user_id: number; task: string; is_completed: number };
    }>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
  },

  update: async (id: number | string, payload: { is_completed?: boolean | number; task?: string }) => {
    return request<{ success: boolean; message: string }>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: number | string) => {
    return request<{ success: boolean; message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
