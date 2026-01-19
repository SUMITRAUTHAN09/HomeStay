"use client";

import { useState, useEffect } from "react";
import { Utensils, Coffee, Moon } from "lucide-react";
import Typography from "../Typography";
import FoodMenuSlider from "../background/FoodMenuSlider";
import { api } from "@/lib/api-clients";

interface MenuItem {
  _id?: string;
  name: string;
  description?: string;
}

interface MenuCategory {
  _id?: string;
  category: string;
  items: MenuItem[];
  order: number;
}

// Add proper typing for the API response
interface MenuResponse {
  success: boolean;
  data?: {
    data?: {
      categories?: MenuCategory[];
    };
    categories?: MenuCategory[];
  } | MenuCategory[];
  error?: string;
}

const CATEGORY_ICONS = {
  Breakfast: Coffee,
  Lunch: Utensils,
  Dinner: Moon,
};

const Dining = () => {
  const [menuItems, setMenuItems] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      console.log('🍽️ Loading menu from API...');
      const response = await api.menu.get() as MenuResponse;
      console.log('📥 Menu API response:', response);
      
      if (response.success && response.data) {
        // Extract categories from the nested data structure
        let menuCategories: MenuCategory[] = [];
        
        // Handle different response structures
        if (!Array.isArray(response.data)) {
          if (response.data.data?.categories) {
            // Nested structure: { data: { data: { categories: [...] } } }
            menuCategories = response.data.data.categories;
            console.log('📋 Extracted from data.data.categories:', menuCategories);
          } else if (response.data.categories) {
            // Direct structure: { data: { categories: [...] } }
            menuCategories = response.data.categories;
            console.log('📋 Extracted from data.categories:', menuCategories);
          }
        } else {
          // Array structure: { data: [...] }
          menuCategories = response.data;
          console.log('📋 Extracted from data (array):', menuCategories);
        }
        
        // Filter to show only Breakfast, Lunch, Dinner and sort by order
        const filteredCategories = menuCategories
          .filter((cat: MenuCategory) => 
            ['Breakfast', 'Lunch', 'Dinner'].includes(cat.category)
          )
          .sort((a: MenuCategory, b: MenuCategory) => a.order - b.order);
        
        console.log('✅ Filtered menu categories:', filteredCategories);
        
        if (filteredCategories.length > 0) {
          setMenuItems(filteredCategories);
        } else {
          console.warn('⚠️ No menu items found in API, using fallback');
          setMenuItems(getFallbackMenu());
        }
      } else {
        console.warn('⚠️ API response unsuccessful, using fallback');
        setMenuItems(getFallbackMenu());
      }
    } catch (error) {
      console.error("❌ Failed to load menu from API:", error);
      // Fallback to default menu if API fails
      setMenuItems(getFallbackMenu());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMenu = (): MenuCategory[] => [
    {
      category: "Breakfast",
      order: 1,
      items: [
        { name: "Aloo Paratha with Curd", description: "Traditional stuffed flatbread" },
        { name: "Poha & Tea", description: "Flattened rice with spices" },
        { name: "Upma with Chutney", description: "Semolina porridge" },
        { name: "Fresh Fruits & Juice", description: "Seasonal fresh fruits" },
      ],
    },
    {
      category: "Lunch",
      order: 2,
      items: [
        { name: "Dal Tadka with Rice", description: "Lentil curry with rice" },
        { name: "Rajma Chawal", description: "Kidney beans with rice" },
        { name: "Veg Thali", description: "Complete vegetarian platter" },
        { name: "Paneer Curry with Roti", description: "Cottage cheese curry" },
      ],
    },
    {
      category: "Dinner",
      order: 3,
      items: [
        { name: "Kadhi Pakora", description: "Yogurt curry with fritters" },
        { name: "Mix Veg with Roti", description: "Mixed vegetable curry" },
        { name: "Khichdi with Papad", description: "Comfort food special" },
        { name: "Local Mountain Cuisine", description: "Traditional dishes" },
      ],
    },
  ];

  if (loading) {
    return (
      <section
        id="dining"
        className="relative min-h-175 sm:min-h-200 lg:min-h-225 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
      >
        <FoodMenuSlider />
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <Typography variant="paragraph" textColor="offWhite">
              Loading menu...
            </Typography>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="dining"
      className="relative min-h-175 sm:min-h-200 lg:min-h-225 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Slider */}
      <FoodMenuSlider />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Utensils className="mx-auto text-white mb-4" size={48} />
          <Typography
            variant="h2"
            textColor="offWhite"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Home-Cooked Delights
          </Typography>
          <Typography variant="paragraph" textColor="cream" align="center">
            Savor authentic local cuisine made with love
          </Typography>
        </div>

        {/* Menu Cards - Only Breakfast, Lunch, Dinner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {menuItems.map((menu, idx) => {
            const IconComponent = CATEGORY_ICONS[menu.category as keyof typeof CATEGORY_ICONS] || Utensils;
            
            return (
              <div
                key={menu._id || idx}
                className="bg-white/95 p-6 sm:p-7 rounded-2xl shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Category Header with Icon */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <IconComponent className="text-[#7570BC]" size={24} />
                  </div>
                  <Typography
                    variant="h4"
                    textColor="primary"
                    weight="bold"
                  >
                    {menu.category}
                  </Typography>
                </div>

                {/* Menu Items */}
                <ul className="space-y-3">
                  {menu.items.map((item, i) => (
                    <li key={item._id || i} className="group">
                      <div className="flex gap-2">
                        <span className="text-[#7570BC] group-hover:scale-125 transition-transform duration-200">•</span>
                        <div className="flex-1">
                          <Typography 
                            variant="paragraph" 
                            textColor="secondary"
                            weight="semibold"
                            className="mb-1"
                          >
                            {item.name}
                          </Typography>
                          {item.description && (
                            <Typography 
                              variant="paragraph" 
                              textColor="secondary"
                              className="text-sm text-gray-500 italic"
                            >
                              {item.description}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Empty state for categories with no items */}
                {menu.items.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <IconComponent size={32} className="mx-auto mb-2 opacity-30" />
                    <Typography variant="paragraph" textColor="secondary" className="text-sm">
                      Coming soon...
                    </Typography>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Meal Plan Info */}
        <div className="mt-10 sm:mt-12 bg-white/90 p-6 sm:p-8 rounded-2xl border-2 border-[#7570BC]/30 text-center backdrop-blur-sm shadow-lg">
          <Typography variant="paragraph" textColor="secondary" align="center">
            <Typography
              variant="paragraph"
              textColor="primary"
              weight="semibold"
              as="span"
            >
              Meal Plans:{" "}
            </Typography>
            All meals prepared with fresh, local ingredients from the mountains. 
            Vegetarian options available. Special dietary requirements? Just let us know!
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default Dining;