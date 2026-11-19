'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GuestProfile,
  ActiveOrder,
  OrderStatus,
  MenuItem,
  MenuItemOption,
  RoomServiceRequest,
  RequestStatus,
} from '@/types';
import {
  ApiError,
  apiRequest,
  clearIdempotencyKey,
  clearStaffRefreshToken,
  getGuestSessionToken,
  getIdempotencyKey,
  setStaffRefreshToken,
} from '@/lib/api';

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  instructions?: string;
  optionIds?: string[];
}

export interface ServiceCategoryData {
  id: string;
  name: string;
  description?: string;
}

interface ApiMenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  image_url?: string | null;
  is_vegetarian?: boolean;
  is_available?: boolean;
  options?: Array<{
    id: string;
    name: string;
    price: number | string;
    is_active?: boolean;
  }>;
}

interface ApiMenuCategory {
  id: string;
  name: string;
  items: ApiMenuItem[];
}

interface ApiRoom {
  id: string;
  room_number: string;
  floor?: number | null;
}

interface ApiOrderItem {
  id: string;
  menu_item_id?: string | null;
  name: string;
  unit_price: number | string;
  quantity: number;
  special_instructions?: string | null;
  options?: Array<{ name: string; price: number | string }>;
}

interface ApiOrder {
  id: string;
  order_number: string;
  room: ApiRoom;
  status: string;
  total: number | string;
  special_instructions?: string | null;
  created_at: string;
  items: ApiOrderItem[];
}

interface ApiServiceRequest {
  id: string;
  request_number: string;
  room: ApiRoom;
  service_category: { id: string; name: string };
  custom_request?: string | null;
  status: string;
  created_at: string;
}

interface ApiServiceCategory {
  id: string;
  name: string;
  description?: string | null;
}

const emptyGuest: GuestProfile = {
  name: 'Guest',
  roomNumber: '',
  roomType: '',
  checkInDate: '',
  checkOutDate: '',
};

function mapMenu(categories: ApiMenuCategory[]): MenuItem[] {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      prepTime: '',
      category: category.name,
      isVegetarian: item.is_vegetarian,
      isAvailable: item.is_available,
      options: item.options?.map((option): MenuItemOption => ({
        id: option.id,
        name: option.name,
        price: Number(option.price),
        isActive: option.is_active !== false,
      })),
      image: item.image_url || '/overwater-dish.jpg',
    }))
  );
}

function mapOrderStatus(status: string): OrderStatus {
  switch (status) {
    case 'NEW':
      return 'placed';
    case 'ACCEPTED':
    case 'PREPARING':
      return 'preparing';
    case 'READY':
      return 'on_the_way';
    case 'DELIVERED':
      return 'delivered';
    case 'REJECTED':
    case 'CANCELLED':
      return 'cancelled';
    default:
      throw new Error(`Unsupported order status: ${status}`);
  }
}

function mapOrder(order: ApiOrder): ActiveOrder {
  const createdAt = new Date(order.created_at);
  return {
    id: order.id,
    backendStatus: order.status,
    orderNumber: order.order_number.startsWith('#')
      ? order.order_number
      : `#NV-${order.order_number}`,
    roomNumber: order.room.room_number,
    guestName: 'Guest',
    status: mapOrderStatus(order.status),
    estimatedDeliveryMinutes:
      order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'REJECTED'
        ? 0
        : order.status === 'READY'
          ? 5
          : 20,
    placedAt: Number.isNaN(createdAt.valueOf())
      ? order.created_at
      : createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    totalAmount: Number(order.total),
    items: order.items.map((item) => ({
      id: item.menu_item_id || item.id,
      name: item.name,
      price: Number(item.unit_price),
      quantity: item.quantity,
      specialInstructions: item.special_instructions || undefined,
      options: item.options?.map((option) => ({
        name: option.name,
        price: Number(option.price),
      })),
    })),
    deliveryNotes: order.special_instructions || undefined,
  };
}

