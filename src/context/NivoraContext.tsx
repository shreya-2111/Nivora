'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  GuestProfile,
  ActiveOrder,
  OrderStatus,
  MenuItem,
  RoomServiceRequest,
  RequestStatus,
} from '@/types';
import {
  mockGuestProfile,
  mockActiveOrder,
  mockMenuItems,
} from '@/data/mockData';
import { hotelService } from '@/services/hotelService';
import { menuService } from '@/services/menuService';
import { ordersService } from '@/services/ordersService';
import { requestsService } from '@/services/requestsService';
import { getGuestSession } from '@/lib/auth';
import { backendDishToMenuItem, backendOrderToActiveOrder, backendRequestToFrontend } from '@/lib/converters';
import { HotelSettings, BackendOrderStatus, CreateOrderPayload } from '@/types/api';

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  instructions?: string;
  selectedOptionIds?: string[];
  selectedOptionsText?: string;
  additionalPrice?: number;
}

const initialOrders: ActiveOrder[] = [
  {
    ...mockActiveOrder,
    roomNumber: mockGuestProfile.roomNumber,
    guestName: mockGuestProfile.name,
    deliveryNotes: 'Please ring bell once and leave outside suite entrance.',
  },
  {
    id: 'ord_2891',
    orderNumber: '#NV-2891',
    roomNumber: '312',
    guestName: 'Ms. Eleanor Vance',
    status: 'on_the_way',
    estimatedDeliveryMinutes: 5,
    placedAt: '18:15',
    totalAmount: 92.00,
    items: [
      {
        id: 'menu_m2',
        name: 'Norwegian Wild Salmon',
        price: 36.00,
        quantity: 1,
        specialInstructions: 'Extra lemon',
      },
      {
        id: 'menu_c2',
        name: 'Nivora Royal Gold Martini',
        price: 18.00,
        quantity: 2,
      },
      {
        id: 'menu_d1',
        name: 'Valrhona Dark Chocolate Fondant',
        price: 16.00,
        quantity: 1,
      },
    ],
    deliveryNotes: 'Deliver directly inside living area.',
  },
];

const initialRoomRequests: RoomServiceRequest[] = [
  {
    id: 'req_1',
    ticketNumber: '#SR-104',
    roomNumber: '404',
    guestName: 'Mr. Harrison',
    serviceCategory: 'Housekeeping & Linen',
    requestItem: 'Extra Plush Bath Sheets & Lavender Pillow Mist',
    urgency: 'Immediate (10-15 mins)',
    notes: 'Please leave outside door on luggage bench.',
    status: 'in_progress',
    createdAt: '18:35',
  },
  {
    id: 'req_2',
    ticketNumber: '#SR-103',
    roomNumber: '508',
    guestName: 'Lord Sterling',
    serviceCategory: 'Concierge & Luggage',
    requestItem: 'Valet Chauffeur to Airport (7:30 AM Tomorrow)',
    urgency: 'Later Today',
    notes: 'Rolls Royce or Maybach requested.',
    status: 'completed',
    createdAt: '17:10',
  },
];

interface NivoraContextType {
  guest: GuestProfile;
  setGuestRoom: (roomNumber: string) => void;
  hotel: HotelSettings | null;
  orders: ActiveOrder[];
  activeOrder: ActiveOrder;
  roomRequests: RoomServiceRequest[];
  menuItems: MenuItem[];
  rawMenuCategories: any[];
  cartItems: CartItemEntry[];
  totalCartCount: number;
  cartSubtotal: number;
  isApiConnected: boolean;
  addToCart: (
    item: MenuItem,
    quantity?: number,
    instructions?: string,
    selectedOptionIds?: string[],
    selectedOptionsText?: string,
    additionalPrice?: number
  ) => void;
  removeFromCart: (item: MenuItem) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryNotes?: string) => Promise<ActiveOrder>;
  refreshOrder: (orderId: string) => Promise<ActiveOrder | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceActiveOrderStatus: () => void;
  addRoomRequest: (
    request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>,
    categoryId?: string
  ) => Promise<RoomServiceRequest>;
  updateRoomRequestStatus: (requestId: string, status: RequestStatus) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
}

const NivoraContext = createContext<NivoraContextType | null>(null);

