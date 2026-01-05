"use client";

import { formFields } from "@/app/constant";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Typography from "../Typography";
import { api } from "@/lib/api-clients";

/* 🔹 Room Interface */
interface Room {
  _id: string;
  name: string;
  price: number;
}

/* 🔹 API Response Interface */
interface RoomsResponse {
  success: boolean;
  count?: number;
  rooms?: Room[];
  data?: {
    rooms?: Room[];
  } | Room[];
  error?: string;
}

/* 🔹 Initial Values - Match formFields exactly */
const initialValues = {
  checkIn: "",
  checkOut: "",
  guests: 2,
  meals: "Confirm Later",
  name: "",
  phone: "",
  roomId: "",
  specialRequests: "",
};

/* 🔹 Validation Schema - Match formFields */
const bookingSchema = Yup.object({
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
    .min(1, "At least 1 guest required")
    .max(6, "Maximum 6 guests allowed"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[+]?[0-9\s-]{10,15}$/, "Please enter a valid phone number"),
  meals: Yup.string().required("Meal plan is required"),
});

const BookingForm = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchRooms();
  }, []);

  // Re-fetch rooms if array becomes empty (safety check)
  useEffect(() => {
    if (mounted && rooms.length === 0) {
      const timer = setTimeout(() => {
        fetchRooms();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, rooms.length]);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const response = await api.rooms.getAll() as RoomsResponse;
      
      if (response.success) {
        // Handle different response structures
        let roomsData: Room[] = [];
        
        // Check if rooms are at top level (your backend structure)
        if (response.rooms && Array.isArray(response.rooms)) {
          roomsData = response.rooms;
        }
        // Check if rooms are in data.rooms
        else if (response.data && 'rooms' in response.data && Array.isArray(response.data.rooms)) {
          roomsData = response.data.rooms;
        }
        // Check if data itself is the rooms array
        else if (response.data && Array.isArray(response.data)) {
          roomsData = response.data;
        }
        
        setRooms(roomsData);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);

    try {
      // Use current rooms or fetch fresh if needed
      let availableRooms = rooms;
      
      if (availableRooms.length === 0) {
        // Fetch rooms directly
        const response = await api.rooms.getAll() as RoomsResponse;
        
        if (response.success && response.rooms && Array.isArray(response.rooms)) {
          availableRooms = response.rooms;
          setRooms(availableRooms); // Update state for future use
        } else {
          throw new Error("Unable to load rooms. Please refresh the page and try again.");
        }
      }
      
      if (availableRooms.length === 0) {
        throw new Error("No rooms available. Please contact us directly.");
      }

      // Format dates properly for MongoDB (convert to YYYY-MM-DD format string)
      const formatDateForBackend = (dateValue: any) => {
        // Handle different date formats
        let date: Date;
        
        if (typeof dateValue === 'string') {
          date = new Date(dateValue);
        } else if (typeof dateValue === 'number') {
          date = new Date(dateValue);
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else {
          throw new Error('Invalid date format');
        }
        
        // Return YYYY-MM-DD format (what the backend expects)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      };

      // Calculate nights and pricing
      const nights = calculateNights(values.checkIn, values.checkOut);
      
      // Find selected room or use first available room
      const selectedRoom = values.roomId 
        ? availableRooms.find(room => room._id === values.roomId)
        : availableRooms[0];
      
      if (!selectedRoom) {
        throw new Error("Please select a room or contact us directly.");
      }

      const pricePerNight = selectedRoom.price || 3500;
      const basePrice = pricePerNight * nights;
      const taxAmount = basePrice * 0.12; // 12% tax
      const totalPrice = basePrice + taxAmount;

      // Format dates for backend
      const formattedCheckIn = formatDateForBackend(values.checkIn);
      const formattedCheckOut = formatDateForBackend(values.checkOut);

      // Prepare booking data with properly formatted dates
      const bookingData = {
        room: selectedRoom._id,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: values.guests,
        guestName: values.name,
        guestEmail: `${values.phone}@guest.com`, // Generate email from phone since we don't collect email
        guestPhone: values.phone,
        specialRequests: values.specialRequests || `Meal preference: ${values.meals}`,
        nights: nights,
        pricePerNight: pricePerNight,
        totalPrice: totalPrice,
        taxAmount: taxAmount,
        paymentStatus: "pending",
        status: "pending"
      };

      // Send booking request to backend
      const response = await api.bookings.create(bookingData);

      if (response.success) {
        setPopupType("success");
        setPopupMessage(`🎉 Booking confirmed!. We'll contact you at ${values.phone} soon.Thanks for choosing us`);
        resetForm();
        
        // Hide popup after 5 seconds
        setTimeout(() => setShowPopup(false), 5000);
      } else {
        throw new Error(response.error || "Failed to submit booking");
      }
    } catch (error: any) {
      console.error("Booking submission error:", error);
      setPopupType("error");
      setPopupMessage(error.message || "❌ Failed to submit booking. Please try again.");
      
      // Hide error popup after 5 seconds
      setTimeout(() => setShowPopup(false), 5000);
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <section
        id="booking"
        className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#C9A177] via-[#C9A177]/90 to-[#BFC7DE]"
      >
        <div className="max-w-4xl mx-auto">
          {/* 🌄 Section Heading */}
          <div className="text-center mb-12">
            <Typography variant="h2" textColor="offWhite" weight="bold" align="center">
              Book Your Mountain Stay
            </Typography>
            <Typography
              variant="paragraph"
              textColor="cream"
              align="center"
              className="mt-2"
            >
              A peaceful escape surrounded by nature 🌿
            </Typography>
          </div>

          {/* 🏡 Booking Card */}
          <Formik
            initialValues={initialValues}
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors }) => (
              <Form className="bg-white/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-[#BFC7DE]/40 space-y-8">
                
                {/* Card Title */}
                <div className="text-center">
                  <Typography variant="h3" textColor="primary" weight="bold">
                    Reservation Details
                  </Typography>
                </div>

                {/* Room Selection (if multiple rooms available) */}
                {rooms.length > 1 && (
                  <div>
                    <Typography
                      variant="label"
                      textColor="primary"
                      className="mb-2 block"
                    >
                      Select Room
                    </Typography>
                    <Field
                      as="select"
                      name="roomId"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                    >
                      <option value="">Choose a room...</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.name} - ₹{room.price}/night
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="roomId">
                      {(msg) => (
                        <Typography
                          variant="small"
                          textColor="primary"
                          className="mt-1 text-red-600"
                        >
                          {msg}
                        </Typography>
                      )}
                    </ErrorMessage>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => (
                    <div key={field.name}>
                      <Typography
                        variant="label"
                        textColor="primary"
                        className="mb-2 block"
                      >
                        {field.label}
                      </Typography>

                      {field.type === "select" ? (
                        <Field
                          as="select"
                          name={field.name}
                          className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                        >
                          {field.options?.map((option) =>
                            typeof option === "number" ? (
                              <option key={option} value={option}>
                                {option} Guest{option > 1 ? "s" : ""}
                              </option>
                            ) : (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            )
                          )}
                        </Field>
                      ) : (
                        <Field
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition"
                        />
                      )}

                      {/* Error */}
                      <ErrorMessage name={field.name}>
                        {(msg) => (
                          <Typography
                            variant="small"
                            textColor="primary"
                            className="mt-1 text-red-600"
                          >
                            {msg}
                          </Typography>
                        )}
                      </ErrorMessage>
                    </div>
                  ))}
                </div>

                {/* Special Requests */}
                <div>
                  <Typography
                    variant="label"
                    textColor="primary"
                    className="mb-2 block"
                  >
                    Special Requests (Optional)
                  </Typography>
                  <Field
                    as="textarea"
                    name="specialRequests"
                    rows={3}
                    placeholder="Any special requirements or requests..."
                    className="w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-2 focus:ring-[#7570BC]/20 outline-none transition resize-none"
                  />
                </div>



                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#7570BC] to-[#C59594] py-4 rounded-full hover:scale-[1.02] transition-transform shadow-xl ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Typography
                    variant="paragraph"
                    textColor="white"
                    weight="semibold"
                    align="center"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Booking"}
                  </Typography>
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* ✅ Bottom Popup */}
      {showPopup && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div
            className={`${
              popupType === "success"
                ? "bg-[#7570BC]"
                : "bg-red-500"
            } text-white px-6 py-4 rounded-2xl shadow-2xl`}
          >
            <Typography variant="paragraph" textColor="white" weight="semibold">
              {popupMessage}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;