import { pool } from './db';

// turn a DB row into the JSON we send (modules grouped together)
export function formatHotel(h: any) {
  return {
    id: h.id,
    hotel_name: h.hotel_name,
    logo_url: h.logo_url,
    cover_image_url: h.cover_image_url,
    welcome_message: h.welcome_message,
    primary_color: h.primary_color,
    secondary_color: h.secondary_color,
    phone: h.phone,
    whatsapp: h.whatsapp,
    address: h.address,
    modules: {
      food_ordering: h.module_food_ordering,
      room_service: h.module_room_service,
      contact_reception: h.module_contact_reception,
      hotel_information: h.module_hotel_information,
    },
  };
}

export async function getHotel() {
  const result = await pool.query('SELECT * FROM hotel_settings LIMIT 1');
  return result.rows[0];
}
