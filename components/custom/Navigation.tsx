import URL, { NavItem } from "@/app/constant";
import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Typography from "../Typography";
interface NavigationProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollY: number;
}

const Navigation: React.FC<NavigationProps> = ({
  menuOpen,
  setMenuOpen,
  scrollY,
}) => {
  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrollY > 50 ? "rgba(199, 154, 119, 0.95)" : "transparent",
        backdropFilter: scrollY > 50 ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-9xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={URL.LOGO}
            alt="Homestay Logo"
            width={50}
            height={50}
            priority 
          />
          {/*<Mountain className="text-[#7570BC]" size={32} />*/}
          <Typography variant="brand" textColor="white" weight="bold" >
          A Boutique Homestay
          </Typography>
        </div>

        <div className="hidden md:flex gap-8">
          {NavItem.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#0D0A1F] hover:text-[#7570BC] transition-colors font-medium"
            >
              <Typography
                variant="paragraph"
                textColor="primary"
                weight="medium"
              >
                {item}
              </Typography>
            </a>
          ))}
        </div>

        <a
          href="tel:+919876543210"
          className="hidden md:flex items-center gap-2 bg-[#7570BC] text-white px-6 py-2 rounded-full hover:bg-[#C59594] transition-all"
        >
          <Phone size={18} />
          <Typography variant="small" textColor="white" weight="semibold">
            Call Us
          </Typography>
        </a>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <X size={28} className="text-[#0D0A1F]" />
          ) : (
            <Menu size={28} className="text-[#0D0A1F]" />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#C9A177] border-t border-[#BFC7DE]">
          <div className="flex flex-col gap-4 p-6">
            {["Home", "Rooms", "Dining", "Amenities", "Booking"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                <Typography
                  variant="paragraph"
                  textColor="primary"
                  weight="medium"
                  className="hover:text-[#7570BC] transition-colors"
                >
                  {item}
                </Typography>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
