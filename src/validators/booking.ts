import * as Yup from "yup";
import { BookingFormValues } from "@/types/booking";

/* 🔹 Initial Form Values */
export const initialValues: BookingFormValues = {
  checkIn: "",
  checkOut: "",
  guests: 1,
  children: 0,
  numberOfRooms: 1,
  name: "",
  phone: "",
  roomId: "",
  specialRequests: "",
};

/* 🔹 Room Type Capacity Mapping - ALL ROOMS = 3 GUESTS EACH */
export const ROOM_CAPACITY = {
  "Family Suite": 9,             // 3 guests/room × 3 rooms max
  "Deluxe Mountain View": 6,     // 3 guests/room × 2 rooms max
  "Cozy Mountain Cabin": 3,      // 3 guests/room × 1 room max
} as const;

export const MAX_ROOMS_PER_TYPE = {
  "Family Suite": 3,
  "Deluxe Mountain View": 2,
  "Cozy Mountain Cabin": 1,
} as const;

/* 🔹 Per-room capacity (ALL ROOMS = 3 GUESTS EACH) */
export const CAPACITY_PER_ROOM = {
  "Family Suite": 3,
  "Deluxe Mountain View": 3,
  "Cozy Mountain Cabin": 3,
} as const;

/* 🔹 Enhanced Validation Schema */
export const bookingSchema = Yup.object({
  roomId: Yup.string().required("Please select a room type"),
  
  checkIn: Yup.date()
    .required("Check-in date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)), 
      "Check-in date cannot be in the past"
    ),
  
  checkOut: Yup.date()
    .required("Check-out date is required")
    .min(Yup.ref("checkIn"), "Check-out must be after check-in"),
  
  guests: Yup.number()
    .required("Number of guests is required")
    .min(1, "At least 1 guest is required")
    .max(20, "Maximum 20 guests allowed")
    .integer("Number of guests must be a whole number")
    .typeError("Number of guests must be a valid number"),
  
  children: Yup.number()
    .min(0, "Children cannot be negative")
    .test(
      "max-children",
      "Children cannot be more than total guests",
      function(value) {
        const { guests } = this.parent;
        if (value === undefined || value === null || value === 0) return true;
        return value <= guests;
      }
    )
    .test(
      "at-least-one-adult",
      "At least 1 adult is required (children cannot book alone)",
      function(value) {
        const { guests } = this.parent;
        if (value === undefined || value === null || value === 0) return true;
        return value < guests; // Children must be less than total guests
      }
    )
    .integer("Number of children must be a whole number")
    .typeError("Number of children must be a valid number")
    .default(0),
  
  numberOfRooms: Yup.number()
    .required("Number of rooms is required")
    .min(1, "At least 1 room is required")
    .max(6, "Maximum 6 rooms available")
    .integer("Number of rooms must be a whole number")
    .typeError("Number of rooms must be a valid number")
    .test(
      "minimum-rooms-for-guests",
      function(value) {
        const { guests } = this.parent;
        if (!value || !guests) return true;
        
        // 🔹 Only show error if rooms are LESS than minimum required
        // Allow users to book MORE rooms than minimum
        const requiredRooms = Math.ceil(guests / 3);
        if (value < requiredRooms) {
          return this.createError({
            message: `Minimum ${requiredRooms} room(s) required for ${guests} guests (3 guests per room)`
          });
        }
        return true;
      }
    ),
  
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .test(
      "no-numbers",
      "Name cannot contain numbers",
      (value) => !value || !/\d/.test(value)
    )
    .test(
      "valid-name",
      "Name can only contain letters, spaces, hyphens and apostrophes",
      (value) => !value || /^[a-zA-Z\s'-]+$/.test(value)
    )
    .trim(),
  
  phone: Yup.string()
    .required("Phone number is required")
    .test(
      "exact-10-digits",
      "Phone number must be exactly 10 digits starting with 6-9",
      (value) => {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, "");
        return /^[6-9]\d{9}$/.test(digitsOnly);
      }
    ),
  
  specialRequests: Yup.string()
    .test(
      "word-limit",
      function(value) {
        if (!value || value.trim() === "") return true;
        const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount > 30) {
          return this.createError({
            message: `Special requests must be 30 words or less (currently ${wordCount} words)`
          });
        }
        return true;
      }
    )
    .max(1000, "Special requests cannot exceed 1000 characters")
    .trim()
    .default(""),
});