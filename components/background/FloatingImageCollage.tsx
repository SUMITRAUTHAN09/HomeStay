"use client";

import { galleryImages } from "@/app/constant";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FloatingImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
};

export default function FloatingImageCollage() {
  const [items, setItems] = useState<FloatingImage[]>([]);
  const counterRef = useRef(0);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    console.log("Gallery images loaded:", galleryImages);

    if (!galleryImages || galleryImages.length === 0) {
      console.error("No gallery images found!");
      return;
    }

    const createImage = (): FloatingImage => {
      const id = `img-${counterRef.current}`;
      const src = galleryImages[imageIndexRef.current % galleryImages.length];
      
      console.log(`Creating image ${counterRef.current}:`, src);
      
      counterRef.current += 1;
      imageIndexRef.current += 1;
      
      return {
        id,
        src,
        x: 5 + Math.random() * 70,
        y: 5 + Math.random() * 60,
        size: 200 + Math.random() * 200,
        rotate: -15 + Math.random() * 50,
      };
    };

    // Add initial images with staggered timing
    const timer1 = setTimeout(() => {
      setItems((prev) => [...prev, createImage()]);
    }, 0);

    const timer2 = setTimeout(() => {
      setItems((prev) => [...prev, createImage()]);
    }, 1000);

    const timer3 = setTimeout(() => {
      setItems((prev) => [...prev, createImage()]);
    }, 2000);

     const timer4 = setTimeout(() => {
      setItems((prev) => [...prev, createImage()]);
    }, 1500);

    // Add new images periodically
    const interval = setInterval(() => {
      setItems((prev) => {
        const newImage = createImage();
        const updated = [...prev, newImage];
        // Keep only the last 8 images
        return updated.slice(-8);
      });
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(interval);
    };
  }, []);

  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <p>No gallery images available</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((img) => (
        <div
          key={img.id}
          className="absolute"
          style={{
            left: `${img.x}%`,
            top: `${img.y}%`,
            width: `${img.size}px`,
            height: `${img.size}px`,
            transform: `rotate(${img.rotate}deg)`,
            zIndex: 1,
            animation: 'fade-in-out 8s ease-in-out forwards',
          }}
        >
          <div className="relative w-full h-full shadow-2xl rounded-xl overflow-hidden border-4 border-white/80 bg-gray-200">
            <Image
              src={img.src}
              alt="Gallery image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 200px, 300px"
              unoptimized={true}
              onError={() => {
                console.error("❌ Image failed to load:", img.src);
              }}
              onLoad={() => {
                console.log("✓ Image loaded successfully:", img.src);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}