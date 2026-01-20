import { Booking } from '@/app/types/admin';
import { Calendar, Eye, Search, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import BookingDetailsModal from './BookingDetailsModal';
import StatusBadge from './StatusBadge';

interface BookingsTabProps {
  bookings: Booking[];
  loading: boolean;
  onUpdateStatus: (bookingId: string, newStatus: string) => void;
  onCancel: (bookingId: string) => void;
  onDelete: (bookingId: string) => void;
}

export default function BookingsTab({ 
  bookings, 
  loading, 
  onUpdateStatus, 
  onCancel, 
  onDelete 
}: BookingsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         b.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filterStatus === 'all' || b.status === filterStatus);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBookings.map(booking => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm">{booking.bookingReference}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                      <p className="text-sm text-gray-600">{booking.guestPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p>{booking.room?.name || 'Room Deleted'}</p>
                    <p className="text-sm text-gray-600">
                      {booking.guests} guest{booking.guests > 1 ? 's' : ''} • {booking.nights} night{booking.nights > 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">to {new Date(booking.checkOut).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">₹{booking.totalPrice.toLocaleString()}</p>
                    {/* ✅ REMOVED: Payment status line that was showing "pending" */}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)} 
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <>
                          <select 
                            value={booking.status}
                            onChange={(e) => onUpdateStatus(booking._id, e.target.value)}
                            className="text-sm px-2 py-1 border rounded" 
                            disabled={loading}
                            title="Change Status"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button 
                            onClick={() => onCancel(booking._id)}
                            className="p-1 hover:bg-yellow-50 rounded" 
                            disabled={loading}
                            title="Cancel Booking"
                          >
                            <XCircle size={16} className="text-yellow-600" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onDelete(booking._id)}
                        className="p-1 hover:bg-red-50 rounded" 
                        disabled={loading}
                        title="Delete Booking"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
}