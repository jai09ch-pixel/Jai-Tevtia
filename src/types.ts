export enum PageRoute {
  HOME = 'home',
  MENU = 'menu',
  FIND_YOUR_SIP = 'find-your-sip',
  CHECKOUT = 'checkout',
  ORDER_CONFIRMATION = 'order-confirmation',
  DASHBOARD = 'dashboard',
  ABOUT = 'about',
  CONTACT = 'contact',
  ADMIN = 'admin',
}

export enum BeverageCategory {
  COFFEE = 'Coffee',
  TEA = 'Tea',
  CITRUS = 'Citrus',
  FRUIT = 'Fruit Coolers',
  CHOCOLATE = 'Chocolate',
  SIGNATURE = 'Signature',
}

export enum OrderStatus {
  RECEIVED = 'Order Received',
  PREPARING = 'Preparing',
  READY = 'Ready for Pickup / Out for Delivery',
  COMPLETED = 'Completed',
}

export enum FulfillmentType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CASH = 'Cash',
  ONLINE_DEMO = 'Demo Online Payment',
}

export interface Beverage {
  id: string;
  name: string;
  description: string;
  price: number;
  flavour: string;
  category: BeverageCategory | string;
  image: string;
  volumeMl: number;
  prepMinutes: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  tags: string[];
}

export interface CartItem {
  beverageId: string;
  quantity: number;
}

export interface PromoOffer {
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minOrder: number;
}

export interface StoreConfig {
  deliveryEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  packagingFee: number;
  prepTimeMinutes: number;
  pickupHubs: string[];
}

export interface OrderItemSnapshot {
  beverageId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  mobile: string;
  email?: string;
  fulfillmentType: FulfillmentType;
  pickupHub?: string;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  items: OrderItemSnapshot[];
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  discountAmount: number;
  promoCodeUsed?: string;
  rewardRedeemed?: string;
  total: number;
  pointsEarned: number;
  estimatedMinutes: number;
  status: OrderStatus;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountAmount: number;
}

export interface CustomerProfile {
  name: string;
  mobile: string;
  email: string;
  defaultAddress: string;
  preferredHub: string;
  loyaltyPoints: number;
  referralCode: string;
  referralsCount: number;
  favorites: string[];
  unlockedRewardVoucher: LoyaltyReward | null;
}

export interface FeedbackEntry {
  id: string;
  customerName: string;
  beverageName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface DailySalesPoint {
  day: string;
  orders: number;
  revenue: number;
}
