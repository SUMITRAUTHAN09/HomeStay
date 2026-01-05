import { config } from './config';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;
}

// Backend response structure
interface BackendLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  admin?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

// Frontend expected structure
interface FrontendLoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      name?: string;
      email: string;
      role: string;
    };
  };
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.url;
    this.timeout = config.api.timeout;
    
    // Debug log
    console.log('🔧 API Client initialized with baseUrl:', this.baseUrl);
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Construct full URL
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    console.log('🌐 Making request to:', url);
    console.log('📤 Method:', options.method || 'GET');
    console.log('📤 Request data:', options.body);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText };
      }

      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || response.statusText || 'Request failed',
          statusCode: response.status,
          ...data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('❌ API Error:', error);
      return {
        success: false,
        error:
          error.name === 'AbortError'
            ? 'Request timed out'
            : error.message || 'Network error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: response.statusText };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || response.statusText || 'Upload failed',
          statusCode: response.status,
          ...data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Upload Error:', error);
      return {
        success: false,
        error:
          error.name === 'AbortError'
            ? 'Upload timed out'
            : error.message || 'Upload failed',
      };
    }
  }
}

const apiClient = new ApiClient();

export const api = {
  // Admin Auth endpoints
  auth: {
    // ✅ FIXED: Transform backend response to match frontend expectations
    login: async (data: { email: string; password: string; rememberMe?: boolean }): Promise<FrontendLoginResponse> => {
      try {
        const response = await apiClient.post<BackendLoginResponse>('/admin/auth/login', data);
        
        console.log('🔄 Raw backend response:', response);

        // If request failed at network level
        if (!response.success) {
          return {
            success: false,
            error: response.error || 'Login failed',
            message: response.message,
          };
        }

        // Backend returns data directly, not nested in 'data' property
        const backendData = response.data as BackendLoginResponse;
        
        console.log('🔄 Backend data:', backendData);

        // Check if backend response has the expected structure
        if (backendData && backendData.success && backendData.token && backendData.admin) {
          // ✅ Transform to frontend structure
          const transformedResponse: FrontendLoginResponse = {
            success: true,
            data: {
              token: backendData.token,
              user: {
                id: backendData.admin.id,
                name: backendData.admin.name,
                email: backendData.admin.email,
                role: backendData.admin.role,
              },
            },
          };
          
          console.log('✅ Transformed response:', transformedResponse);
          return transformedResponse;
        }

        // Backend returned error
        return {
          success: false,
          error: backendData?.message || 'Login failed',
          message: backendData?.message,
        };
      } catch (error: any) {
        console.error('❌ Login error:', error);
        return {
          success: false,
          error: error.message || 'Network error',
        };
      }
    },
    
    getProfile: () => apiClient.get('/admin/auth/profile'),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.put('/admin/auth/change-password', data),
    verify: () => apiClient.get('/admin/auth/verify'),
    logout: () => apiClient.post('/admin/auth/logout'),
  },

  // Room endpoints
  rooms: {
    getAll: () => apiClient.get('/rooms'),
    getById: (id: string) => apiClient.get(`/rooms/${id}`),
    create: (data: any) => apiClient.post('/rooms', data),
    update: (id: string, data: any) => apiClient.put(`/rooms/${id}`, data),
    delete: (id: string) => apiClient.delete(`/rooms/${id}`),
    checkAvailability: (id: string, data: any) =>
      apiClient.post(`/rooms/${id}/check-availability`, data),
  },

  // Booking endpoints
  bookings: {
    getAll: () => apiClient.get('/bookings'),
    getById: (id: string) => apiClient.get(`/bookings/${id}`),
    create: (data: any) => apiClient.post('/bookings', data),
    update: (id: string, data: any) => apiClient.put(`/bookings/${id}`, data),
    cancel: (id: string, data?: any) => apiClient.patch(`/bookings/${id}/cancel`, data),
    getMyBookings: () => apiClient.get('/bookings/my-bookings'),
  },

  // Gallery endpoints
  gallery: {
    getAll: () => apiClient.get('/gallery'),
    getById: (id: string) => apiClient.get(`/gallery/${id}`),
    getByCategory: (category: string) => apiClient.get(`/gallery/category/${category}`),
    create: (data: any) => apiClient.post('/gallery', data),
    update: (id: string, data: any) => apiClient.put(`/gallery/${id}`, data),
    delete: (id: string) => apiClient.delete(`/gallery/${id}`),
  },

  // Contact endpoints
  contact: {
    create: (data: any) => apiClient.post('/contact', data),
    getAll: () => apiClient.get('/contact'),
    getById: (id: string) => apiClient.get(`/contact/${id}`),
    updateStatus: (id: string, data: any) => apiClient.patch(`/contact/${id}`, data),
    delete: (id: string) => apiClient.delete(`/contact/${id}`),
  },
};

export default apiClient;