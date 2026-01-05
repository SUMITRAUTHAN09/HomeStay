"use client";

import Typography from "@/components/Typography";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Type declarations for window.storage
declare global {
  interface Window {
    storage: {
      get: (
        key: string,
        shared?: boolean
      ) => Promise<{ key: string; value: string; shared: boolean } | null>;
      set: (
        key: string,
        value: string,
        shared?: boolean
      ) => Promise<{ key: string; value: string; shared: boolean } | null>;
      delete: (
        key: string,
        shared?: boolean
      ) => Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
      list: (
        prefix?: string,
        shared?: boolean
      ) => Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>;
    };
  }
}

// Type definitions
interface Room {
  name: string;
  capacity: number;
  price: number;
  image: string;
  features: string[];
}

interface MenuItem {
  category: string;
  items: string[];
}

interface Amenity {
  title: string;
  desc: string;
  icon: string;
}

interface DataStructure {
  hero: {
    title: string;
    location: string;
    subtitle: string;
    highlightText: string;
    description: string;
    altitude: string;
    avgTemp: string;
    rating: string;
    images: string[];
  };
  rooms: Room[];
  dining: {
    title: string;
    subtitle: string;
    menuItems: MenuItem[];
    images: string[];
  };
  
  gallery: {
    title: string;
    subtitle: string;
    video: string;
    images: string[];
  };
}

// Initial data structure
const initialData: DataStructure = {
  hero:
  {
    title: "Aamantran",
    location: "Rudraprayag, Uttarakhand, India (246171)",
    subtitle: "A Perfect Time for",
    highlightText: "Relax and Yoga Chill",
    description:
      "Looking for reasons to try yoga? From increased strength to flexibility to heart health, we have 38 benefits to getting on your mat.",
    altitude: "2936f",
    avgTemp: "10°C",
    rating: "4.9",
    images: [
      "/hero/img1.jpg",
      "/hero/img2.jpg",
      "/hero/img3.jpg",
      "/hero/img44.jpg",
    ],
  },
  
  rooms: [
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
  ],
  dining: {
    title: "Home-Cooked Delights",
    subtitle: "Savor authentic local cuisine made with love",
    menuItems: [
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
      {
        category: "Snacks",
        items: ["Maggi", "Pakoras", "Sandwich", "Tea/Coffee"],
      },
    ],
    images: [
      "/food/image1.jpg",
      "/food/image2.jpg",
      "/food/image3.jpg",
      "/food/image4.jpg",
    ],
  },
  gallery: {
    title: "Memories in the Making",
    subtitle: "Moments captured from our beautiful homestay",
    video: "/gallery/AamantranStays.mp4",
    images: [
      "/gallery/pop1.jpg",
      "/gallery/pop2.jpg",
      "/gallery/pop3.jpg",
      "/gallery/pop4.jpg",
    ],
  },
};

type SectionKey = keyof DataStructure;

