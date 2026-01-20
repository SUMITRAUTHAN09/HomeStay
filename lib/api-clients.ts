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

// Room Availability Types
interface AvailabilityDay {
  date: string;
  available: boolean;
}

interface RoomAvailabilityResponse {
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  availability: AvailabilityDay[];
}

interface DateAvailabilityResponse {
  available: boolean;
  message: string;
  conflictingBooking?: {
    checkIn: Date;
    checkOut: Date;
    status: string;
  } | null;
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

  async delete<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
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

// ========================================
// PUBLIC API (for main website)
// ========================================
export const publicApi = {
  // Room endpoints - PUBLIC (only available rooms)
  rooms: {
    getAll: () => apiClient.get('/rooms'),
    getById: (id: string) => apiClient.get(`/rooms/${id}`),
    
    // Room Availability endpoints
    getAvailability: async (roomId: string, startDate?: string): Promise<ApiResponse<RoomAvailabilityResponse>> => {
      const endpoint = startDate 
        ? `/rooms/${roomId}/availability-calendar?startDate=${startDate}`
        : `/rooms/${roomId}/availability-calendar`;
      return apiClient.get<RoomAvailabilityResponse>(endpoint);
    },
    
    checkDateAvailability: async (
      roomId: string, 
      checkInDate: string, 
      checkOutDate: string
    ): Promise<ApiResponse<DateAvailabilityResponse>> => {
      const endpoint = `/rooms/${roomId}/check-dates?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      const response = await apiClient.get<any>(endpoint);
      
      console.log('🔍 checkDateAvailability raw response:', response);
      
      if (response.success && response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      if (response.success && response.data?.available !== undefined) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return response;
    },
  },

  // Booking endpoints
  bookings: {
    create: (data: any) => apiClient.post('/bookings', data),
    getMyBookings: () => apiClient.get('/bookings/my-bookings'),
  },

  // Menu endpoints - PUBLIC
  menu: {
    get: () => apiClient.get('/menu'),
  },

  // Gallery endpoints
  gallery: {
    getAll: () => apiClient.get('/gallery'),
    getById: (id: string) => apiClient.get(`/gallery/${id}`),
    getByCategory: (category: string) => apiClient.get(`/gallery/category/${category}`),
  },

  // Contact endpoints
  contact: {
    create: (data: any) => apiClient.post('/contact', data),
  },
};

// ========================================
// ADMIN API (for admin dashboard)
// ========================================
export const api = {
  // Admin Auth endpoints
  auth: {
    login: async (data: { email: string; password: string; rememberMe?: boolean }): Promise<FrontendLoginResponse> => {
      try {
        const response = await apiClient.post<BackendLoginResponse>('/admin/auth/login', data);
        
        console.log('🔄 Raw backend response:', response);

        if (!response.success) {
          return {
            success: false,
            error: response.error || 'Login failed',
            message: response.message,
          };
        }

        const backendData = response.data as BackendLoginResponse;
        
        console.log('🔄 Backend data:', backendData);

        if (backendData && backendData.success && backendData.token && backendData.admin) {
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

  // Room endpoints - ADMIN (all rooms including unavailable)
  rooms: {
    getAll: () => apiClient.get('/rooms/admin/all'),
    getById: (id: string) => apiClient.get(`/rooms/admin/${id}`),
    create: (data: any) => apiClient.post('/rooms', data),
    update: (id: string, data: any) => apiClient.put(`/rooms/${id}`, data),
    delete: (id: string) => apiClient.delete(`/rooms/${id}`),
    toggleAvailability: (id: string) => apiClient.patch(`/rooms/${id}/toggle-availability`),
    
    // Room Availability endpoints (using public endpoints)
    getAvailability: async (roomId: string, startDate?: string): Promise<ApiResponse<RoomAvailabilityResponse>> => {
      const endpoint = startDate 
        ? `/rooms/${roomId}/availability-calendar?startDate=${startDate}`
        : `/rooms/${roomId}/availability-calendar`;
      return apiClient.get<RoomAvailabilityResponse>(endpoint);
    },
    
    checkDateAvailability: async (
      roomId: string, 
      checkInDate: string, 
      checkOutDate: string
    ): Promise<ApiResponse<DateAvailabilityResponse>> => {
      const endpoint = `/rooms/${roomId}/check-dates?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
      const response = await apiClient.get<any>(endpoint);
      
      console.log('🔍 checkDateAvailability raw response:', response);
      
      if (response.success && response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      if (response.success && response.data?.available !== undefined) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return response;
    },
  },

  // Booking endpoints - ✅ FIXED: Added proper delete method
  bookings: {
    getAll: () => apiClient.get('/bookings'),
    getById: (id: string) => apiClient.get(`/bookings/${id}`),
    create: (data: any) => apiClient.post('/bookings', data),
    update: (id: string, data: any) => apiClient.put(`/bookings/${id}`, data),
    cancel: (id: string, data?: any) => apiClient.patch(`/bookings/${id}/cancel`, data),
    delete: (id: string) => apiClient.delete(`/bookings/${id}`), // ✅ ADDED: Proper delete endpoint
    getMyBookings: () => apiClient.get('/bookings/my-bookings'),
  },

  // Menu endpoints - ADMIN
  menu: {
    // Get menu (uses public endpoint)
    get: () => apiClient.get('/menu'),
    
    // Update entire menu (admin only)
    update: (categories: any[]) => apiClient.put('/admin/menu', { categories }),
    
    // Add new category (admin only) - For future expansion beyond 3 categories
    addCategory: (categoryData: { category: string; items: any[]; order: number }) => 
      apiClient.post('/admin/menu/category', categoryData),
    
    // Delete category (admin only)
    deleteCategory: (categoryId: string) => 
      apiClient.delete(`/admin/menu/category/${categoryId}`),
    
    // Add item to specific category (admin only)
    addMenuItem: (itemData: { categoryName: string; itemName: string; itemDescription?: string }) =>
      apiClient.post('/admin/menu/item', itemData),
    
    // Delete item from specific category (admin only)
    deleteMenuItem: (itemData: { categoryName: string; itemName: string }) =>
      apiClient.delete('/admin/menu/item', itemData),
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

// Export types for use in components
export type {
  ApiResponse,
  AvailabilityDay, DateAvailabilityResponse, RoomAvailabilityResponse
};
