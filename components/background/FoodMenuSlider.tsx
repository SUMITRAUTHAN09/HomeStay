"use client";

import { menuImages } from "@/app/constant";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function FoodMenuSlider() {
  const [items, setItems] = useState([...menuImages, ...menuImages]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sliderRef.current || isTransitioning) return;

      setIsTransitioning(true);
      sliderRef.current.style.transition = "transform 1s ease-in-out";
      sliderRef.current.style.transform = "translateX(-12.5%)";

      setTimeout(() => {
        if (!sliderRef.current) return;
        
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transform = "translateX(0)";

        setItems((prev) => {
          const first = prev[0];
          return [...prev.slice(1), first];
        });
        
        setIsTransitioning(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div
        ref={sliderRef}
        className="flex h-full w-full"
      >
        {items.map((src, index) => (
          <div 
            key={`${src}-${index}`} 
            className="relative w-[12.5%] h-full flex-shrink-0"
          >
            <Image
              src={src}
              alt={`Food background ${(index % menuImages.length) + 1}`}
              fill
              className="object-cover"
              priority={index < 16}
              sizes="12.5vw"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
    </div>
  );
}