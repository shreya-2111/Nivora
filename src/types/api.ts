// ==============================================================================
// NIVORA - BACKEND API DATA CONTRACTS & RESPONSE INTERFACES
// Matches the Next.js + PostgreSQL backend schemas in backend/
// ==============================================================================

// --- Standard API Error Structure ---
export interface ApiErrorPayload {
  message: string;
  code?: string;
  unavailable?: { menu_item_id: string; name: string | null }[];
  order_id?: string;
  request_id?: string;
  allowed?: string[];
  [key: string]: any;
}

// --- Staff User & Authentication ---
export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthSessionResponse {
  user: StaffUser;
  token: string;
  refresh_token: string;
  expires_at: number;
}

// --- Hotel Configuration ---
export interface HotelModules {
  food_ordering: boolean;
  room_service: boolean;
  contact_reception: boolean;
  hotel_information: boolean;
}

export interface HotelSettings {
  id: string;
  hotel_name: string;
  logo_url: string | null;
  cover_image_url: string | null;
  welcome_message: string | null;
  primary_color: string;
  secondary_color: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  modules: HotelModules;
  created_at?: string;
  updated_at?: string;
}

// --- Rooms ---
export interface RoomRecord {
  id: string;
  room_number: string;
  floor: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
  updated_at?: string;
}

// --- QR Codes ---
export interface QrCodeRecord {
  id: string;
  room_id: string;
  room_number: string;
  token: string;
  url: string;
  is_active: boolean;
  qr_image?: string;
  created_at: string;
  updated_at: string;
}

// --- Guest Session & Resolve ---
export interface GuestSessionData {
  token: string;
  room: {
    id: string;
    room_number: string;
    floor: number | null;
  };
  issuedAt: number;
}

export interface GuestResolveResponse {
  session: { token: string };
  room: { id: string; room_number: string; floor: number | null };
  hotel: HotelSettings;
  modules: HotelModules;
  menu: MenuCategoryWithItems[];
  service_categories: ServiceCategoryRecord[];
}

// --- Menu & Food Items ---
export interface MenuItemOptionRecord {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BackendMenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_vegetarian: boolean;
  is_available: boolean;
  sort_order: number;
  options: MenuItemOptionRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategoryWithItems {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  items: BackendMenuItem[];
  created_at?: string;
  updated_at?: string;
}

// --- Food Orders ---
export type BackendOrderStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export interface OrderItemOptionSnapshot {
  id: string;
  option_name_snapshot: string;
  option_price: number;
}

export interface OrderItemSnapshot {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name_snapshot: string;
  unit_price: number;
  quantity: number;
  special_instructions: string | null;
  options?: OrderItemOptionSnapshot[];
}

export interface BackendOrder {
  id: string;
  order_number: string;
  room_id: string;
  room_number: string;
  floor: number | null;
  status: BackendOrderStatus;
  subtotal: number;
  total: number;
  special_instructions: string | null;
  idempotency_key?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItemSnapshot[];
}

export interface CreateOrderPayload {
  items: {
    menu_item_id: string;
    quantity: number;
    option_ids?: string[];
    special_instructions?: string;
  }[];
  special_instructions?: string;
  room_id?: string;
}

// --- Room Service Requests ---
export type BackendRequestStatus =
  | 'NEW'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface ServiceCategoryRecord {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BackendServiceRequest {
  id: string;
  request_number: string;
  room_id: string;
  room_number: string;
  floor: number | null;
  service_category_id: string;
  service_category_name: string;
  custom_request: string | null;
  status: BackendRequestStatus;
  idempotency_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequestPayload {
  service_category_id: string;
  custom_request?: string;
  room_id?: string;
}

// --- Pagination & Dashboard ---
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardStatsResponse {
  stats: {
    food_orders: number;
    pending_orders: number;
    room_requests: number;
    pending_requests: number;
    order_value_today: number;
  };
  recent_orders: BackendOrder[];
  recent_requests: BackendServiceRequest[];
}
