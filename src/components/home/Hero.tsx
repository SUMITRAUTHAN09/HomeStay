import HeroBackgroundCarousel from "@/components/backgrounds/HeroBackground";
import Typography from "@/components/layout/Typography";
import URL from "@/constants";
import { ChevronRight, MapPin } from "lucide-react";
import LiveTemperature from "./LiveTemerature";

interface HeroProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const Hero: React.FC<HeroProps> = ({ canvasRef }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen lg:h-screen flex items-center justify-center overflow-hidden pt-10 sm:pt-15"
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
          <MapPin className="text-[red]" size={20} />
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
          <span className="text-[#7570BC]">Relax and Chill</span>
        </Typography>

        <Typography
          variant="paragraph"
          textColor="white"
          align="center"
          className="mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
         Escape the noise and step into a space where mountains, silence, and fresh air come together. A place designed to relax, slow down, and truly unwind.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-5 md:gap-35 justify-center">
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

        <div className="grid grid-cols-2 sm:grid-cols-2 mt-10 sm:mt-5 max-w-2xl mx-auto">
          <div className="text-center flex flex-col items-center">
            <Typography
              variant="h3"
              textColor="primary"
              weight="bold"
            >
              {URL.ALTITUDE}
            </Typography>
            <Typography variant="muted" textColor="secondary">
              Altitude
            </Typography>
          </div>

          <div className="text-center flex flex-col items-center">
            <LiveTemperature latitude={30.305474} longitude={79.007174}/>
            <Typography variant="muted" textColor="secondary">
              Temperature
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

