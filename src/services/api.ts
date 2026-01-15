/**
 * API Service Layer
 * Handles all HTTP requests to the FastAPI backend
 */

const API_BASE_URL = 'https://compssa-onboarding-backend.onrender.com/api';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Generic request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    // @ts-ignore
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    
    // Handle different error formats
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    if (error.detail) {
      if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (Array.isArray(error.detail)) {
        // FastAPI validation errors are arrays
        errorMessage = error.detail
          .map((e: any) => e.msg || e.message || JSON.stringify(e))
          .join('; ');
      } else if (typeof error.detail === 'object') {
        errorMessage = JSON.stringify(error.detail);
      }
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiRequest<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  getProfile: async () => {
    return apiRequest<{
      id: string;
      username: string;
      full_name: string;
      role: string;
      permissions: Record<string, any>;
      is_active: boolean;
    }>('/auth/me');
  },

  logout: async () => {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};

// Students API
export const studentsAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    course?: string;
    level?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.course) queryParams.append('course', params.course);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiRequest<any[]>(`/students${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/students/${id}`);
  },

  create: async (studentData: {
    student_id: string;
    surname: string;
    first_name: string;
    other_names?: string;
    email: string;
    phone: string;
    gender?: string;
    nationality?: string;
    course: string;
    level: string;
    study_mode: string;
    residential_status: string;
    hall?: string;
  }) => {
    return apiRequest<any>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  update: async (id: string, studentData: Partial<any>) => {
    return apiRequest<any>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<any>('/students/stats/overview');
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    student_id?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.student_id) queryParams.append('student_id', params.student_id);

    const query = queryParams.toString();
    return apiRequest<any[]>(`/payments${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/payments/${id}`);
  },

  getByStudentId: async (studentId: string) => {
    return apiRequest<any[]>(`/payments/student/${studentId}`);
  },

  create: async (paymentData: {
    student_id: string;
    amount: number;
    payment_method: string;
    reference_id: string;
    operator?: string;
  }) => {
    return apiRequest<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  update: async (id: string, paymentData: Partial<any>) => {
    return apiRequest<any>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/payments/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<any>('/payments/stats/revenue');
  },
};

// Users API
export const usersAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiRequest<any[]>(`/users${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/users/${id}`);
  },

  create: async (userData: {
    username: string;
    full_name: string;
    email?: string;
    password: string;
    role: string;
  }) => {
    return apiRequest<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: Partial<any>) => {
    return apiRequest<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  toggleStatus: async (id: string) => {
    return apiRequest<any>(`/users/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest<{
      success: boolean;
      data: {
        today: {
          registrations: number;
          revenue: number;
          staff_online: number;
        };
        weekly: {
          registrations: number;
        };
        totals: {
          students: number;
          revenue: number;
          active_users: number;
        };
        distributions: {
          by_course: Record<string, number>;
          by_study_mode: Record<string, number>;
          by_residential_status: Record<string, number>;
        };
      };
    }>('/dashboard/stats');
  },

  getStaffPerformance: async () => {
    return apiRequest<{
      success: boolean;
      data: Array<{
        user_id: string;
        full_name: string;
        username: string;
        registeredToday: number;
        revenueToday: number;
        registeredThisWeek: number;
        totalRevenue: number;
      }>;
    }>('/dashboard/staff-performance');
  },

  getRecentActivity: async () => {
    return apiRequest<{
      success: boolean;
      data: {
        recent_students: Array<{
          id: string;
          type: string;
          name: string;
          timestamp: string;
        }>;
        recent_payments: Array<{
          id: string;
          type: string;
          name: string;
          amount: number;
          timestamp: string;
        }>;
      };
    }>('/dashboard/recent-activity');
  },

  getUserActivities: async (userId: string) => {
    return apiRequest<{
      success: boolean;
      data: {
        user: {
          id: string;
          username: string;
          full_name: string;
          role: string;
          created_at: string;
        };
        summary: {
          total_students_registered: number;
          total_payments_recorded: number;
          total_revenue: number;
          total_activities: number;
          first_activity: string | null;
          last_activity: string | null;
        };
        activities: Array<{
          id: string;
          type: 'student_registration' | 'payment_record';
          student_id?: string;
          student_name: string;
          email?: string;
          course?: string;
          level?: string;
          study_mode?: string;
          amount?: number;
          payment_method?: string;
          reference_id?: string;
          timestamp: string;
          date: string;
          time: string;
        }>;
        activities_by_date: Record<string, Array<any>>;
      };
    }>(`/dashboard/user-activities/${userId}`);
  },
};
