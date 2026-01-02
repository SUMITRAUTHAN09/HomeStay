"use client";

import { galleryImages } from "@/app/constant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Photos() {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {galleryImages.map((src, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/4 lg:basis-1/4"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
       <CarouselPrevious
  className="h-10 w-10 bg-white/80 hover:bg-white shadow-lg [&_svg]:h-6 [&_svg]:w-6 -left-6"
/>
<CarouselNext
  className="h-10 w-10 bg-white/80 hover:bg-white shadow-lg [&_svg]:h-6 [&_svg]:w-6 -right-6"
/>
      </Carousel>
    </div>
  );
}
