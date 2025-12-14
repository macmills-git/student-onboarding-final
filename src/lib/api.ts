// API service layer for connecting frontend to backend
const API_BASE_URL = '/api';

// Mock data for demo purposes (no backend required)
const MOCK_MODE = true; // Set to false when backend is deployed

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

// Mock data generator
const generateMockData = (endpoint: string, method: string = 'GET', body?: any): any => {
    // Mock students data
    if (endpoint.includes('/students')) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (method === 'POST') {
            // Create new student
            const newStudent = {
                id: String(Date.now()),
                student_id: body?.student_id || `STU${String(Date.now()).slice(-3)}`,
                name: body?.name || 'New Student',
                email: body?.email || 'student@example.com',
                phone: body?.phone || '+233000000000',
                course: body?.course || 'Computer Science',
                level: body?.level || '100',
                study_mode: body?.study_mode || 'regular',
                residential_status: body?.residential_status || 'resident',
                registered_by: 'mcmills',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            return {
                success: true,
                data: newStudent,
                message: 'Student registered successfully'
            };
        }

        if (method === 'PUT') {
            // Update student
            return {
                success: true,
                data: {
                    id: endpoint.split('/').pop(),
                    student_id: body?.student_id || 'STU001',
                    name: body?.name || 'Updated Student',
                    email: body?.email || 'updated@example.com',
                    phone: body?.phone || '+233000000000',
                    course: body?.course || 'Computer Science',
                    level: body?.level || '100',
                    study_mode: body?.study_mode || 'regular',
                    residential_status: body?.residential_status || 'resident',
                    registered_by: 'mcmills',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: new Date().toISOString()
                },
                message: 'Student updated successfully'
            };
        }

        if (method === 'DELETE') {
            // Delete student
            return {
                success: true,
                message: 'Student deleted successfully'
            };
        }

        return {
            success: true,
            data: [
                {
                    id: '1',
                    student_id: 'STU001',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+233123456789',
                    course: 'Computer Science',
                    level: '300',
                    study_mode: 'regular',
                    residential_status: 'resident',
                    registered_by: 'mcmills',
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    updated_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '2',
                    student_id: 'STU002',
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '+233987654321',
                    course: 'Information Technology',
                    level: '200',
                    study_mode: 'regular',
                    residential_status: 'non-resident',
                    registered_by: 'clerk',
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    updated_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '3',
                    student_id: 'STU003',
                    name: 'Michael Johnson',
                    email: 'michael.johnson@example.com',
                    phone: '+233555123456',
                    course: 'Mathematical Science',
                    level: '400',
                    study_mode: 'regular',
                    residential_status: 'resident',
                    registered_by: 'mcmills',
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    updated_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '4',
                    student_id: 'STU004',
                    name: 'Sarah Wilson',
                    email: 'sarah.wilson@example.com',
                    phone: '+233777987654',
                    course: 'Actuarial Science',
                    level: '200',
                    study_mode: 'regular',
                    residential_status: 'non-resident',
                    registered_by: 'clerk',
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    updated_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '5',
                    student_id: 'STU005',
                    name: 'David Brown',
                    email: 'david.brown@example.com',
                    phone: '+233666555444',
                    course: 'Physical Science',
                    level: '300',
                    study_mode: 'distance',
                    residential_status: 'non-resident',
                    registered_by: 'mcmills',
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    updated_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                }
            ]
        };
    }

    // Mock payments data
    if (endpoint.includes('/payments')) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (method === 'POST') {
            // Create new payment
            const newPayment = {
                id: String(Date.now()),
                student_id: body?.student_id || '1',
                student_name: body?.student_name || 'Unknown Student',
                amount: body?.amount || 0,
                payment_method: body?.payment_method || 'cash',
                reference_id: body?.reference_id || `PAY${String(Date.now()).slice(-3)}`,
                operator: body?.operator || null,
                recorded_by: 'mcmills',
                payment_date: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
            return {
                success: true,
                data: newPayment,
                message: 'Payment recorded successfully'
            };
        }

        if (method === 'PUT') {
            // Update payment
            return {
                success: true,
                data: {
                    id: endpoint.split('/').pop(),
                    student_id: body?.student_id || '1',
                    student_name: body?.student_name || 'Updated Student',
                    amount: body?.amount || 0,
                    payment_method: body?.payment_method || 'cash',
                    reference_id: body?.reference_id || 'PAY001',
                    operator: body?.operator || null,
                    recorded_by: 'mcmills',
                    payment_date: body?.payment_date || new Date().toISOString(),
                    created_at: '2024-01-01T00:00:00Z'
                },
                message: 'Payment updated successfully'
            };
        }

        if (method === 'DELETE') {
            // Delete payment
            return {
                success: true,
                message: 'Payment deleted successfully'
            };
        }

        return {
            success: true,
            data: [
                {
                    id: '1',
                    student_id: '1',
                    student_name: 'John Doe',
                    amount: 2500.00,
                    payment_method: 'momo',
                    reference_id: 'PAY001',
                    operator: 'MTN',
                    recorded_by: 'mcmills',
                    payment_date: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '2',
                    student_id: '2',
                    student_name: 'Jane Smith',
                    amount: 1800.00,
                    payment_method: 'cash',
                    reference_id: 'PAY002',
                    operator: null,
                    recorded_by: 'clerk',
                    payment_date: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                },
                {
                    id: '3',
                    student_id: '3',
                    student_name: 'Michael Johnson',
                    amount: 3200.00,
                    payment_method: 'bank',
                    reference_id: 'PAY003',
                    operator: 'GCB Bank',
                    recorded_by: 'mcmills',
                    payment_date: new Date(today.getTime() + Math.random() * 86400000).toISOString(),
                    created_at: new Date(today.getTime() + Math.random() * 86400000).toISOString()
                }
            ]
        };
    }

    // Mock users data
    if (endpoint.includes('/users')) {
        if (method === 'POST') {
            // Create new user
            const newUser = {
                id: String(Date.now()),
                username: body?.username || 'newuser',
                full_name: body?.full_name || 'New User',
                role: body?.role || 'clerk',
                permissions: body?.permissions || {},
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            return {
                success: true,
                data: newUser,
                message: 'User created successfully'
            };
        }

        if (method === 'PUT') {
            // Update user
            return {
                success: true,
                data: {
                    id: endpoint.split('/').pop(),
                    username: body?.username || 'updated_user',
                    full_name: body?.full_name || 'Updated User',
                    role: body?.role || 'clerk',
                    permissions: body?.permissions || {},
                    is_active: body?.is_active !== undefined ? body.is_active : true,
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: new Date().toISOString()
                },
                message: 'User updated successfully'
            };
        }

        if (method === 'DELETE') {
            // Delete user
            return {
                success: true,
                message: 'User deleted successfully'
            };
        }

        // GET users
        return {
            success: true,
            data: [
                {
                    id: '1',
                    username: 'mcmills',
                    full_name: 'McMills User',
                    role: 'admin',
                    permissions: {},
                    is_active: true,
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                },
                {
                    id: '2',
                    username: 'clerk',
                    full_name: 'System Clerk',
                    role: 'clerk',
                    permissions: {},
                    is_active: true,
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                },
                {
                    id: '3',
                    username: 'admin',
                    full_name: 'System Administrator',
                    role: 'admin',
                    permissions: {},
                    is_active: true,
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                }
            ]
        };
    }

    // Mock analytics data
    if (endpoint.includes('/analytics/dashboard')) {
        return {
            success: true,
            data: {
                totalStudents: 1247,
                totalRevenue: 186750.00,
                activeUsers: 3,
                recentRegistrations: 12,
                paymentMethods: {
                    momo: 45,
                    cash: 23,
                    bank: 18
                }
            }
        };
    }

    if (endpoint.includes('/analytics/users')) {
        return {
            success: true,
            data: [
                {
                    user_id: '1',
                    full_name: 'McMills User',
                    registeredToday: 5,
                    revenueToday: 7500.00,
                    registeredThisWeek: 28,
                    totalRevenue: 125000.00
                },
                {
                    user_id: '2',
                    full_name: 'System Clerk',
                    registeredToday: 3,
                    revenueToday: 4500.00,
                    registeredThisWeek: 18,
                    totalRevenue: 61750.00
                }
            ]
        };
    }

    if (endpoint.includes('/analytics')) {
        return {
            success: true,
            data: {
                totalStudents: 1247,
                totalPayments: 86,
                totalRevenue: 186750.00,
                recentRegistrations: 12
            }
        };
    }

    // Default mock response
    return {
        success: true,
        data: {},
        message: 'Mock response'
    };
};

// Helper function to make authenticated requests
const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    // Use mock data if in mock mode
    if (MOCK_MODE) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const method = options.method || 'GET';
        let body = null;

        // Parse body if it exists
        if (options.body && typeof options.body === 'string') {
            try {
                body = JSON.parse(options.body);
            } catch (e) {
                body = null;
            }
        }

        return generateMockData(endpoint, method, body);
    }

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