export default function AdminHostPage() {
  const [data, setData] = useState<DataStructure>(initialData);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await window.storage.get("homestay-data");
      if (result && result.value) {
        setData(JSON.parse(result.value));
      }
    } catch (error) {
      console.log("No saved data found, using defaults");
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    setIsSaving(true);
    try {
      await window.storage.set("homestay-data", JSON.stringify(data));
      setHasChanges(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <T extends SectionKey>(
    section: T,
    field: keyof DataStructure[T],
    value: any
  ) => {
    setData((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object" && !Array.isArray(prev[section])
          ? { ...prev[section], [field]: value }
          : value,
    }));
    setHasChanges(true);
  };

  const updateArrayItem = <T extends "rooms"  >(
    section: T,
    index: number,
    field: keyof DataStructure[T][number],
    value: any
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    setHasChanges(true);
  };

  const addArrayItem = <T extends "rooms"  >(
    section: T,
    newItem: DataStructure[T][number]
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
    setHasChanges(true);
  };

  const removeArrayItem = <T extends "rooms"  >(
    section: T,
    index: number
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const toggleEdit = (id: string) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Typography variant="paragraph"> Loading admin panel...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-200 border-b shadow-sm z-50">
        <div className="max-w-9xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Typography variant="h2" weight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="paragraph">
              Edit your homestay content
            </Typography>
          </div>
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2">
            {(["hero", "rooms", "dining", "gallery"] as const).map(
              (section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === section
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="flex gap-3">
            {hasChanges && (
              <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                Unsaved changes
              </span>
            )}
            <button
              onClick={saveData}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto mt-5">
        {/* Hero Section */}
        {activeSection === "hero" && (
          <div className="space-y-6">
            <div className="bg-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h3" weight="semibold">
                  Hero Section
                </Typography>
              </div>

              <div className="space-y-4">
                <EditableField
                  label="Subtitle"
                  value={data.hero.subtitle}
                  onChange={(v) => updateField("hero", "subtitle", v)}
                  editMode={editMode}
                  id="hero-subtitle"
                  toggleEdit={toggleEdit}
                />

                <EditableField
                  label="Highlight Text"
                  value={data.hero.highlightText}
                  onChange={(v) => updateField("hero", "highlightText", v)}
                  editMode={editMode}
                  id="hero-highlight"
                  toggleEdit={toggleEdit}
                />

                <EditableField
                  label="Description"
                  value={data.hero.description}
                  onChange={(v) => updateField("hero", "description", v)}
                  editMode={editMode}
                  id="hero-desc"
                  toggleEdit={toggleEdit}
                  textarea
                />
                <ImageListEditor
                  label="Hero Images"
                  images={data.hero.images}
                  onUpdate={(imgs) => updateField("hero", "images", imgs)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Rooms Section */}
        {activeSection === "rooms" && (
          <div className="space-y-6">
            {data.rooms.map((room, index) => (
              <div key={index} className="bg-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h4" weight="semibold">
                    Room {index + 1}
                  </Typography>
                  <button
                    onClick={() => removeArrayItem("rooms", index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <EditableField
                    label="Room Name"
                    value={room.name}
                    onChange={(v) => updateArrayItem("rooms", index, "name", v)}
                    editMode={editMode}
                    id={`room-${index}-name`}
                    toggleEdit={toggleEdit}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <EditableField
                      label="Capacity"
                      value={room.capacity.toString()}
                      onChange={(v) =>
                        updateArrayItem(
                          "rooms",
                          index,
                          "capacity",
                          parseInt(v) || 0
                        )
                      }
                      editMode={editMode}
                      id={`room-${index}-capacity`}
                      toggleEdit={toggleEdit}
                      type="number"
                    />
                    <EditableField
                      label="Price (₹)"
                      value={room.price.toString()}
                      onChange={(v) =>
                        updateArrayItem(
                          "rooms",
                          index,
                          "price",
                          parseInt(v) || 0
                        )
                      }
                      editMode={editMode}
                      id={`room-${index}-price`}
                      toggleEdit={toggleEdit}
                      type="number"
                    />
                  </div>

                  <FeatureListEditor
                    label="Features"
                    features={room.features}
                    onUpdate={(features) =>
                      updateArrayItem("rooms", index, "features", features)
                    }
                  />

                  <ImageListEditor
                    label="Hero Images"
                    images={data.hero.images}
                    onUpdate={(imgs) => updateField("hero", "images", imgs)}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                addArrayItem("rooms", {
                  name: "New Room",
                  capacity: 2,
                  price: 3000,
                  image:
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
                  features: ["Feature 1", "Feature 2"],
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add New Room
            </button>
          </div>
        )}

        {/* Dining Section */}
        {activeSection === "dining" && (
          <div className="space-y-6">
            <div className="bg-gray-200 rounded-lg shadow-sm p-6">
              <Typography variant="h3" weight="semibold">
                Dining Section
              </Typography>

              <div className="space-y-4">
                <EditableField
                  label="Title"
                  value={data.dining.title}
                  onChange={(v) => updateField("dining", "title", v)}
                  editMode={editMode}
                  id="dining-title"
                  toggleEdit={toggleEdit}
                />

                <EditableField
                  label="Subtitle"
                  value={data.dining.subtitle}
                  onChange={(v) => updateField("dining", "subtitle", v)}
                  editMode={editMode}
                  id="dining-subtitle"
                  toggleEdit={toggleEdit}
                />

                <ImageListEditor
                  label="Food Images"
                  images={data.dining.images}
                  onUpdate={(imgs) => updateField("dining", "images", imgs)}
                />
              </div>
            </div>

            {data.dining.menuItems.map((menu, index) => (
              <div key={index} className="bg-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h4" weight="semibold">
                    {" "}
                    {menu.category}
                  </Typography>
                  <button
                    onClick={() => {
                      const newMenuItems = data.dining.menuItems.filter(
                        (_, i) => i !== index
                      );
                      setData((prev) => ({
                        ...prev,
                        dining: { ...prev.dining, menuItems: newMenuItems },
                      }));
                      setHasChanges(true);
                    }}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <EditableField
                  label="Category Name"
                  value={menu.category}
                  onChange={(v) => {
                    const newMenuItems = [...data.dining.menuItems];
                    newMenuItems[index] = {
                      ...newMenuItems[index],
                      category: v,
                    };
                    setData((prev) => ({
                      ...prev,
                      dining: { ...prev.dining, menuItems: newMenuItems },
                    }));
                    setHasChanges(true);
                  }}
                  editMode={editMode}
                  id={`menu-${index}-category`}
                  toggleEdit={toggleEdit}
                />

                <FeatureListEditor
                  label="Menu Items"
                  features={menu.items}
                  onUpdate={(items) => {
                    const newMenuItems = [...data.dining.menuItems];
                    newMenuItems[index] = { ...newMenuItems[index], items };
                    setData((prev) => ({
                      ...prev,
                      dining: { ...prev.dining, menuItems: newMenuItems },
                    }));
                    setHasChanges(true);
                  }}
                />
              </div>
            ))}

            <button
              onClick={() => {
                const newMenuItems = [
                  ...data.dining.menuItems,
                  {
                    category: "New Category",
                    items: ["Item 1", "Item 2"],
                  },
                ];
                setData((prev) => ({
                  ...prev,
                  dining: { ...prev.dining, menuItems: newMenuItems },
                }));
                setHasChanges(true);
              }}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Menu Category
            </button>
          </div>
        )}

        {/* Gallery Section */}
        {activeSection === "gallery" && (
          <div className="bg-gray-200 rounded-lg shadow-sm p-6">
            <Typography variant="h3" weight="semibold">
              {" "}
              Gallery Section
            </Typography>

            <div className="space-y-4">
              <EditableField
                label="Subtitle"
                value={data.gallery.subtitle}
                onChange={(v) => updateField("gallery", "subtitle", v)}
                editMode={editMode}
                id="gallery-subtitle"
                toggleEdit={toggleEdit}
              />

              <ImageListEditor
                label="Gallery Images"
                images={data.gallery.images}
                onUpdate={(imgs) => updateField("gallery", "images", imgs)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Editable Field Component
interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  editMode: Record<string, boolean>;
  id: string;
  toggleEdit: (id: string) => void;
  textarea?: boolean;
  type?: string;
}

function EditableField({
  label,
  value,
  onChange,
  editMode,
  id,
  toggleEdit,
  textarea = false,
  type = "text",
}: EditableFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(localValue);
    toggleEdit(id);
  };

  const handleCancel = () => {
    setLocalValue(value);
    toggleEdit(id);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="label" textColor="secondary">
          {" "}
          {label}
        </Typography>
        {!editMode[id] ? (
          <button
            onClick={() => toggleEdit(id)}
            className="text-blue-600 hover:text-blue-700 p-1"
          >
            <Edit2 size={16} />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <Save size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {!editMode[id] ? (
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <Typography variant="paragraph">{value}</Typography>
        </div>
      ) : textarea ? (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

// Feature List Editor
interface FeatureListEditorProps {
  label: string;
  features: string[];
  onUpdate: (features: string[]) => void;
}

function FeatureListEditor({
  label,
  features,
  onUpdate,
}: FeatureListEditorProps) {
  const [items, setItems] = useState(features);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setItems(features);
  }, [features]);

  const addItem = () => {
    const newItems = [...items, "New item"];
    setItems(newItems);
    onUpdate(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    onUpdate(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate(newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="label" textColor="secondary">
          {label}
        </Typography>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-700 p-1"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-white border rounded"
            >
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="col-span-2 w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
}

// Image List Editor
interface ImageListEditorProps {
  label: string;
  images: string[];
  onUpdate: (images: string[]) => void;
}

function ImageListEditor({ label, images, onUpdate }: ImageListEditorProps) {
  const [items, setItems] = useState<string[]>(images);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setItems(images);
  }, [images]);

  const addImage = () => {
    const newItems = [...items, ""];
    setItems(newItems);
    onUpdate(newItems);
  };

  const selectImage = (index: number, file: File | null) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const newItems = [...items];
    newItems[index] = imageUrl;

    setItems(newItems);
    onUpdate(newItems);
  };

  const removeImage = (index: number) => {
    const url = items[index];

    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }

    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onUpdate(newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="label" textColor="secondary">
          {label} ({items.length})
        </Typography>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-700 p-1"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {items.map((img, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    selectImage(index, e.target.files?.[0] || null)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />

                <button
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {img && (
                <div className="relative h-60 w-134 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addImage}
            className="w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Image
          </button>
        </div>
      )}
    </div>
  );
}
