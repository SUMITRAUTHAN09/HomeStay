"use client";

import Typography from "@/components/layout/Typography";
import { calculateNights, calculatePricingBreakdown, formatPrice } from "@/lib/booking-utils";
import { BookingFormValues, Room } from "@/types/booking";
import { CAPACITY_PER_ROOM, MAX_ROOMS_PER_TYPE, ROOM_CAPACITY } from "@/validators/booking";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";

interface GuestDetailsProps {
  rooms: Room[];
}

const GuestDetails = ({ rooms }: GuestDetailsProps) => {
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<BookingFormValues>();
  
  // 🔹 Track if user manually changed the room count
  const isManualRoomChange = useRef(false);
  const previousGuests = useRef(values.guests);
  const previousRoomType = useRef("");

  // ✅ NEW: Pricing breakdown state
  const [pricingBreakdown, setPricingBreakdown] = useState<{
    basePrice: number;
    gstAmount: number;
    gstRate: string;
    totalPrice: number;
  } | null>(null);

  // Get selected room details
  const selectedRoom = rooms.find(room => room._id === values.roomId);
  const roomType = selectedRoom?.name || "";
  
  // Get capacity limits for selected room type
  const maxGuestsForRoom = (ROOM_CAPACITY as any)[roomType] || 9;
  const maxRoomsForType = (MAX_ROOMS_PER_TYPE as any)[roomType] || 6;
  const capacityPerRoom = (CAPACITY_PER_ROOM as any)[roomType] || 3;

  // ✅ NEW: Calculate pricing whenever relevant values change
  useEffect(() => {
    if (values.roomId && values.checkIn && values.checkOut && values.numberOfRooms > 0) {
      const selectedRoom = rooms.find(room => room._id === values.roomId);
      if (selectedRoom) {
        const nights = calculateNights(values.checkIn, values.checkOut);
        const pricePerNight = Number(selectedRoom.price) || 3500;
        const breakdown = calculatePricingBreakdown(pricePerNight, nights, values.numberOfRooms);
        setPricingBreakdown(breakdown);
      }
    } else {
      setPricingBreakdown(null);
    }
  }, [values.roomId, values.checkIn, values.checkOut, values.numberOfRooms, rooms]);

  // 🔹 Calculate recommended rooms based on guests (3 guests per room for ALL room types)
  const calculateRecommendedRooms = (guests: number, roomType: string): number => {
    if (guests <= 0) return 1;
    
    // All rooms have 3 guests capacity each
    const capacityPerRoom = 3;
    const maxRooms = (MAX_ROOMS_PER_TYPE as any)[roomType] || 6;
    
    const recommended = Math.ceil(guests / capacityPerRoom);
    return Math.min(recommended, maxRooms);
  };

  // 🔹 Auto-adjust rooms ONLY when guests or room type changes AND user hasn't manually set it
  useEffect(() => {
    const guestsChanged = previousGuests.current !== values.guests;
    const roomTypeChanged = previousRoomType.current !== roomType;
    
    console.log('🔄 useEffect check:', {
      guestsChanged,
      roomTypeChanged,
      isManual: isManualRoomChange.current,
      currentRooms: values.numberOfRooms,
      guests: values.guests
    });
    
    // Only auto-calculate if:
    // 1. User hasn't manually changed rooms, OR
    // 2. Guests count changed, OR
    // 3. Room type changed
    if (values.guests > 0 && roomType && (guestsChanged || roomTypeChanged)) {
      const recommended = calculateRecommendedRooms(values.guests, roomType);
      
      // Reset manual flag when guests or room type changes
      if (guestsChanged || roomTypeChanged) {
        console.log('🔄 Resetting manual flag due to guest/room type change');
        isManualRoomChange.current = false;
      }
      
      // Only update if not manually changed
      if (!isManualRoomChange.current) {
        console.log('✅ Auto-setting rooms to:', recommended);
        setFieldValue('numberOfRooms', recommended);
      } else {
        console.log('⏭️ Skipping auto-calculation (manual override active)');
      }
      
      previousGuests.current = values.guests;
      previousRoomType.current = roomType;
    }
  }, [values.guests, roomType, setFieldValue]);

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newGuests = value === '' ? 0 : parseInt(value);
    
    // Validate against room type capacity
    if (newGuests > maxGuestsForRoom) {
      setFieldValue('guests', maxGuestsForRoom);
      setFieldTouched('guests', true);
      return;
    }
    
    setFieldValue('guests', newGuests);
    
    // Auto-adjust children if exceeds new guest count
    if (values.children > newGuests) {
      setFieldValue('children', newGuests);
    }
    
    // Mark as NOT manual change when guests change (allow auto-calculation)
    isManualRoomChange.current = false;
  };

  const handleGuestsBlur = () => {
    setFieldTouched('guests', true);
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const newChildren = value === '' ? 0 : parseInt(value);
    
    // Allow the input but field will show error
    setFieldValue('children', newChildren);
  };

  const handleChildrenBlur = () => {
    setFieldTouched('children', true);
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 🔹 FIRST: Mark as manual BEFORE any value changes
    isManualRoomChange.current = true;
    
    const value = e.target.value.replace(/\D/g, '');
    
    // Handle empty input
    if (value === '') {
      setFieldValue('numberOfRooms', '');
      return;
    }
    
    let newRooms = parseInt(value);
    
    // Enforce max rooms for room type
    newRooms = Math.min(newRooms, maxRoomsForType);
    newRooms = Math.max(newRooms, 1); // Minimum 1 room
    
    console.log('🏠 User manually set rooms to:', newRooms);
    setFieldValue('numberOfRooms', newRooms);
  };

  const handleRoomsBlur = () => {
    setFieldTouched('numberOfRooms', true);
  };

  const handleRoomsFocus = () => {
    // 🔹 When user clicks/focuses on room field, mark as manual
    isManualRoomChange.current = true;
  };

  const adults = values.guests - values.children;

  // Word count for special requests
  const wordCount = values.specialRequests ? values.specialRequests.trim().split(/\s+/).filter(Boolean).length : 0;
  const wordsRemaining = 30 - wordCount;

  // Only show error if field has been touched AND has an error
  const showGuestsError = touched.guests && errors.guests;
  const showChildrenError = touched.children && errors.children;
  const showRoomsError = touched.numberOfRooms && errors.numberOfRooms;

  return (
    <div className="space-y-5">
      {/* Guests, Children, and Rooms - Grid Layout */}
      <div className="grid grid-cols-3 gap-1">
        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Total Guests*
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="guests"
            value={values.guests || ''}
            placeholder="e.g. 5"
            onChange={handleGuestsChange}
            onBlur={handleGuestsBlur}
            className={`w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border ${
              showGuestsError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-[#7570BC]/20'
            } focus:ring-2 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          {showGuestsError && (
            <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
              <span className="text-red-600">⚠️</span> {errors.guests}
            </Typography>
          )}
          {roomType && !showGuestsError && values.guests > 0 && (
            <Typography variant="small" textColor="primary" className="mt-1 text-gray-500 text-xs">
              Max {maxGuestsForRoom} for {roomType}
            </Typography>
          )}
        </div>

        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Children
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="children"
            value={values.children || ''}
            placeholder="e.g. 2"
            onChange={handleChildrenChange}
            onBlur={handleChildrenBlur}
            className={`w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border ${
              showChildrenError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-[#7570BC]/20'
            } focus:ring-2 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          {showChildrenError && (
            <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
              <span className="text-red-600">⚠️</span> {errors.children}
            </Typography>
          )}
        </div>

        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Rooms*
          </Typography>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name="numberOfRooms"
            value={values.numberOfRooms || ''}
            placeholder="e.g. 2"
            onChange={handleRoomsChange}
            onBlur={handleRoomsBlur}
            onFocus={handleRoomsFocus}
            max={maxRoomsForType}
            className={`w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border ${
              showRoomsError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-[#7570BC]/20'
            } focus:ring-2 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          {showRoomsError && (
            <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
              <span className="text-red-600">⚠️</span> {errors.numberOfRooms}
            </Typography>
          )}
          {roomType && !showRoomsError && values.numberOfRooms > 0 && (
            <Typography variant="small" textColor="primary" className="mt-1 text-gray-500 text-xs">
              💡 Min {Math.ceil(values.guests / 3)} room(s) for {values.guests} guests. Max {maxRoomsForType}
            </Typography>
          )}
        </div>
      </div>

      {/* Guest Summary Badge - Enhanced */}
      {values.guests > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Typography variant="small" textColor="primary" weight="semibold" className="text-gray-900 block">
                Booking Summary
              </Typography>
              <Typography variant="small" textColor="primary" className="text-xs text-gray-600">
                {adults} Adult{adults !== 1 ? 's' : ''} • {values.children} Child{values.children !== 1 ? 'ren' : ''} • {values.numberOfRooms} Room{values.numberOfRooms !== 1 ? 's' : ''}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="paragraph" className="text-3xl font-bold text-blue-600">{values.guests}</Typography>
              <Typography variant="small" textColor="primary" className="text-xs text-gray-500">
                Total Guests
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Name and Phone - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Full Name *
          </Typography>
          <Field
            type="text"
            name="name"
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border ${
              errors.name && touched.name 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-[#7570BC]/20'
            } focus:ring-2 outline-none transition`}
          />
          <ErrorMessage name="name">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
                <span className="text-red-600">⚠️</span> {msg}
              </Typography>
            )}
          </ErrorMessage>
        </div>

        <div>
          <Typography variant="label" textColor="primary" className="mb-2 block">
            Phone Number *
          </Typography>
          <Field
            type="tel"
            name="phone"
            placeholder="+91 98765 43210"
            maxLength={10}
            className={`w-full px-4 py-3 rounded-xl bg-[#F5EFE7] border ${
              errors.phone && touched.phone 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-[#C9A177]/40 focus:border-[#7570BC] focus:ring-[#7570BC]/20'
            } focus:ring-2 outline-none transition`}
          />
          <ErrorMessage name="phone">
            {(msg) => (
              <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
                <span className="text-red-600">⚠️</span> {msg}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      </div>

      {/* Special Requests with Word Counter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Typography variant="label" textColor="primary" className="font-medium text-gray-700">
            Special Requests <span className="text-gray-400 text-sm">(Optional)</span>
          </Typography>
          <Typography variant="small" textColor="primary" className={`text-xs ${
            wordsRemaining < 0 ? 'text-red-600 font-semibold' : 
            wordsRemaining <= 5 ? 'text-orange-500' : 'text-gray-500'
          }`}>
            {wordsRemaining < 0 ? `${Math.abs(wordsRemaining)} words over limit` : `${wordsRemaining} words remaining`}
          </Typography>
        </div>
        <Field
          as="textarea"
          name="specialRequests"
          rows={3}
          placeholder="Any dietary requirements, accessibility needs, or special occasions... (max 30 words)"
          className={`w-full px-4 py-3 rounded-xl border-2 ${
            errors.specialRequests && touched.specialRequests
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
          } focus:ring-4 outline-none transition-all resize-none text-gray-700 placeholder:text-gray-400`}
        />
        <ErrorMessage name="specialRequests">
          {(msg) => (
            <Typography variant="small" textColor="primary" className="mt-1 text-red-600 flex items-center gap-1">
              <span className="text-red-600">⚠️</span> {msg}
            </Typography>
          )}
        </ErrorMessage>
      </div>

      {/* ✅ NEW: Pricing Breakdown Display - Base + 18% GST */}
      {pricingBreakdown && values.checkIn && values.checkOut && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 space-y-4 shadow-sm">
          <Typography variant="h3" className="font-bold text-gray-900 flex items-center gap-2">
            💰 Payment Summary
          </Typography>
          
          <div className="space-y-3">
            {/* Base Price */}
            <div className="flex justify-between items-center py-2 border-b border-emerald-200">
              <Typography variant="paragraph" className="text-gray-700">Base Amount</Typography>
              <Typography variant="paragraph" className="font-semibold text-gray-900 text-lg">
                {formatPrice(pricingBreakdown.basePrice)}
              </Typography>
            </div>

            {/* GST */}
            <div className="flex justify-between items-center py-2 border-b border-emerald-200">
              <Typography variant="paragraph" className="text-gray-700">GST (18%)</Typography>
              <Typography variant="paragraph" className="font-semibold text-gray-900 text-lg">
                {formatPrice(pricingBreakdown.gstAmount)}
              </Typography>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 bg-emerald-100 rounded-lg px-4 mt-2">
              <Typography variant="paragraph" className="font-bold text-gray-900 text-lg">Total Amount</Typography>
              <Typography variant="h3" className="font-bold text-emerald-600 text-2xl">
                {formatPrice(pricingBreakdown.totalPrice)}
              </Typography>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="text-sm text-gray-600 bg-white bg-opacity-60 rounded-lg p-3 space-y-1">
            <div className="flex justify-between">
              <Typography variant="small" textColor="primary">Price per night:</Typography>
              <Typography variant="small" textColor="primary" className="font-medium">
                {formatPrice(pricingBreakdown.basePrice / (calculateNights(values.checkIn, values.checkOut) * values.numberOfRooms))}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="small" textColor="primary">Nights:</Typography>
              <Typography variant="small" textColor="primary" className="font-medium">
                {calculateNights(values.checkIn, values.checkOut)}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="small" textColor="primary">Rooms:</Typography>
              <Typography variant="small" textColor="primary" className="font-medium">
                {values.numberOfRooms}
              </Typography>
            </div>
          </div>

          {/* Payment Info */}
          <div className="text-xs text-gray-600 bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <Typography variant="small" textColor="primary">
              💳 Pay at the property during check-in
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDetails;