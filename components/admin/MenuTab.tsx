"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Coffee, Utensils, Moon } from 'lucide-react';
import { api } from '@/lib/api-clients';

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

interface MenuTabProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const CATEGORY_ICONS = {
  Breakfast: Coffee,
  Lunch: Utensils,
  Dinner: Moon,
};

export default function MenuTab({ onSuccess, onError }: MenuTabProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      console.log('📥 Loading menu...');
      const response = await api.menu.get() as MenuResponse;
      console.log('📥 Menu response:', response);
      
      if (response.success && response.data) {
        // Extract categories from the nested data structure
        let menuCategories: MenuCategory[] = [];
        
        // Handle different response structures
        if (!Array.isArray(response.data)) {
          if (response.data.data?.categories) {
            // Nested structure: { data: { data: { categories: [...] } } }
            menuCategories = response.data.data.categories;
          } else if (response.data.categories) {
            // Direct structure: { data: { categories: [...] } }
            menuCategories = response.data.categories;
          }
        } else {
          // Array structure: { data: [...] }
          menuCategories = response.data;
        }
        
        console.log('📋 Extracted categories:', menuCategories);
        
        // Filter to show only Breakfast, Lunch, Dinner and sort by order
        const filteredCategories = menuCategories
          .filter((cat: MenuCategory) => 
            ['Breakfast', 'Lunch', 'Dinner'].includes(cat.category)
          )
          .sort((a: MenuCategory, b: MenuCategory) => a.order - b.order);
        
        console.log('✅ Filtered categories:', filteredCategories);
        setCategories(filteredCategories);
      } else {
        console.error('❌ Invalid response structure:', response);
        onError('Failed to load menu - invalid response');
      }
    } catch (error: any) {
      console.error('❌ Error loading menu:', error);
      onError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    setLoading(true);
    try {
      console.log('💾 Saving menu categories:', categories);
      const response = await api.menu.update(categories) as MenuResponse;
      console.log('💾 Save response:', response);
      
      if (response.success) {
        onSuccess('Menu updated successfully!');
        await loadMenu(); // Reload to get fresh data
      } else {
        onError(response.error || 'Failed to update menu');
      }
    } catch (error: any) {
      console.error('❌ Error saving menu:', error);
      onError('Failed to save menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (categoryIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].items.push({ name: '', description: '' });
    setCategories(updated);
    console.log('➕ Added item to category:', updated[categoryIndex].category);
  };

  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    if (!confirm('Remove this item?')) return;
    
    const updated = [...categories];
    updated[categoryIndex].items.splice(itemIndex, 1);
    setCategories(updated);
    console.log('🗑️ Removed item from category:', updated[categoryIndex].category);
  };

  const handleUpdateItem = (
    categoryIndex: number, 
    itemIndex: number, 
    field: 'name' | 'description',
    value: string
  ) => {
    const updated = [...categories];
    updated[categoryIndex].items[itemIndex][field] = value;
    setCategories(updated);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading menu...</p>
      </div>
    );
  }

  // If no categories loaded, show error state
  if (!loading && categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">No Menu Categories Found</h3>
          <p className="text-sm text-red-600 mb-4">
            The menu couldn't be loaded. Please check the console for errors.
          </p>
          <button
            onClick={loadMenu}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your Breakfast, Lunch, and Dinner offerings
          </p>
        </div>
        <button
          onClick={handleSaveMenu}
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 shadow-md"
        >
          <Save size={20} /> Save All Changes
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Add items with descriptions to make your menu more appealing. 
          Changes appear on your main website immediately after saving.
        </p>
      </div>

      {/* Categories Grid - Fixed 3 categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categories.map((category, catIndex) => {
          const IconComponent = CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS] || Utensils;
          
          return (
            <div
              key={category._id || catIndex}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-300 transition"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconComponent className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {category.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Utensils size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items yet</p>
                    <p className="text-xs mt-1">Click "Add Item" below to get started</p>
                  </div>
                ) : (
                  category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(catIndex, itemIndex, 'name', e.target.value)}
                          placeholder="Item name (e.g., Masala Chai)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleRemoveItem(catIndex, itemIndex)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateItem(catIndex, itemIndex, 'description', e.target.value)}
                        placeholder="Optional description (e.g., Traditional Indian spiced tea)"
                        className="w-full ml-5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Add Item Button */}
              <button
                onClick={() => handleAddItem(catIndex)}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={18} /> Add Item to {category.category}
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">Menu Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{cat.items.length}</div>
              <div className="text-sm text-gray-600">{cat.category} Items</div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">📋 Quick Guide</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• <strong>Add items:</strong> Click "Add Item" button for each meal category</li>
          <li>• <strong>Descriptions:</strong> Optional but recommended for better presentation</li>
          <li>• <strong>Save changes:</strong> Click "Save All Changes" to update your website</li>
          <li>• <strong>Remove items:</strong> Click the trash icon next to any item</li>
        </ul>
      </div>
    </div>
  );
}