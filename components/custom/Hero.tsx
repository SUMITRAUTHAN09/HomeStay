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
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
     <HeroBackgroundCarousel/>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A177]/10 to-[#C9A177] z-1" />

      <div className="relative z-20 text-center px-6 max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Typography variant="h1" textColor="primary" weight="extrabold">
            Aamantran
          </Typography>
          </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          
          <MapPin className="text-[#7570BC]" size={24} />
          <Typography variant="paragraph" textColor="primary" weight="semibold">
           {URL.LOCATION}
          </Typography>
        </div>

        <Typography
          variant="h1"
          textColor="primary"
          weight="extrabold"
          align="center"
          className="mb-6"
        >
          A Perfect Time for
          <br />
          <span className="text-[#7570BC]">Relax and Yoga Chill</span>
        </Typography>

        <Typography
          variant="paragraph"
          textColor="secondary"
          align="center"
          className="mb-8 max-w-2xl mx-auto"
        >
          Looking for reasons to try yoga? From increased strength to
          flexibility to heart health, we have 38 benefits to getting on your
          mat.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#booking"
            className="bg-[#7570BC] text-white px-8 py-4 rounded-full hover:bg-[#C59594] transition-all transform hover:scale-105"
          >
            <Typography variant="paragraph" textColor="white" weight="semibold">
              Book Your Stay
            </Typography>
          </a>
          <a
            href="#rooms"
            className="border-2 border-[#7570BC] text-[#7570BC] px-8 py-4 rounded-full hover:bg-[#7570BC]/10 transition-all"
          >
            <Typography
              variant="paragraph"
              textColor="accent"
              weight="semibold"
            >
              Explore Rooms
            </Typography>
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
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
              <Star className="fill-yellow-500 text-yellow-500" size={28} />
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

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <ChevronRight size={32} className="rotate-90 text-[#7570BC]" />
      </div>
    </section>
  );
};

export default Hero;
