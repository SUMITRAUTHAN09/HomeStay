import Typography from "../Typography";

const Rooms = () => {
  const rooms = [
    {
      name: "Deluxe Mountain View",
      capacity: 2,
      price: 3500,
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      features: [
        "King Bed",
        "Mountain View",
        "Private Balcony",
        "Attached Bath",
      ],
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

  return (
    <section
      id="rooms"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#BFC7DE]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Our Cozy Rooms
          </Typography>
          <Typography variant="paragraph" textColor="secondary" align="center">
            Comfortable accommodations with stunning mountain vistas
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:sm:scale-105"
            >
              <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-[#7570BC] text-white px-3 py-1 rounded-full">
                  <Typography
                    variant="small"
                    textColor="white"
                    weight="semibold"
                  >
                    Up to {room.capacity} Guests
                  </Typography>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <Typography
                  variant="h4"
                  textColor="primary"
                  weight="bold"
                  className="mb-4"
                >
                  {room.name}
                </Typography>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#7570BC] rounded-full" />
                      <Typography variant="small" textColor="secondary">
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#BFC7DE]">
                  <div>
                    <Typography
                      variant="h3"
                      textColor="primary"
                      weight="bold"
                      as="span"
                    >
                      ₹{room.price}
                    </Typography>
                    <Typography
                      variant="muted"
                      textColor="secondary"
                      as="span"
                    >
                      {" / night"}
                    </Typography>
                  </div>
                  <a
                    href="#booking"
                    className="bg-[#734746] text-white px-5 sm:px-6 py-2 rounded-full hover:bg-[#7570BC] transition-all"
                  >
                    <Typography
                      variant="small"
                      textColor="white"
                      weight="semibold"
                    >
                      Book
                    </Typography>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
