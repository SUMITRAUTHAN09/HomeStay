"use client";
import { useState } from 'react';
import Typography from "../Typography";
const BookingForm = () => {
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
    meals: 'breakfast'
  });

   const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleBookingSubmit = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.name || !bookingData.email || !bookingData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Booking request submitted! We will contact you shortly.');
  };

  return (
    <section id="booking" className="py-24 px-6 bg-[#C9A177]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Typography variant="h2" textColor="offWhite" weight="bold" align="center" className="mb-4">
            Book Your Stay
          </Typography>
          <Typography variant="paragraph" textColor="cream" align="center">
            Reserve your mountain escape today
          </Typography>
        </div>

        <div className="bg-white p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Typography variant="label" textColor="primary" className="block mb-2">
                Check-in Date
              </Typography>
              <input type="date" name="checkIn" value={bookingData.checkIn} onChange={handleBookingChange} className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none" />
            </div>
            <div>
              <Typography variant="label" textColor="primary" className="block mb-2">
                Check-out Date
              </Typography>
              <input type="date" name="checkOut" value={bookingData.checkOut} onChange={handleBookingChange} className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none" />
            </div>
          </div>

          <div>
            <Typography variant="label" textColor="primary" className="block mb-2">
              Number of Guests
            </Typography>
            <select name="guests" value={bookingData.guests} onChange={handleBookingChange} className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none">
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <Typography variant="label" textColor="primary" className="block mb-2">
              Meal Plan
            </Typography>
            <select name="meals" value={bookingData.meals} onChange={handleBookingChange} className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none">
              <option value="breakfast">Breakfast Only</option>
              <option value="halfboard">Breakfast + Dinner</option>
              <option value="fullboard">All Meals (Breakfast, Lunch, Dinner)</option>
            </select>
          </div>

          <div>
            <Typography variant="label" textColor="primary" className="block mb-2">
              Full Name
            </Typography>
            <input type="text" name="name" value={bookingData.name} onChange={handleBookingChange} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Typography variant="label" textColor="primary" className="block mb-2">
                Email
              </Typography>
              <input type="email" name="email" value={bookingData.email} onChange={handleBookingChange} placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none" />
            </div>
            <div>
              <Typography variant="label" textColor="primary" className="block mb-2">
                Phone
              </Typography>
              <input type="tel" name="phone" value={bookingData.phone} onChange={handleBookingChange} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-lg bg-[#BFC7DE]/30 border-2 border-[#BFC7DE] focus:border-[#7570BC] focus:outline-none" />
            </div>
          </div>

          <button onClick={handleBookingSubmit} className="w-full bg-[#7570BC] text-white px-8 py-4 rounded-full hover:bg-[#C59594] transition-all transform hover:scale-105 shadow-lg">
            <Typography variant="paragraph" textColor="white" weight="semibold">
              Confirm Booking
            </Typography>
          </button>
        </div>
      </div>
    </section>
  );
};
export default BookingForm;