function mapRequestStatus(status: string): RequestStatus {
  switch (status) {
    case 'NEW':
      return 'pending';
    case 'ACCEPTED':
      return 'accepted';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'COMPLETED':
      return 'completed';
    case 'REJECTED':
      return 'rejected';
    case 'CANCELLED':
      return 'cancelled';
    default:
      throw new Error(`Unsupported request status: ${status}`);
  }
}

function mapRequest(request: ApiServiceRequest): RoomServiceRequest {
  const createdAt = new Date(request.created_at);
  return {
    id: request.id,
    backendStatus: request.status,
    ticketNumber: request.request_number,
    roomNumber: request.room.room_number,
    guestName: 'Guest',
    serviceCategory: request.service_category.name,
    requestItem: request.custom_request || request.service_category.name,
    urgency: 'Immediate (10-15 mins)',
    status: mapRequestStatus(request.status),
    createdAt: Number.isNaN(createdAt.valueOf())
      ? request.created_at
      : createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

interface NivoraContextType {
  guest: GuestProfile;
  orders: ActiveOrder[];
  activeOrder: ActiveOrder | null;
  roomRequests: RoomServiceRequest[];
  menuItems: MenuItem[];
  serviceCategories: ServiceCategoryData[];
  cartItems: CartItemEntry[];
  totalCartCount: number;
  cartSubtotal: number;
  initializeGuest: (qrToken: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStaffData: () => Promise<void>;
  refreshOrder: (orderId: string) => Promise<void>;
  refreshRequest: (requestId: string) => Promise<void>;
  addToCart: (item: MenuItem, quantity?: number, instructions?: string, optionIds?: string[]) => void;
  removeFromCart: (item: MenuItem) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryNotes?: string) => Promise<ActiveOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  advanceActiveOrderStatus: () => Promise<void>;
  addRoomRequest: (
    request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>
  ) => Promise<RoomServiceRequest>;
  updateRoomRequestStatus: (requestId: string, status: RequestStatus) => Promise<void>;
  toggleMenuItemAvailability: (itemId: string) => Promise<void>;
}

const NivoraContext = createContext<NivoraContextType | null>(null);

export function NivoraProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<GuestProfile>(emptyGuest);
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [roomRequests, setRoomRequests] = useState<RoomServiceRequest[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryData[]>([]);
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([]);

  const activeOrder = useMemo(
    () =>
      orders.find(
        (order) =>
          order.roomNumber === guest.roomNumber &&
          order.status !== 'delivered' &&
          order.status !== 'cancelled'
      ) || orders.find((order) => order.roomNumber === guest.roomNumber) || null,
    [orders, guest.roomNumber]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((total, entry) => total + entry.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((total, entry) => {
      const optionsTotal = entry.item.options
        ?.filter((option) => entry.optionIds?.includes(option.id))
        .reduce((sum, option) => sum + option.price, 0) || 0;
      return total + (entry.item.price + optionsTotal) * entry.quantity;
    }, 0),
    [cartItems]
  );

  const loadStaffData = React.useCallback(async () => {
    const [menu, orderList, requestList, categoryList] = await Promise.all([
      apiRequest<{ categories: ApiMenuCategory[] }>('/menu', {}, null),
      apiRequest<{ orders: ApiOrder[] }>('/orders?limit=100', {}, null),
      apiRequest<{ requests: ApiServiceRequest[] }>('/requests?limit=100', {}, null),
      apiRequest<{ service_categories: ApiServiceCategory[] }>('/service-categories', {}, null),
    ]);
    setMenuItems(mapMenu(menu.categories));
    setOrders(orderList.orders.map(mapOrder));
    setRoomRequests(requestList.requests.map(mapRequest));
    setServiceCategories(categoryList.service_categories.map(({ id, name, description }) => ({
      id,
      name,
      description: description || undefined,
    })));
  }, []);

  const initializeGuest = React.useCallback(async (qrToken: string) => {
    const result = await apiRequest<{
      session: { token: string };
      room: ApiRoom;
      menu: ApiMenuCategory[];
      service_categories: ApiServiceCategory[];
    }>(`/guest/${encodeURIComponent(qrToken)}`, {}, null);

    window.sessionStorage.setItem('nivora.guest-session', result.session.token);
    window.sessionStorage.setItem('nivora.guest-room', result.room.room_number);
    setGuest({ ...emptyGuest, roomNumber: result.room.room_number });
    setMenuItems(mapMenu(result.menu));
    setServiceCategories(result.service_categories.map(({ id, name, description }) => ({
      id,
      name,
      description: description || undefined,
    })));
    setOrders([]);
    setRoomRequests([]);
    setCartItems([]);
    window.sessionStorage.removeItem('nivora.guest-order-id');
    window.sessionStorage.removeItem('nivora.guest-request-id');
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{ refresh_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, null);
    setStaffRefreshToken(result.refresh_token);
    await loadStaffData();
  }, [loadStaffData]);

  const logout = React.useCallback(async () => {
    await apiRequest('/auth/logout', { method: 'POST' }, null);
    clearStaffRefreshToken();
    setOrders([]);
    setRoomRequests([]);
    setMenuItems([]);
    setServiceCategories([]);
  }, []);

  const refreshOrder = React.useCallback(async (orderId: string) => {
    const result = await apiRequest<{ order: ApiOrder }>(
      `/orders/${encodeURIComponent(orderId)}`
    );
    const refreshed = mapOrder(result.order);
    setOrders((previous) => [
      refreshed,
      ...previous.filter((order) => order.id !== refreshed.id),
    ]);
  }, []);

  const refreshRequest = React.useCallback(async (requestId: string) => {
    const result = await apiRequest<{ request: ApiServiceRequest }>(
      `/requests/${encodeURIComponent(requestId)}`
    );
    const refreshed = mapRequest(result.request);
    setRoomRequests((previous) => [
      refreshed,
      ...previous.filter((request) => request.id !== refreshed.id),
    ]);
  }, []);

  useEffect(() => {
    void apiRequest<{ user: { id: string } }>('/auth/me', {}, null)
      .then(() => loadStaffData())
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) return;
        console.error('Unable to restore the staff session from the backend.', error);
      });

    const guestSession = getGuestSessionToken();
    const roomNumber = window.sessionStorage.getItem('nivora.guest-room');
    if (!guestSession || !roomNumber) return;

    setGuest({ ...emptyGuest, roomNumber });
    const orderId = window.sessionStorage.getItem('nivora.guest-order-id');
    const requestId = window.sessionStorage.getItem('nivora.guest-request-id');
    const orderRequest = orderId
      ? apiRequest<{ order: ApiOrder }>(`/orders/${encodeURIComponent(orderId)}`, {}, guestSession)
      : Promise.resolve(null);
    const serviceRequest = requestId
      ? apiRequest<{ request: ApiServiceRequest }>(`/requests/${encodeURIComponent(requestId)}`, {}, guestSession)
      : Promise.resolve(null);

    void Promise.all([
      apiRequest<{ categories: ApiMenuCategory[] }>('/menu', {}, guestSession),
      apiRequest<{ service_categories: ApiServiceCategory[] }>('/service-categories', {}, guestSession),
      orderRequest,
      serviceRequest,
    ]).then(([menu, categories, savedOrder, savedRequest]) => {
      setMenuItems(mapMenu(menu.categories));
      setServiceCategories(categories.service_categories.map(({ id, name, description }) => ({
        id,
        name,
        description: description || undefined,
      })));
      if (savedOrder) setOrders([mapOrder(savedOrder.order)]);
      if (savedRequest) setRoomRequests([mapRequest(savedRequest.request)]);
    }).catch((error: unknown) => {
      console.error('Unable to restore the guest session from the backend.', error);
    });
  }, [loadStaffData]);

  const addToCart = React.useCallback((
    item: MenuItem,
    quantity = 1,
    instructions?: string,
    optionIds: string[] = []
  ) => {
    setCartItems((previous) => {
      const index = previous.findIndex((entry) => entry.item.id === item.id);
      if (index >= 0) {
        return previous.map((entry, entryIndex) =>
          entryIndex === index
            ? {
                ...entry,
                quantity: entry.quantity + quantity,
                instructions: instructions || entry.instructions,
                optionIds: [...new Set([...(entry.optionIds || []), ...optionIds])],
              }
            : entry
        );
      }
      return [...previous, { item, quantity, instructions, optionIds }];
    });
  }, []);

  const removeFromCart = React.useCallback((item: MenuItem) => {
    setCartItems((previous) => {
      const existing = previous.find((entry) => entry.item.id === item.id);
      if (!existing) return previous;
      if (existing.quantity <= 1) return previous.filter((entry) => entry.item.id !== item.id);
      return previous.map((entry) =>
        entry.item.id === item.id ? { ...entry, quantity: entry.quantity - 1 } : entry
      );
    });
  }, []);

  const updateCartQuantity = React.useCallback((itemId: string, newQty: number) => {
    setCartItems((previous) =>
      newQty <= 0
        ? previous.filter((entry) => entry.item.id !== itemId)
        : previous.map((entry) =>
            entry.item.id === itemId ? { ...entry, quantity: newQty } : entry
          )
    );
  }, []);

  const clearCart = React.useCallback(() => setCartItems([]), []);

  const placeOrder = React.useCallback(async (deliveryNotes?: string) => {
    if (!getGuestSessionToken()) {
      throw new Error('Scan your room QR code before placing an order.');
    }
    if (!cartItems.length) throw new Error('Your cart is empty.');

    const result = await apiRequest<{ order: ApiOrder }>('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': getIdempotencyKey('order') },
      body: JSON.stringify({
        items: cartItems.map(({ item, quantity, instructions, optionIds }) => ({
          menu_item_id: item.id,
          quantity,
          option_ids: optionIds || [],
          special_instructions: instructions,
        })),
        special_instructions: deliveryNotes,
      }),
    });
    const order = mapOrder(result.order);
    setOrders((previous) => [order, ...previous.filter((existing) => existing.id !== order.id)]);
    window.sessionStorage.setItem('nivora.guest-order-id', order.id);
    clearIdempotencyKey('order');
    setCartItems([]);
    return order;
  }, [cartItems]);

  const updateOrderStatus = React.useCallback(async (orderId: string, status: OrderStatus) => {
    const current = orders.find((order) => order.id === orderId);
    if (!current) throw new Error('Order is no longer available. Refresh the page and try again.');

    const progression = ['NEW', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED'];
    const targets: Record<OrderStatus, string> = {
      placed: 'ACCEPTED',
      preparing: 'PREPARING',
      on_the_way: 'READY',
      delivered: 'DELIVERED',
      cancelled: 'CANCELLED',
    };
    const target = targets[status];
    const currentIndex = progression.indexOf(current.backendStatus || 'NEW');
    const targetIndex = progression.indexOf(target);
    const statuses = target === 'CANCELLED'
      ? [target]
      : currentIndex >= 0 && targetIndex > currentIndex
        ? progression.slice(currentIndex + 1, targetIndex + 1)
        : [target];

    for (const nextStatus of statuses) {
      const result = await apiRequest<{ order: ApiOrder }>(
        `/orders/${encodeURIComponent(orderId)}/status`,
        { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) },
        null
      );
      const updated = mapOrder(result.order);
      setOrders((previous) => previous.map((order) => order.id === orderId ? updated : order));
    }
  }, [orders]);

  const advanceActiveOrderStatus = React.useCallback(async () => {
    if (!activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') return;
    const nextStatus: Record<OrderStatus, OrderStatus> = {
      placed: 'preparing',
      preparing: 'on_the_way',
      on_the_way: 'delivered',
      delivered: 'placed',
      cancelled: 'placed',
    };
    await updateOrderStatus(activeOrder.id, nextStatus[activeOrder.status]);
  }, [activeOrder, updateOrderStatus]);

  const addRoomRequest = React.useCallback(async (
    request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>
  ) => {
    if (!getGuestSessionToken()) {
      throw new Error('Scan your room QR code before submitting a request.');
    }
    const requestedCategory = request.serviceCategory.trim().toLowerCase();
    const matchedCategory = serviceCategories.find(
      (item) => item.name.trim().toLowerCase() === requestedCategory
    ) || serviceCategories.find((item) => {
      const name = item.name.trim().toLowerCase();
      return requestedCategory.includes(name) || name.includes(requestedCategory);
    });
    const category = matchedCategory || serviceCategories.find(
      (item) => item.name.trim().toLowerCase().startsWith('other')
    );
    if (!category) {
      throw new Error(`The "${request.serviceCategory}" service is not configured by the hotel.`);
    }

    const customRequest = [
      matchedCategory ? request.requestItem : `${request.serviceCategory}: ${request.requestItem}`,
      `Timing: ${request.urgency}`,
      request.notes?.trim(),
    ].filter(Boolean).join(' | ');
    const result = await apiRequest<{ request: ApiServiceRequest }>('/requests', {
      method: 'POST',
      headers: { 'Idempotency-Key': getIdempotencyKey('request') },
      body: JSON.stringify({
        service_category_id: category.id,
        custom_request: customRequest,
      }),
    });
    const created = mapRequest(result.request);
    setRoomRequests((previous) => [created, ...previous.filter((item) => item.id !== created.id)]);
    window.sessionStorage.setItem('nivora.guest-request-id', created.id);
    clearIdempotencyKey('request');
    return created;
  }, [serviceCategories]);

  const updateRoomRequestStatus = React.useCallback(async (
    requestId: string,
    status: RequestStatus
  ) => {
    const current = roomRequests.find((request) => request.id === requestId);
    if (!current) throw new Error('Request is no longer available. Refresh the page and try again.');

    const progression = ['NEW', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
    const targets: Record<RequestStatus, string> = {
      pending: 'NEW',
      accepted: 'ACCEPTED',
      in_progress: 'IN_PROGRESS',
      completed: 'COMPLETED',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED',
    };
    const target = targets[status];
    const currentIndex = progression.indexOf(current.backendStatus || 'NEW');
    const targetIndex = progression.indexOf(target);
    const statuses = targetIndex >= 0 && currentIndex >= 0 && targetIndex > currentIndex
      ? progression.slice(currentIndex + 1, targetIndex + 1)
      : [target];

    for (const nextStatus of statuses) {
      const result = await apiRequest<{ request: ApiServiceRequest }>(
        `/requests/${encodeURIComponent(requestId)}/status`,
        { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) },
        null
      );
      const updated = mapRequest(result.request);
      setRoomRequests((previous) =>
        previous.map((request) => request.id === requestId ? updated : request)
      );
    }
  }, [roomRequests]);

  const toggleMenuItemAvailability = React.useCallback(async (itemId: string) => {
    const item = menuItems.find((menuItem) => menuItem.id === itemId);
    if (!item) throw new Error('Menu item is no longer available. Refresh the page and try again.');
    await apiRequest(`/menu/items/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_available: !item.isAvailable }),
    }, null);
    setMenuItems((previous) =>
      previous.map((menuItem) =>
        menuItem.id === itemId ? { ...menuItem, isAvailable: !item.isAvailable } : menuItem
      )
    );
  }, [menuItems]);

  const value = useMemo(
    () => ({
      guest,
      orders,
      activeOrder,
      roomRequests,
      menuItems,
      serviceCategories,
      cartItems,
      totalCartCount,
      cartSubtotal,
      initializeGuest,
      login,
      logout,
      loadStaffData,
      refreshOrder,
      refreshRequest,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      advanceActiveOrderStatus,
      addRoomRequest,
      updateRoomRequestStatus,
      toggleMenuItemAvailability,
    }),
    [
      guest,
      orders,
      activeOrder,
      roomRequests,
      menuItems,
      serviceCategories,
      cartItems,
      totalCartCount,
      cartSubtotal,
      initializeGuest,
      login,
      logout,
      loadStaffData,
      refreshOrder,
      refreshRequest,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      advanceActiveOrderStatus,
      addRoomRequest,
      updateRoomRequestStatus,
      toggleMenuItemAvailability,
    ]
  );

  return <NivoraContext.Provider value={value}>{children}</NivoraContext.Provider>;
}

export function useNivora() {
  const context = useContext(NivoraContext);
  if (!context) throw new Error('useNivora must be used within a NivoraProvider');
  return context;
}
