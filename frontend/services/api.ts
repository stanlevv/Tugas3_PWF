export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
    status: number;
    statusText: string;
    data?: any;

    constructor(message: string, status: number, statusText: string, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        page?: number;
        perPage?: number;
        total?: number;
        totalPages?: number;
        [key: string]: any;
    };
}

export async function apiClient<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const cleanBase = API_BASE_URL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBase}${cleanEndpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(url, {
            signal: options.signal || AbortSignal.timeout(8000),
            ...options,
            headers,
        });

        const json = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMsg = json?.message || `HTTP Error ${response.status}: ${response.statusText}`;
            throw new ApiError(errorMsg, response.status, response.statusText, json);
        }

        return json as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(
            `Network Error: Tidak dapat terhubung ke server backend (${(error as Error).message})`
        );
    }
}