// src/lib/calendar-api.ts
import { AvailabilityDay } from '@/types/calendar';
import { getApiUrl } from './calendar-utils';

export const fetchRoomAvailability = async (
  roomId: string, 
  currentMonth: number
): Promise<AvailabilityDay[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + currentMonth);
  startDate.setDate(1);
  
  const API_URL = getApiUrl();
  
  // ✅ ADD CACHE BUSTING: Add timestamp to prevent caching
  const timestamp = new Date().getTime();
  const apiUrl = `${API_URL}/api/rooms/${roomId}/availability-calendar?startDate=${startDate.toISOString()}&_t=${timestamp}`;
  
  console.log('🔍 Fetching availability for room:', roomId);
  console.log('📅 Start date:', startDate.toISOString());
  console.log('🌐 Full API URL:', apiUrl);
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache', // ✅ ADD NO-CACHE HEADER
      'Pragma': 'no-cache', // ✅ ADD PRAGMA HEADER
    },
    cache: 'no-store', // ✅ ADD CACHE NO-STORE
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('❌ Server response not OK:', response.status);
    console.error('❌ Response text:', text);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  console.log('📥 Raw availability data received:', data);
  console.log('📥 Number of days:', data.availability?.length);
  
  if (data.success) {
    const availability = data.availability || [];
    
    // Log specific dates we care about
    const jan18 = availability.find((d: any) => d.date === '2026-01-18');
    const jan19 = availability.find((d: any) => d.date === '2026-01-19');
    const jan20 = availability.find((d: any) => d.date === '2026-01-20');
    
    console.log('📅 Jan 18:', jan18);
    console.log('📅 Jan 19:', jan19);
    console.log('📅 Jan 20:', jan20);
    
    // Count available vs booked
    const availableCount = availability.filter((d: any) => d.available).length;
    const bookedCount = availability.filter((d: any) => !d.available).length;
    console.log(`✅ Available days: ${availableCount}, ❌ Booked days: ${bookedCount}`);
    
    return availability;
  } else {
    console.error('❌ API returned success=false:', data.message);
    throw new Error(data.message || 'Failed to fetch availability');
  }
};