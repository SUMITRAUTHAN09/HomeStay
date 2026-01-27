"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapVideo } from "@/constants";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Photos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all gallery images
    fetch("/api/gallery/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.images) {
          // Get gallery category images
          const galleryImgs = data.images.filter(
            (img: any) => img.category === "gallery",
          );

          if (galleryImgs.length === 0) {
            // Fallback to beautiful placeholders
            setPhotos([
              {
                id: "1",
                url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
                title: "Beautiful View",
              },
              {
                id: "2",
                url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600",
                title: "Cozy Room",
              },
              {
                id: "3",
                url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600",
                title: "Mountain View",
              },
              {
                id: "4",
                url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600",
                title: "Relaxing Space",
              },
              {
                id: "5",
                url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600",
                title: "Garden Area",
              },
              {
                id: "6",
                url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600",
                title: "Dining Area",
              },
            ]);
          } else {
            setPhotos(galleryImgs);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load photos:", err);
        setPhotos([
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600",
            title: "Beautiful View",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-[#734746]/20 to-[#7570BC]/20 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <section id="gallery">
      <div className="w-full flex justify-center">
        <div className=" w-full sm:w-[95%] lg:w-[80%] md:h-150 aspect-video rounded-2xl p-2 sm:p-4 bg-white/40 backdrop-blur-md shadow-xl">
          <video
            src={MapVideo}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        {/* Photo Grid */}
      </div>
      <div className="w-full">
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 sm:basis-1/4 lg:basis-1/5"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={photo.url}
                      alt={photo.title || `Gallery photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="h-10 w-10 bg-white/80 hover:bg-white shadow-lg [&_svg]:h-6 [&_svg]:w-8 left-2" />
            <CarouselNext className="h-10 w-10 bg-white/80 hover:bg-white shadow-lg [&_svg]:h-6 [&_svg]:w-8 right-2" />
          </Carousel>
        </div>

        {/* Empty State */}
        {photos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No photos yet. Upload images via the admin dashboard!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

