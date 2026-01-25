"use client";

import Typography from "@/components/layout/Typography";
import { useBookingForm } from "@/hooks/use-booking-form";
import { bookingSchema, initialValues } from "@/validators/booking";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import DateSelector from "./DateSelector";
import GuestDetails from "./GuestDetails";
import NotificationPopup from "./NotificationPopup";
import RoomSelector from "./RoomSelector";

const BookingForm = () => {
  const {
    mounted,
    showPopup,
    popupMessage,
    popupType,
    isSubmitting,
    rooms,
    showCalendar,
    setShowCalendar,
    selectedRoomId,
    isCheckingAvailability,
    calendarRefreshKey,
    formikRef,
    handleRoomChange,
    handleDateSelect,
    handleSubmit,
  } = useBookingForm();

  if (!mounted) return null;

  return (
    <>
      <section
        id="booking"
        className="py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      >
        <div className="max-w-5xl mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <Typography varient='h2' className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Reserve Your Stay
            </Typography>
            <Typography varient='paragraph' className="text-gray-600">
              Book your perfect mountain escape in just a few steps
            </Typography>
          </div>

          {/* Booking Form */}
          <Formik
            initialValues={{ ...initialValues, roomId: selectedRoomId }}
            enableReinitialize={true}
            validationSchema={bookingSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {({ values, setFieldValue }) => {
              useEffect(() => {
                formikRef.current = { setFieldValue };
              }, [setFieldValue]);
              
              useEffect(() => {
                if (selectedRoomId && selectedRoomId !== values.roomId) {
                  setFieldValue('roomId', selectedRoomId);
                }
              }, [selectedRoomId, setFieldValue]);

              return (
                <Form className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  
                  {/* Compact Room Selection Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      
                      <Typography varient='h3' className="text-white font-semibold text-lg">Select Your Room</Typography>
                    </div>
                    <RoomSelector 
                      rooms={rooms}
                      onRoomChange={(roomId) => handleRoomChange(roomId, setFieldValue)}
                    />
                  </div>

                  {/* Main Form Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    
                    {/* Date Selection - Compact */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📅</span>
                        </div>
                        <Typography varient='h3' className="font-semibold text-gray-900">Check-in & Check-out</Typography>
                      </div>
                      <DateSelector
                        selectedRoomId={selectedRoomId}
                        showCalendar={showCalendar}
                        setShowCalendar={setShowCalendar}
                        onDateSelect={(checkIn, checkOut) => handleDateSelect(checkIn, checkOut, setFieldValue)}
                        selectedCheckIn={values.checkIn}
                        selectedCheckOut={values.checkOut}
                        refreshTrigger={calendarRefreshKey}
                      />
                    </div>

                    {/* Guest Details - Pass rooms prop */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Typography varient='h3' className="font-semibold text-gray-900">Guest Information</Typography>
                      </div>
                      <GuestDetails rooms={rooms} />
                    </div>

                    {/* Submit Button - Eye-catching */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isCheckingAvailability}
                      className={`
                        w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                        hover:from-blue-700 hover:to-indigo-700
                        text-white font-semibold py-4 px-6 rounded-xl 
                        shadow-lg hover:shadow-xl
                        transform hover:scale-[1.02] active:scale-[0.98]
                        transition-all duration-200
                        flex items-center justify-center gap-3
                        ${(isSubmitting || isCheckingAvailability) ? "opacity-60 cursor-not-allowed" : ""}
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing Booking...</span>
                        </>
                      ) : isCheckingAvailability ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Checking Availability...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Booking</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Instant Confirmation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Booking</span>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </section>

      {/* Notification Popup */}
      <NotificationPopup 
        show={showPopup}
        type={popupType}
        message={popupMessage}
      />
    </>
  );
};

export default BookingForm;