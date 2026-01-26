// utils/calendar-utils.ts
import { AvailabilityDay } from '@/types/calendar';
import { config } from './config';

export const getApiUrl = (): string => {
  // Use the centralized config which reads NEXT_PUBLIC_API_URL
  return config.api.url || 'http://localhost:3001';
};

export const isRangeAvailable = (
  startDate: string, 
  endDate: string, 
  availability: AvailabilityDay[]
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const availabilityMap = new Map(
    availability.map(day => [day.date, day.available])
  );
  
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split('T')[0];
    if (!availabilityMap.get(dateString)) {
      return false;
    }
  }
  
  return true;
};

export const generateDummyAvailability = (currentMonth: number): AvailabilityDay[] => {
  console.log('⚠️ Generating dummy availability data');
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + currentMonth);
  startDate.setDate(1);
  
  const daysInMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  ).getDate();
  
  const dummyData: AvailabilityDay[] = [];
  for (let i = 0; i < daysInMonth; i++) {
    const date = new Date(startDate);
    date.setDate(i + 1);
    dummyData.push({
      date: date.toISOString().split('T')[0],
      available: Math.random() > 0.3
    });
  }
  return dummyData;
};

export const groupByWeeks = (days: AvailabilityDay[]): AvailabilityDay[][] => {
  const weeks: AvailabilityDay[][] = [];
  let currentWeek: AvailabilityDay[] = [];
  
  days.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (index === 0 && dayOfWeek !== 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', available: false });
      }
    }
    
    currentWeek.push(day);
    
    if (dayOfWeek === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  return weeks;
};

export const getMonthName = (currentMonth: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + currentMonth);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const isDateInRange = (
  date: string, 
  checkIn: string | null, 
  checkOut: string | null
): boolean => {
  if (!checkIn || !checkOut) return false;
  const current = new Date(date);
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return current >= start && current <= end;
};

export const isDateSelected = (
  date: string, 
  checkIn: string | null, 
  checkOut: string | null
): boolean => {
  return date === checkIn || date === checkOut;
};

export const isPastDate = (date: string): boolean => {
  return new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
};

export const isTodayDate = (date: string): boolean => {
  return date === new Date().toISOString().split('T')[0];
};