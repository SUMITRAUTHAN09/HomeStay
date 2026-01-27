"use client";

import Typography from "@/components/layout/Typography";
import { publicApi } from '@/lib/api-client';
import { MAX_ROOMS_PER_TYPE } from '@/types/booking';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoomImageCarouselProps {
  images: string[];
  roomName: string;
}

function RoomImageCarousel({ images, roomName }: RoomImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex(index);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop"
          alt={roomName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden group">
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`${roomName} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop';
        }}
      />

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Navigation Arrows - Show on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to get available rooms count
const getAvailableRoomsCount = (roomName: string): number => {
  const roomType = roomName as keyof typeof MAX_ROOMS_PER_TYPE;
  return MAX_ROOMS_PER_TYPE[roomType] || 1;
};

const Rooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching available rooms from public API...');
      
      const response = await publicApi.rooms.getAll();
      
      console.log('📥 API Response:', response);
      
      if (response.success && response.data) {
        const roomData = (response.data as any).rooms || (response.data as any).data || response.data;
        const roomsArray = Array.isArray(roomData) ? roomData : [];
        
        console.log(`✅ Loaded ${roomsArray.length} available rooms`);
        setRooms(roomsArray);
      } else {
        throw new Error(response.error || 'Failed to load rooms');
      }
    } catch (err: any) {
      console.error('❌ Failed to load rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    sessionStorage.setItem('selectedRoomId', roomId);
    
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    window.dispatchEvent(new CustomEvent('roomSelected', { detail: { roomId } }));
  };

  if (loading) {
    return (
      <section id="rooms" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#BFC7DE]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#BFC7DE]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadRooms}
            className="px-6 py-2 bg-[#7570BC] text-white rounded-full hover:bg-[#6a66b0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rooms"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#BFC7DE]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Our Cozy Rooms
          </Typography>
          <Typography variant="paragraph" textColor="secondary" align="center">
            Comfortable accommodations with stunning mountain vistas
          </Typography>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Typography variant="h4" textColor="secondary" className="mb-2">
              No rooms available at the moment
            </Typography>
            <Typography variant="paragraph" textColor="secondary">
              Please check back later or contact us for more information
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rooms.map((room) => {
              const availableRoomsCount = getAvailableRoomsCount(room.name);
              
              return (
                <div
                  key={room._id}
                  className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:sm:scale-105"
                >
                  {/* Image Carousel Component */}
                  <RoomImageCarousel 
                    images={room.images || []} 
                    roomName={room.name} 
                  />
                  <div className="p-5 sm:p-6">
                    <Typography
                      variant="h4"
                      textColor="primary"
                      weight="bold"
                      className="mb-4"
                    >
                      {room.name}
                    </Typography>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(room.features || room.amenities || []).slice(0, 4).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-[#7570BC] rounded-full" />
                          <Typography variant="small" textColor="secondary">
                            {feature}
                          </Typography>
                        </div>
                      ))}
                    </div>

                    {room.description && (
                      <Typography variant="small" textColor="secondary" className="mb-4 line-clamp-2">
                        {room.description}
                      </Typography>
                    )}

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#BFC7DE]">
                      <div>
                        <Typography
                          variant="h3"
                          textColor="primary"
                          weight="bold"
                          as="span"
                        >
                          ₹{room.price.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="muted"
                          textColor="secondary"
                          as="span"
                        >
                          {" / night + 18% GST"}
                        </Typography>
                      </div>
                      <button
                        onClick={(e) => handleBookRoom(room._id, e)}
                        className="bg-[#734746] text-white px-5 sm:px-6 py-2 rounded-full hover:bg-[#7570BC] transition-all"
                      >
                        <Typography
                          variant="small"
                          textColor="white"
                          weight="semibold"
                        >
                          Book
                        </Typography>
                      </button>
                    </div>

                    {/* Available Rooms Count - NEW SECTION */}
                    <div className="mt-4 pt-4 border-t border-[#BFC7DE]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <Typography variant="small" textColor="secondary" weight="semibold">
                            {availableRoomsCount} {availableRoomsCount === 1 ? 'Room' : 'Rooms'} Available
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Rooms;