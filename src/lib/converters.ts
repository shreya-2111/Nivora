// ==============================================================================
// NIVORA - MODEL CONVERTERS & DATA BRIDGES
// Maps between Backend API responses and Frontend Figma-aligned UI models
// ==============================================================================

import {
  BackendMenuItem,
  BackendOrder,
  BackendOrderStatus,
  BackendServiceRequest,
  BackendRequestStatus,
  MenuCategoryWithItems,
} from '@/types/api';
import { MenuItem, ActiveOrder, OrderStatus, RoomServiceRequest, RequestStatus } from '@/types';

/**
 * Converts backend order status to frontend display status
 */
export function toFrontendOrderStatus(status: BackendOrderStatus | string): OrderStatus {
  switch (status?.toUpperCase()) {
    case 'NEW':
    case 'ACCEPTED':
      return 'placed';
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
      return 'placed';
  }
}

/**
 * Converts backend request status to frontend display status
 */
export function toFrontendRequestStatus(status: BackendRequestStatus | string): RequestStatus {
  switch (status?.toUpperCase()) {
    case 'NEW':
    case 'ACCEPTED':
      return 'pending';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'COMPLETED':
      return 'completed';
    default:
      return 'pending';
  }
}

/**
 * Maps a BackendMenuItem into the frontend MenuItem interface
 */
export function backendDishToMenuItem(
  item: BackendMenuItem,
  categoryName: string = 'Mains'
): MenuItem {
  // Normalize category name to supported frontend category strings
  let normalizedCat: MenuItem['category'] = 'Mains';
  const lower = categoryName.toLowerCase();
  if (lower.includes('starter') || lower.includes('appetizer') || lower.includes('breakfast')) {
    normalizedCat = 'Starters';
  } else if (lower.includes('dessert') || lower.includes('sweet')) {
    normalizedCat = 'Desserts';
  } else if (lower.includes('cocktail') || lower.includes('beverage') || lower.includes('drink')) {
    normalizedCat = 'Signature Cocktails';
  } else if (lower.includes('wine') || lower.includes('spirit')) {
    normalizedCat = 'Wines & Spirits';
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    prepTime: '15-20 min',
    category: normalizedCat,
    isVegetarian: item.is_vegetarian,
    isAvailable: item.is_available,
    image: item.image_url || '/overwater-dish.jpg',
  };
}

/**
 * Maps a BackendOrder into the frontend ActiveOrder interface
 */
export function backendOrderToActiveOrder(order: BackendOrder): ActiveOrder {
  return {
    id: order.id,
    orderNumber: order.order_number,
    roomNumber: order.room_number || '404',
    guestName: 'Valued Guest',
    status: toFrontendOrderStatus(order.status),
    estimatedDeliveryMinutes:
      order.status === 'DELIVERED'
        ? 0
        : order.status === 'READY'
        ? 5
        : order.status === 'PREPARING'
        ? 15
        : 25,
    placedAt: new Date(order.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    totalAmount: Number(order.total),
    deliveryNotes: order.special_instructions || 'Standard luxury in-room staging.',
    items: (order.items || []).map((i) => ({
      id: i.id,
      name: i.item_name_snapshot,
      price: Number(i.unit_price),
      quantity: i.quantity,
      specialInstructions: i.special_instructions || undefined,
    })),
  };
}

/**
 * Maps a BackendServiceRequest into the frontend RoomServiceRequest interface
 */
export function backendRequestToFrontend(req: BackendServiceRequest): RoomServiceRequest {
  return {
    id: req.id,
    ticketNumber: req.request_number,
    roomNumber: req.room_number || '404',
    guestName: 'Valued Guest',
    serviceCategory: req.service_category_name || 'Room Service',
    requestItem: req.custom_request || req.service_category_name || 'Service Requisition',
    urgency: 'Immediate (10-15 mins)',
    status: toFrontendRequestStatus(req.status),
    createdAt: new Date(req.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
