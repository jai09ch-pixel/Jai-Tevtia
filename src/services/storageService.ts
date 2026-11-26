import {
  INITIAL_BEVERAGES,
  INITIAL_FEEDBACK,
  INITIAL_INQUIRIES,
  INITIAL_ORDERS,
  INITIAL_PROFILE,
  INITIAL_STORE_CONFIG,
} from '../data/seedData';
import {
  Beverage,
  CartItem,
  ContactInquiry,
  CustomerProfile,
  FeedbackEntry,
  Order,
  StoreConfig,
} from '../types';

const KEYS = {
  BEVERAGES: 'firstsip_beverages_v1',
  CART: 'firstsip_cart_v1',
  ORDERS: 'firstsip_orders_v1',
  PROFILE: 'firstsip_profile_v1',
  CONFIG: 'firstsip_config_v1',
  FEEDBACK: 'firstsip_feedback_v1',
  INQUIRIES: 'firstsip_inquiries_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors in private browsing modes
  }
}

/**
 * Storage repository designed to map cleanly to Firebase Firestore collections
 * when First Sip transitions from prototype to live production backend.
 */
export const storageService = {
  getBeverages(): Beverage[] {
    return readStorage<Beverage[]>(KEYS.BEVERAGES, INITIAL_BEVERAGES);
  },
  saveBeverages(items: Beverage[]): void {
    writeStorage(KEYS.BEVERAGES, items);
  },

  getCart(): CartItem[] {
    return readStorage<CartItem[]>(KEYS.CART, []);
  },
  saveCart(items: CartItem[]): void {
    writeStorage(KEYS.CART, items);
  },

  getOrders(): Order[] {
    return readStorage<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    writeStorage(KEYS.ORDERS, orders);
  },

  getProfile(): CustomerProfile {
    return readStorage<CustomerProfile>(KEYS.PROFILE, INITIAL_PROFILE);
  },
  saveProfile(profile: CustomerProfile): void {
    writeStorage(KEYS.PROFILE, profile);
  },

  getStoreConfig(): StoreConfig {
    return readStorage<StoreConfig>(KEYS.CONFIG, INITIAL_STORE_CONFIG);
  },
  saveStoreConfig(config: StoreConfig): void {
    writeStorage(KEYS.CONFIG, config);
  },

  getFeedback(): FeedbackEntry[] {
    return readStorage<FeedbackEntry[]>(KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },
  saveFeedback(entries: FeedbackEntry[]): void {
    writeStorage(KEYS.FEEDBACK, entries);
  },

  getInquiries(): ContactInquiry[] {
    return readStorage<ContactInquiry[]>(KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },
  saveInquiries(entries: ContactInquiry[]): void {
    writeStorage(KEYS.INQUIRIES, entries);
  },
};
