// app/types/admin.ts

export interface Booking {
  _id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: {
    _id: string;
    name: string;
    price: number;
    type: string;
  } | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  pricePerNight: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  bookingReference: string;
  nights: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  name: string;
  type: 'deluxe' | 'suite' | 'cabin' | 'standard';
  capacity: number;
  price: number;
  description?: string;
  amenities: string[];
  features: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'hero' | 'room' | 'dining' | 'gallery';
  uploadedAt: string;
}

// UPDATED: Added 'menu' to TabType
export type TabType = 'photos' | 'bookings' | 'rooms' | 'menu';