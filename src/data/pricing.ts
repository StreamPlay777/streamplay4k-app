export interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  pricePerMonth: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  connections: number;
  devices: number;
}

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: '1 Month',
    duration: '1 Month',
    price: 14.99,
    pricePerMonth: 14.99,
    connections: 1,
    devices: 2,
    features: [
      '10,000+ Live Channels',
      '4K Ultra HD Streaming',
      '60,000+ Movies & TV Shows',
      '24/7 Customer Support',
      'Works on All Devices',
      'EPG TV Guide',
      'VOD Library Access',
      'Anti-Freeze Technology',
    ],
  },
  {
    id: '3months',
    name: '3 Months',
    duration: '3 Months',
    price: 34.99,
    originalPrice: 44.97,
    pricePerMonth: 11.66,
    connections: 2,
    devices: 4,
    features: [
      '10,000+ Live Channels',
      '4K Ultra HD Streaming',
      '60,000+ Movies & TV Shows',
      '24/7 Customer Support',
      'Works on All Devices',
      'EPG TV Guide',
      'VOD Library Access',
      'Anti-Freeze Technology',
      '2 Simultaneous Connections',
    ],
  },
  {
    id: '6months',
    name: '6 Months',
    duration: '6 Months',
    price: 54.99,
    originalPrice: 89.94,
    pricePerMonth: 9.16,
    popular: true,
    badge: 'BEST VALUE',
    connections: 2,
    devices: 5,
    features: [
      '10,000+ Live Channels',
      '4K Ultra HD Streaming',
      '60,000+ Movies & TV Shows',
      '24/7 Priority Support',
      'Works on All Devices',
      'EPG TV Guide',
      'VOD Library Access',
      'Anti-Freeze Technology',
      '2 Simultaneous Connections',
      'Premium Sports Channels',
    ],
  },
  {
    id: '12months',
    name: '12 Months',
    duration: '12 Months',
    price: 89.99,
    originalPrice: 179.88,
    pricePerMonth: 7.49,
    badge: 'SAVE 50%',
    connections: 3,
    devices: 6,
    features: [
      '10,000+ Live Channels',
      '4K Ultra HD Streaming',
      '60,000+ Movies & TV Shows',
      '24/7 VIP Support',
      'Works on All Devices',
      'EPG TV Guide',
      'VOD Library Access',
      'Anti-Freeze Technology',
      '3 Simultaneous Connections',
      'Premium Sports Channels',
      'PPV Events Included',
      'Free Device Setup Help',
    ],
  },
];
