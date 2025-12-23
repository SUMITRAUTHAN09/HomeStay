"use client";

import { heroImages } from "@/app/constant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

export default function HeroBackgroundCarousel() {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Fade(),
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
        }),
      ]}
      className="absolute inset-0 z-0"
    >
      <CarouselContent className="h-full">
        {heroImages.map((src, index) => (
          <CarouselItem key={index} className="h-screen">
            <div
              className="h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${src})` }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
