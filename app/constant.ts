import { Car, Coffee, Mountain, Trees, Utensils, Wifi } from "lucide-react";
const URL = {
  HOMESTAY_LOGO: "/images/HomeStayHeading.jpg",
  LOCATION: "Rudraprayag, Uttarakhand, India (246171)",
  PHOME_NO: "+91 9876543210",
  EMAIL: "aamantran@gmail.com",
  ALTITUDE: "2936f",
  AVG_TEMP: "10°C",
  LOGO: "/images/go.png",
  LOGO_NAME: "/images/logoImage1.jpeg",
} as const;

export default URL;

export const RoomsType = [
  {
    name: "Deluxe Mountain View",
    capacity: 2,
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    features: ["King Bed", "Mountain View", "Private Balcony", "Attached Bath"],
  },
  {
    name: "Family Suite",
    capacity: 4,
    price: 5500,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
    features: ["2 Bedrooms", "Living Area", "Valley View", "Kitchenette"],
  },
  {
    name: "Cozy Mountain Cabin",
    capacity: 3,
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    features: ["Queen + Single", "Fireplace", "Garden View", "Tea Corner"],
  },
];

export const menuItems = [
  {
    category: "Breakfast",
    items: [
      "Aloo Paratha with Curd",
      "Poha & Tea",
      "Upma with Chutney",
      "Fresh Fruits & Juice",
    ],
  },
  {
    category: "Lunch",
    items: [
      "Dal Tadka with Rice",
      "Rajma Chawal",
      "Veg Thali",
      "Paneer Curry with Roti",
    ],
  },
  {
    category: "Dinner",
    items: [
      "Kadhi Pakora",
      "Mix Veg with Roti",
      "Khichdi with Papad",
      "Local Mountain Cuisine",
    ],
  },
  { category: "Snacks", items: ["Maggi", "Pakoras", "Sandwich", "Tea/Coffee"] },
];

export const amenities = [
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    desc: "Stay connected even in the mountains",
  },
  {
    icon: Utensils,
    title: "Home-Cooked Meals",
    desc: "3 meals a day included",
  },
  { icon: Car, title: "Free Parking", desc: "Secure parking for your vehicle" },
  {
    icon: Mountain,
    title: "Mountain Treks",
    desc: "Guided hiking trails nearby",
  },
  { icon: Trees, title: "Nature Walks", desc: "Scenic forest paths" },
  {
    icon: Coffee,
    title: "24/7 Tea/Coffee",
    desc: "Complimentary beverages anytime",
  },
];

export const NavItem = ["Home","About", "Rooms", "Dining", "Amenities","Gallery", "Booking"];
export const MapVideo="/gallery/AamantranStays.mp4";
export const menuImages = [
  "/food/image1.jpg",
  "/food/image2.jpg",
  "/food/image3.jpg",
  "/food/image4.jpg",
  "/food/image5.jpg",
  "/food/image6.jpg",
  "/food/image7.jpg",
  "/food/image008.jpg",
];

export const heroImages = [
  "/hero/img1.jpg",
  "/hero/img2.jpg",
  "/hero/img3.jpg",
  "/hero/img44.jpg",
];

export const galleryImages = [
  "/gallery/pop1.jpg",
  "/gallery/pop2.jpg",
  "/gallery/pop3.jpg",
  "/gallery/pop4.jpg",
  "/gallery/pop5.jpg",
  "/gallery/pop6.jpg",
  "/gallery/pop7.jpg",
  "/gallery/pop404.jpg",
  "/food/image1.jpg",
  "/food/image2.jpg",
  "/food/image3.jpg",
  "/food/image4.jpg",
  "/food/image5.jpg",
  "/food/image6.jpg",
  "/food/image7.jpg",
  "/food/image008.jpg",
  "/hero/img1.jpg",
  "/hero/img2.jpg",
  "/hero/img3.jpg",
  "/hero/img44.jpg",
];


export const formFields = [
  {
    label: "Check-in Date",
    name: "checkIn",
    type: "date",
  },
  {
    label: "Check-out Date",
    name: "checkOut",
    type: "date",
  },
  {
    label: "Number of Guests",
    name: "guests",
    type: "select",
    options: [1, 2, 3, 4, 5, 6],
  },
  {
    label: "Meal Plan",
    name: "meals",
    type: "select",
    options: [
      { label: "Confirm Later", value: "Confirm Later" },
      { label: "Breakfast Only", value: "breakfast" },
      { label: "Breakfast + Dinner", value: "halfboard" },
      { label: "All Meals", value: "fullboard" },
    ],
  },
  {
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    placeholder: "+91 98765 43210",
  },
];
