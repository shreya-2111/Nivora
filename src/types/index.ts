export interface GuestProfile {
  name: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  image?: string;
  options?: Array<{ name: string; price: number }>;
}

export interface ActiveOrder {
  id: string;
  backendStatus?: string;
  orderNumber: string;
  roomNumber: string;
  guestName: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  placedAt: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryNotes?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  href: string;
  badge?: string;
  featured?: boolean;
}

export interface FeaturedDish {
  id: string;
  name: string;
  description: string;
  price: number;
  calories?: string;
  prepTime: string;
  category: string;
  tag?: string;
  isVegetarian?: boolean;
  image: string;
}

export type MenuCategory =
  | 'All'
  | 'Starters'
  | 'Mains'
  | 'Desserts'
  | 'Signature Cocktails'
  | 'Wines & Spirits';

export interface MenuItemOption {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories?: string;
  prepTime: string;
  category: string;
  tag?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isChefChoice?: boolean;
  isAvailable?: boolean;
  options?: MenuItemOption[];
  image: string;
}

export type RequestUrgency = 'Immediate (10-15 mins)' | 'Within 30 mins' | 'Later Today';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface RoomServiceRequest {
  id: string;
  backendStatus?: string;
  ticketNumber: string;
  roomNumber: string;
  guestName: string;
  serviceCategory: string;
  requestItem: string;
  urgency: RequestUrgency;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
}
