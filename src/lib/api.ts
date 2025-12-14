// API service layer for connecting frontend to backend
const API_BASE_URL = '/api';

// Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        full_name: string;
        role: 'admin' | 'clerk';
    };
}

export interface Student {
    id: string;
    student_id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    level: string;
    study_mode: string;
    residential_status: string;
    registered_by: string;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    student_id: string;
    student_name: string;
    amount: number;
    payment_method: 'cash' | 'momo' | 'bank';
    reference_id: string;
    operator?: string;
    recorded_by: string;
    payment_date: string;
    created_at: string;
}

export interface User {
    id: string;
    username: string;
    full_name: string;
    role: 'admin' | 'clerk';
    permissions: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const token = getAuthToken();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

// Auth API
export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return makeRequest<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    refreshToken: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
        return makeRequest<LoginResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    },

    logout: async (): Promise<ApiResponse<void>> => {
        return makeRequest<void>('/auth/logout', {
            method: 'POST',
        });
    },
};

// Students API
export const studentsApi = {
    getAll: async (): Promise<ApiResponse<Student[]>> => {
        return makeRequest<Student[]>('/students');
    },

    getById: async (id: string): Promise<ApiResponse<Student>> => {
        return makeRequest<Student>(`/students/${id}`);
    },

    create: async (student: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'registered_by'>): Promise<ApiResponse<Student>> => {
        return makeRequest<Student>('/students', {
            method: 'POST',
            body: JSON.stringify(student),
        });
    },

    update: async (id: string, student: Partial<Student>): Promise<ApiResponse<Student>> => {
        return makeRequest<Student>(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(student),
        });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return makeRequest<void>(`/students/${id}`, {
            method: 'DELETE',
        });
    },
};

// Payments API
export const paymentsApi = {
    getAll: async (): Promise<ApiResponse<Payment[]>> => {
        return makeRequest<Payment[]>('/payments');
    },

    getById: async (id: string): Promise<ApiResponse<Payment>> => {
        return makeRequest<Payment>(`/payments/${id}`);
    },

    create: async (payment: Omit<Payment, 'id' | 'created_at' | 'recorded_by' | 'student_name'>): Promise<ApiResponse<Payment>> => {
        return makeRequest<Payment>('/payments', {
            method: 'POST',
            body: JSON.stringify(payment),
        });
    },

    update: async (id: string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> => {
        return makeRequest<Payment>(`/payments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payment),
        });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return makeRequest<void>(`/payments/${id}`, {
            method: 'DELETE',
        });
    },
};

// Users API
export const usersApi = {
    getAll: async (): Promise<ApiResponse<User[]>> => {
        return makeRequest<User[]>('/users');
    },

    getById: async (id: string): Promise<ApiResponse<User>> => {
        return makeRequest<User>(`/users/${id}`);
    },

    create: async (user: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<ApiResponse<User>> => {
        return makeRequest<User>('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    },

    update: async (id: string, user: Partial<User> & { password?: string }): Promise<ApiResponse<User>> => {
        return makeRequest<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return makeRequest<void>(`/users/${id}`, {
            method: 'DELETE',
        });
    },
};

// Dashboard/Analytics API
export const analyticsApi = {
    getDashboardStats: async (): Promise<ApiResponse<any>> => {
        return makeRequest<any>('/analytics/dashboard');
    },

    getUserAnalytics: async (): Promise<ApiResponse<any>> => {
        return makeRequest<any>('/analytics/users');
    },

    getStudentStats: async (): Promise<ApiResponse<any>> => {
        return makeRequest<any>('/analytics/students');
    },
};

// Health check
export const healthApi = {
    check: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
        return makeRequest<{ status: string; timestamp: string }>('/health');
    },
};