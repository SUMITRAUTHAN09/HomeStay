import { Booking } from '@/app/types/admin';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between sticky top-0 bg-white">
          <h3 className="text-xl font-bold">Booking Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booking Reference</p>
              <p className="font-semibold font-mono">{booking.bookingReference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <StatusBadge status={booking.status} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Guest Name</p>
              <p className="font-semibold">{booking.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{booking.guestEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{booking.guestPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-semibold">{booking.guests}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Room</p>
              <p className="font-semibold">{booking.room?.name || 'Room Deleted'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold capitalize">{booking.room?.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nights</p>
              <p className="font-semibold">{booking.nights}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price/Night</p>
              <p className="font-semibold">₹{booking.pricePerNight.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold text-lg text-green-600">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment</p>
              <p className="font-semibold capitalize">{booking.paymentStatus}</p>
            </div>
          </div>
          {booking.specialRequests && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Special Requests</p>
              <p className="p-3 bg-gray-50 rounded-lg">{booking.specialRequests}</p>
            </div>
          )}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">Booked: {new Date(booking.createdAt).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Updated: {new Date(booking.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}