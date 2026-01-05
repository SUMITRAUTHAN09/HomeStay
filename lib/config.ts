/**
 * Environment configuration
 * Centralized access to all environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Aamantran Homestay',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '',
  },

  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '',
    address: process.env.NEXT_PUBLIC_ADDRESS || '',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
    bookingEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL || '',
  },

  // Social Media
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  },

  // Google Maps
  maps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    lat: parseFloat(process.env.NEXT_PUBLIC_LOCATION_LAT || '0'),
    lng: parseFloat(process.env.NEXT_PUBLIC_LOCATION_LNG || '0'),
    embedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || '',
  },

  // Booking Configuration
  booking: {
    minDays: parseInt(process.env.NEXT_PUBLIC_MIN_BOOKING_DAYS || '1'),
    maxDays: parseInt(process.env.NEXT_PUBLIC_MAX_BOOKING_DAYS || '30'),
    maxGuests: parseInt(process.env.NEXT_PUBLIC_MAX_GUESTS || '10'),
    advanceDays: parseInt(process.env.NEXT_PUBLIC_BOOKING_ADVANCE_DAYS || '180'),
    cancellationHours: parseInt(process.env.NEXT_PUBLIC_CANCELLATION_HOURS || '24'),
  },

  // Payment Configuration
  payment: {
    currency: process.env.NEXT_PUBLIC_CURRENCY || 'INR',
    currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹',
    taxPercentage: parseFloat(process.env.NEXT_PUBLIC_TAX_PERCENTAGE || '12'),
    enableOnlinePayment: process.env.NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT === 'true',
    razorpay: {
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    },
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'),
    allowedTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || '').split(','),
  },

  // Feature Flags
  features: {
    gallery: process.env.NEXT_PUBLIC_ENABLE_GALLERY === 'true',
    blog: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
    reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
    newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
    chatSupport: process.env.NEXT_PUBLIC_ENABLE_CHAT_SUPPORT === 'true',
    pushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },

  // SEO
  seo: {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || '',
    title: process.env.NEXT_PUBLIC_SITE_TITLE || '',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
    keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS || '',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
  },

  // Third-party Services
  services: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '',
    cloudinary: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    },
  },

  // Development
  dev: {
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
    enableLogger: process.env.NEXT_PUBLIC_ENABLE_LOGGER === 'true',
    logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
  },

  // Maintenance
  maintenance: {
    mode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
    message: process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE || '',
  },
} as const;

// Helper function to check if we're in production
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to validate required env vars
export const validateEnv = () => {
  const required = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_APP_NAME',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

export default config;