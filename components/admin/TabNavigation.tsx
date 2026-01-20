import { TabType } from '@/app/types/admin';
import { Calendar, Home, Image, Utensils } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'rooms' as TabType, label: 'Rooms', icon: Home },
    { id: 'bookings' as TabType, label: 'Bookings', icon: Calendar },
    { id: 'photos' as TabType, label: 'Photos', icon: Image },
    { id: 'menu' as TabType, label: 'Menu', icon: Utensils },
  ];

  return (
    <div className=" bg-white border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <nav className="flex gap-2 sm:gap-8 overflow-x-auto sm:overflow-visible ehitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={18} />

              <span className="hidden xs:inline sm:inline">
              {tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}