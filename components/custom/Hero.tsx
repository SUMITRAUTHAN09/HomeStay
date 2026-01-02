import URL from "@/app/constant";
import { ChevronRight, MapPin, Star } from "lucide-react";
import Typography from "../Typography";
import HeroBackgroundCarousel from "../background/HeroBackground";

interface HeroProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const Hero: React.FC<HeroProps> = ({ canvasRef }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen lg:h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroBackgroundCarousel />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A177]/10 to-[#C9A177] z-1" />

      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl">
        <div className="flex items-center justify-center gap-2 mt-10">
          <Typography variant="h1" textColor="primary" weight="extrabold">
            Aamantran
          </Typography>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="text-[#7570BC]" size={20} />
          <Typography variant="paragraph" textColor="primary" weight="semibold">
            {URL.LOCATION}
          </Typography>
        </div>

        <Typography
          variant="h1"
          textColor="primary"
          weight="extrabold"
          align="center"
          className="mb-5 sm:mb-6"
        >
          A Perfect Time for
          <br />
          <span className="text-[#7570BC]">Relax and Yoga Chill</span>
        </Typography>

        <Typography
          variant="paragraph"
          textColor="white"
          align="center"
          className="mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          Looking for reasons to try yoga? From increased strength to
          flexibility to heart health, we have 38 benefits to getting on your
          mat.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#booking"
            className="bg-gradient-to-r from-[#0F766E] to-[#22C55E] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#C59594] transition-all transform hover:scale-105"
          >
            <Typography variant="paragraph" textColor="white" weight="semibold">
              Book Your Stay
            </Typography>
          </a>

          <a
            href="#rooms"
            className="bg-gradient-to-r from-[#0F172A] to-[#1D4ED8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#C59594] transition-all transform hover:scale-105"
          >
            <Typography
              variant="paragraph"
              textColor="white"
              weight="semibold"
            >
              Explore Rooms
            </Typography>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
          <div className="text-center flex flex-col items-center">
            <Typography
              variant="h3"
              textColor="primary"
              weight="bold"
              className="mb-2"
            >
              {URL.ALTITUDE}
            </Typography>
            <Typography variant="muted" textColor="secondary">
              Altitude
            </Typography>
          </div>

          <div className="text-center flex flex-col items-center">
            <Typography
              variant="h3"
              textColor="primary"
              weight="bold"
              className="mb-2"
            >
              {URL.AVG_TEMP}
            </Typography>
            <Typography variant="muted" textColor="secondary">
              Avg Temp
            </Typography>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="fill-yellow-500 text-yellow-500" size={24} />
              <Typography variant="h3" textColor="primary" weight="bold">
                4.9
              </Typography>
            </div>
            <Typography variant="muted" textColor="secondary">
              Rating
            </Typography>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1 sm:bottom-1 right-1 transform -translate-x-1/2 animate-bounce z-20">
        <ChevronRight size={28} className="rotate-90 text-[#7570BC]" />
      </div>
    </section>
  );
};

export default Hero;