export function NivoraProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<GuestProfile>(mockGuestProfile);
  const [hotel, setHotel] = useState<HotelSettings | null>(null);
  const [orders, setOrders] = useState<ActiveOrder[]>(initialOrders);
  const [roomRequests, setRoomRequests] = useState<RoomServiceRequest[]>(initialRoomRequests);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    mockMenuItems.map((item) => ({ ...item, isAvailable: true }))
  );
  const [rawMenuCategories, setRawMenuCategories] = useState<any[]>([]);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);

  const [cartItems, setCartItems] = useState<CartItemEntry[]>([
    {
      item: mockMenuItems[4], // Prime Truffle Ribeye Steak
      quantity: 1,
      instructions: 'Medium-rare, sauce on side',
    },
  ]);

  // Set guest room helper
  const setGuestRoom = useCallback((roomNumber: string) => {
    setGuest((prev) => ({
      ...prev,
      roomNumber,
    }));
  }, []);

  // 1. Check for Active Guest Session on mount
  useEffect(() => {
    const session = getGuestSession();
    if (session && session.room && session.room.room_number) {
      setGuest((prev) => ({
        ...prev,
        roomNumber: session.room.room_number,
      }));
    }
  }, []);

  // 2. Fetch Live Hotel Information & Live Menu
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      // A) Hotel Settings
      try {
        const hotelRes = await hotelService.getHotel();
        if (isMounted && hotelRes?.hotel) {
          setHotel(hotelRes.hotel);
          setIsApiConnected(true);
        }
      } catch (err) {
        // Backend DB pending or offline - silent fallback
      }

      // B) Menu Catalog
      try {
        const menuRes = await menuService.getMenu();
        if (isMounted && menuRes?.categories && menuRes.categories.length > 0) {
          setRawMenuCategories(menuRes.categories);
          const convertedItems: MenuItem[] = [];
          for (const cat of menuRes.categories) {
            for (const dish of cat.items || []) {
              convertedItems.push(backendDishToMenuItem(dish, cat.name));
            }
          }
          if (convertedItems.length > 0) {
            setMenuItems(convertedItems);
          }
          setIsApiConnected(true);
        }
      } catch (err) {
        // Backend DB pending or offline - keeps mock items
      }
    }

    loadBackendData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Current active order for guest tracking (defaults to active room order)
  const activeOrder = useMemo(() => {
    return (
      orders.find((o) => o.roomNumber === guest.roomNumber && o.status !== 'delivered' && o.status !== 'cancelled') ||
      orders.find((o) => o.roomNumber === guest.roomNumber) ||
      orders[0]
    );
  }, [orders, guest.roomNumber]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, curr) => acc + (curr.item.price + (curr.additionalPrice || 0)) * curr.quantity,
        0
      ),
    [cartItems]
  );

  const addToCart = useCallback(
    (
      item: MenuItem,
      quantity = 1,
      instructions?: string,
      selectedOptionIds?: string[],
      selectedOptionsText?: string,
      additionalPrice?: number
    ) => {
      setCartItems((prev) => {
        const idx = prev.findIndex((entry) => entry.item.id === item.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx].quantity += quantity;
          if (instructions) copy[idx].instructions = instructions;
          if (selectedOptionIds) copy[idx].selectedOptionIds = selectedOptionIds;
          if (selectedOptionsText) copy[idx].selectedOptionsText = selectedOptionsText;
          if (additionalPrice) copy[idx].additionalPrice = additionalPrice;
          return copy;
        }
        return [
          ...prev,
          {
            item,
            quantity,
            instructions,
            selectedOptionIds,
            selectedOptionsText,
            additionalPrice: additionalPrice || 0,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((entry) => entry.item.id !== item.id);
      }
      return prev.map((entry) =>
        entry.item.id === item.id ? { ...entry, quantity: entry.quantity - 1 } : entry
      );
    });
  }, []);

  const updateCartQuantity = useCallback((itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((entry) => entry.item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((entry) =>
          entry.item.id === itemId ? { ...entry, quantity: newQty } : entry
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // STEP 7: Place Food Order via Real Backend API
  const placeOrder = useCallback(
    async (deliveryNotes?: string): Promise<ActiveOrder> => {
      if (cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      // 1. Build actual backend payload
      const payload: CreateOrderPayload = {
        items: cartItems.map((c) => ({
          menu_item_id: c.item.id,
          quantity: c.quantity,
          option_ids: c.selectedOptionIds || [],
          special_instructions: c.instructions || '',
        })),
        special_instructions: deliveryNotes || '',
      };

      try {
        // Attempt real backend order creation
        const res = await ordersService.createOrder(payload);
        if (res && res.order) {
          const createdOrder = backendOrderToActiveOrder(res.order);
          setOrders((prev) => [createdOrder, ...prev]);
          setCartItems([]);
          return createdOrder;
        }
      } catch (err: any) {
        console.warn('Backend order submission fallback:', err.message);
      }

      // Fallback local order creation if backend DB is not yet seeded
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const fallbackOrder: ActiveOrder = {
        id: `ord_${randomSuffix}`,
        orderNumber: `#NV-${randomSuffix}`,
        roomNumber: guest.roomNumber,
        guestName: guest.name,
        status: 'placed',
        estimatedDeliveryMinutes: 20,
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        totalAmount: cartSubtotal * 1.085,
        items: cartItems.map((c) => ({
          id: c.item.id,
          name: c.item.name,
          price: c.item.price + (c.additionalPrice || 0),
          quantity: c.quantity,
          specialInstructions: c.instructions,
        })),
        deliveryNotes: deliveryNotes || 'Standard delivery to room entrance.',
      };

      setOrders((prev) => [fallbackOrder, ...prev]);
      setCartItems([]);
      return fallbackOrder;
    },
    [cartItems, guest.roomNumber, guest.name, cartSubtotal]
  );

  // STEP 9: Refresh Order by ID from Backend
  const refreshOrder = useCallback(async (orderId: string): Promise<ActiveOrder | null> => {
    try {
      const res = await ordersService.getOrderById(orderId);
      if (res && res.order) {
        const active = backendOrderToActiveOrder(res.order);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? active : o)));
        return active;
      }
    } catch (err) {
      // Handled silently
    }
    return null;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const estimatedDeliveryMinutes =
            status === 'delivered' ? 0 : status === 'on_the_way' ? 5 : status === 'preparing' ? 12 : 20;
          return { ...order, status, estimatedDeliveryMinutes };
        }
        return order;
      })
    );
  }, []);

  const advanceActiveOrderStatus = useCallback(() => {
    if (!activeOrder) return;
    const flow: Record<OrderStatus, OrderStatus> = {
      placed: 'preparing',
      preparing: 'on_the_way',
      on_the_way: 'delivered',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };
    const nextStatus = flow[activeOrder.status];
    updateOrderStatus(activeOrder.id, nextStatus);
  }, [activeOrder, updateOrderStatus]);

  // Submit Room Request via Backend API
  const addRoomRequest = useCallback(
    async (
      request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>,
      categoryId?: string
    ): Promise<RoomServiceRequest> => {
      try {
        if (categoryId) {
          const res = await requestsService.createRequest({
            service_category_id: categoryId,
            custom_request: request.notes || request.requestItem,
          });
          if (res && res.request) {
            const created = backendRequestToFrontend(res.request);
            setRoomRequests((prev) => [created, ...prev]);
            return created;
          }
        }
      } catch (err) {
        console.warn('Backend request submission fallback:', err);
      }

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const newReq: RoomServiceRequest = {
        ...request,
        id: `req_${Date.now()}`,
        ticketNumber: `#SR-${randomSuffix}`,
        status: 'pending',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setRoomRequests((prev) => [newReq, ...prev]);
      return newReq;
    },
    []
  );

  const updateRoomRequestStatus = useCallback((requestId: string, status: RequestStatus) => {
    setRoomRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );
  }, []);

  const toggleMenuItemAvailability = useCallback((itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  }, []);

  return (
    <NivoraContext.Provider
      value={{
        guest,
        setGuestRoom,
        hotel,
        orders,
        activeOrder,
        roomRequests,
        menuItems,
        rawMenuCategories,
        cartItems,
        totalCartCount,
        cartSubtotal,
        isApiConnected,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        refreshOrder,
        updateOrderStatus,
        advanceActiveOrderStatus,
        addRoomRequest,
        updateRoomRequestStatus,
        toggleMenuItemAvailability,
      }}
    >
      {children}
    </NivoraContext.Provider>
  );
}

export function useNivora() {
  const context = useContext(NivoraContext);
  if (!context) {
    throw new Error('useNivora must be used within a NivoraProvider');
  }
  return context;
}
