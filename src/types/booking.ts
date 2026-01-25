/* 🔹 Room Interface */
export interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  isAvailable?: boolean;
}

/* 🔹 API Response Interfaces */
export interface RoomsResponse {
  success: boolean;
  count?: number;
  rooms?: Room[];
  data?: {
    rooms?: Room[];
  } | Room[];
  error?: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  error?: string;
  booking?: {
    _id: string;
    bookingReference: string;
    room: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    children: number;
    numberOfRooms: number;
    totalPrice: number;
    status: string;
    guestName: string;
    guestPhone: string;
  };
}

/* 🔹 Booking Form Values (Frontend) */
export interface BookingFormValues {
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number;
  name: string;
  phone: string;
  roomId: string;
  specialRequests: string;
}

/* 🔹 Booking Data for API Submission (matches backend schema exactly) */
export interface BookingData {
  room: string;                    // Backend expects 'room', not 'roomId'
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  numberOfRooms: number;
  adults: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  taxAmount: number;
  discountAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests: string;
}

/* 🔹 Popup State */
export type PopupType = "success" | "error";

/* 🔹 Availability Check Request */
export interface AvailabilityCheckRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  excludeBookingId?: string;
}

/* 🔹 Availability Check Response */
export interface AvailabilityCheckResponse {
  success: boolean;
  available: boolean;
  message?: string;
  conflictingBooking?: {
    checkIn: string;
    checkOut: string;
    bookingReference: string;
  };
}

/* 🔹 Room Capacity Constants */
export const ROOM_CAPACITY = {
  "Family Suite": 9,
  "Deluxe Mountain View": 6,
  "Cozy Mountain Cabin": 3,
} as const;

export const MAX_ROOMS_PER_TYPE = {
  "Family Suite": 3,
  "Deluxe Mountain View": 2,
  "Cozy Mountain Cabin": 1,
} as const;

/* 🔹 Booking for Display/Admin */
export interface Booking {
  _id: string;
  room: Room | string;
  checkIn: Date | string;
  checkOut: Date | string;
  guests: number;
  children: number;
  numberOfRooms: number;
  adults?: number;
  totalPrice: number;
  pricePerNight: number;
  taxAmount: number;
  discountAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "cash" | "card" | "upi" | "online";
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  bookingReference: string;
  nights: number;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/* 🔹 Date Validation Result */
export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}