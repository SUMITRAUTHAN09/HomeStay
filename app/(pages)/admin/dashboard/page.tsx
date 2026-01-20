"use client";

import { Booking, Room, TabType } from '@/app/types/admin';
import { api } from '@/lib/api-clients';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

// Import all components
import AdminHeader from '@/components/admin/AdminHeader';
import BookingsTab from '@/components/admin/BookingsTab';
import MenuTab from '@/components/admin/MenuTab';
import NotificationBanner from '@/components/admin/NotificationBanner';
import PhotosTab from '@/components/admin/PhotosTab';
import RoomsTab from '@/components/admin/RoomsTab';
import TabNavigation from '@/components/admin/TabNavigation';
import RoomEditModal from '@/components/RoomEditModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('rooms');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.warn('⚠️ No admin token found, redirecting to login...');
      window.location.href = '/login';
      return;
    }
    
    console.log('✅ Admin token found:', token.substring(0, 20) + '...');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadBookings(), loadRooms()]);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.bookings.getAll();
      if (response.success && response.data) {
        const bookingData = (response.data as any).bookings || (response.data as any).data || response.data;
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      } else {
        throw new Error(response.error || response.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      console.error('❌ Failed to load bookings:', err);
      throw err;
    }
  };

  const loadRooms = async () => {
    try {
      console.log('🔍 Admin loading all rooms...');
      const response = await api.rooms.getAll();
      
      console.log('📥 Admin rooms response:', response);
      
      if (response.success) {
        const roomData = (response.data as any)?.rooms || 
                        (response.data as any)?.data || 
                        response.data || 
                        [];
        
        console.log('✅ Room data extracted:', roomData);
        setRooms(Array.isArray(roomData) ? roomData : []);
      } else {
        if (response.error?.includes('401') || 
            response.error?.includes('Unauthorized') || 
            response.error?.includes('token')) {
          console.error('🔐 Authentication failed - token may be expired');
          alert('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          window.location.href = '/login';
          return;
        }
        
        if (response.error?.includes('404') || 
            response.error?.includes('Not Found') ||
            response.statusCode === 404) {
          console.error('⚠️ Admin rooms endpoint not found. Using fallback public endpoint.');
          setError('Admin rooms endpoint not configured. Contact support.');
          setRooms([]);
          return;
        }
        
        throw new Error(response.error || 'Failed to load rooms');
      }
    } catch (err: any) {
      console.error('❌ Failed to load rooms:', err);
      
      if (err.message?.includes('Not Found') || err.message?.includes('404')) {
        setError('Unable to load rooms. The admin endpoint may not be configured.');
        setRooms([]);
      } else {
        throw err;
      }
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEditRoom = async (roomId: string, updatedData: Partial<Room>) => {
    try {
      setLoading(true);
      const response = await api.rooms.update(roomId, updatedData);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update room');
      }
      await loadRooms();
      showSuccess('✅ Room updated! Refresh the main site (F5) to see changes.');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRoomAvailability = async (roomId: string) => {
    try {
      setLoading(true);
      const room = rooms.find(r => r._id === roomId);
      if (!room) return;
      
      const response = await api.rooms.update(roomId, { isAvailable: !room.isAvailable });
      if (!response.success) {
        throw new Error(response.error || 'Failed to toggle availability');
      }
      
      setRooms(prev => prev.map(r => r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r));
      showSuccess(`Room ${!room.isAvailable ? 'enabled' : 'disabled'} successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Delete this room? This action cannot be undone.')) return;
    try {
      setLoading(true);
      const response = await api.rooms.delete(roomId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete room');
      }
      setRooms(prev => prev.filter(r => r._id !== roomId));
      showSuccess('Room deleted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setLoading(true);
      const response = await api.bookings.update(bookingId, { status: newStatus });
      if (!response.success) {
        throw new Error(response.error || 'Failed to update booking');
      }
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus as any } : b));
      showSuccess('Booking status updated!');
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      setLoading(true);
      const reason = prompt('Cancellation reason:');
      const response = await api.bookings.cancel(bookingId, { cancellationReason: reason || 'Admin cancelled' });
      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel booking');
      }
      await loadBookings();
      showSuccess('Booking cancelled successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Now using proper delete API instead of just updating status
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('⚠️ Delete this booking permanently? This action cannot be undone.')) return;
    try {
      setLoading(true);
      console.log('🗑️ Deleting booking:', bookingId);
      
      const response = await api.bookings.delete(bookingId);
      
      console.log('📥 Delete response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete booking');
      }
      
      // Remove from local state immediately
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      showSuccess('✅ Booking deleted permanently!');
    } catch (err: any) {
      console.error('❌ Delete booking error:', err);
      alert(err.message || 'Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoomWrapper = (room: Room) => {
    setEditingRoom(room);
  };

  if (loading && bookings.length === 0 && rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader loading={loading} onRefresh={loadDashboardData} />

      {successMessage && (
        <NotificationBanner 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

      {error && (
        <NotificationBanner 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'rooms' && (
          <RoomsTab 
            rooms={rooms} 
            loading={loading}
            onEdit={handleEditRoomWrapper}
            onToggleAvailability={handleToggleRoomAvailability}
            onDelete={handleDeleteRoom}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab 
            bookings={bookings}
            loading={loading}
            onUpdateStatus={handleUpdateBookingStatus}
            onCancel={handleCancelBooking}
            onDelete={handleDeleteBooking}
          />
        )}

        {activeTab === 'photos' && (
          <PhotosTab 
            onSuccess={showSuccess}
            onError={setError}
          />
        )}

        {activeTab === 'menu' && (
          <MenuTab 
            onSuccess={showSuccess}
            onError={setError}
          />
        )}
      </main>

      {editingRoom && (
        <RoomEditModal 
          room={editingRoom} 
          onClose={() => setEditingRoom(null)} 
          onSave={handleEditRoom} 
        />
      )}
    </div>
  );
}