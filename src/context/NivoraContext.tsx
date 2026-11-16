'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
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

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  instructions?: string;
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
  {
    id: 'ord_2887',
    orderNumber: '#NV-2887',
    roomNumber: '508',
    guestName: 'Lord Sterling',
    status: 'delivered',
    estimatedDeliveryMinutes: 0,
    placedAt: '17:30',
    totalAmount: 195.00,
    items: [
      {
        id: 'menu_w1',
        name: 'Dom Pérignon Vintage Champagne',
        price: 195.00,
        quantity: 1,
      },
    ],
    deliveryNotes: 'Chilled bucket with 2 crystal flutes.',
  },
  {
    id: 'ord_2880',
    orderNumber: '#NV-2880',
    roomNumber: '205',
    guestName: 'Dr. Evelyn Reed',
    status: 'placed',
    estimatedDeliveryMinutes: 25,
    placedAt: '18:50',
    totalAmount: 56.50,
    items: [
      {
        id: 'menu_m3',
        name: 'Wagyu Smash Truffle Burger',
        price: 28.00,
        quantity: 1,
      },
      {
        id: 'menu_s4',
        name: 'Crispy Calamari Fritti',
        price: 22.00,
        quantity: 1,
      },
      {
        id: 'menu_c3',
        name: 'Hibiscus Blossom Spritz',
        price: 15.00,
        quantity: 1,
      },
    ],
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
  {
    id: 'req_3',
    ticketNumber: '#SR-102',
    roomNumber: '312',
    guestName: 'Ms. Eleanor Vance',
    serviceCategory: 'Hotel Amenities',
    requestItem: 'Ice Bucket & Cocktail Shaker Kit',
    urgency: 'Immediate (10-15 mins)',
    status: 'pending',
    createdAt: '18:48',
  },
];

interface NivoraContextType {
  guest: GuestProfile;
  orders: ActiveOrder[];
  activeOrder: ActiveOrder;
  roomRequests: RoomServiceRequest[];
  menuItems: MenuItem[];
  cartItems: CartItemEntry[];
  totalCartCount: number;
  cartSubtotal: number;
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (item: MenuItem) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryNotes?: string) => ActiveOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceActiveOrderStatus: () => void;
  addRoomRequest: (request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => RoomServiceRequest;
  updateRoomRequestStatus: (requestId: string, status: RequestStatus) => void;
  toggleMenuItemAvailability: (itemId: string) => void;
}

const NivoraContext = createContext<NivoraContextType | null>(null);

export function NivoraProvider({ children }: { children: React.ReactNode }) {
  const [guest] = useState<GuestProfile>(mockGuestProfile);
  const [orders, setOrders] = useState<ActiveOrder[]>(initialOrders);
  const [roomRequests, setRoomRequests] = useState<RoomServiceRequest[]>(initialRoomRequests);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    mockMenuItems.map((item) => ({ ...item, isAvailable: true }))
  );
  const [cartItems, setCartItems] = useState<CartItemEntry[]>([
    {
      item: mockMenuItems[4], // Prime Truffle Ribeye Steak
      quantity: 1,
      instructions: 'Medium-rare, sauce on side',
    },
  ]);

  // Current active order for guest tracking (defaults to Room 404 order)
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
    () => cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0),
    [cartItems]
  );

  const addToCart = React.useCallback(
    (item: MenuItem, quantity = 1, instructions?: string) => {
      setCartItems((prev) => {
        const idx = prev.findIndex((entry) => entry.item.id === item.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx].quantity += quantity;
          if (instructions) copy[idx].instructions = instructions;
          return copy;
        }
        return [...prev, { item, quantity, instructions }];
      });
    },
    []
  );

  const removeFromCart = React.useCallback((item: MenuItem) => {
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

  const updateCartQuantity = React.useCallback((itemId: string, newQty: number) => {
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

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  const placeOrder = React.useCallback(
    (deliveryNotes?: string): ActiveOrder => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrder: ActiveOrder = {
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
          price: c.item.price,
          quantity: c.quantity,
          specialInstructions: c.instructions,
        })),
        deliveryNotes: deliveryNotes || 'Standard delivery to room entrance.',
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCartItems([]);
      return newOrder;
    },
    [guest.roomNumber, guest.name, cartSubtotal, cartItems]
  );

  const updateOrderStatus = React.useCallback((orderId: string, status: OrderStatus) => {
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

  const advanceActiveOrderStatus = React.useCallback(() => {
    if (!activeOrder) return;
    const flow: Record<OrderStatus, OrderStatus> = {
      placed: 'preparing',
      preparing: 'on_the_way',
      on_the_way: 'delivered',
      delivered: 'placed',
      cancelled: 'placed',
    };
    const nextStatus = flow[activeOrder.status] || 'preparing';
    updateOrderStatus(activeOrder.id, nextStatus);
  }, [activeOrder, updateOrderStatus]);

  const addRoomRequest = React.useCallback(
    (
      request: Omit<RoomServiceRequest, 'id' | 'ticketNumber' | 'status' | 'createdAt'>
    ): RoomServiceRequest => {
      const ticketNum = `#SR-${Math.floor(100 + Math.random() * 900)}`;
      const newReq: RoomServiceRequest = {
        ...request,
        id: `req_${Date.now()}`,
        ticketNumber: ticketNum,
        status: 'pending',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setRoomRequests((prev) => [newReq, ...prev]);
      return newReq;
    },
    []
  );

  const updateRoomRequestStatus = React.useCallback(
    (requestId: string, status: RequestStatus) => {
      setRoomRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
    },
    []
  );

  const toggleMenuItemAvailability = React.useCallback((itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      guest,
      orders,
      activeOrder,
      roomRequests,
      menuItems,
      cartItems,
      totalCartCount,
      cartSubtotal,
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
      cartItems,
      totalCartCount,
      cartSubtotal,
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
  const ctx = useContext(NivoraContext);
  if (!ctx) {
    throw new Error('useNivora must be used within a NivoraProvider');
  }
  return ctx;
}
