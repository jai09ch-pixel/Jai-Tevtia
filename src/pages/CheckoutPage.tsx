import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Info,
  Loader2,
  MapPin,
  ShieldCheck,
  Smartphone,
  Store,
} from 'lucide-react';
import {
  Beverage,
  CartItem,
  CustomerProfile,
  FulfillmentType,
  Order,
  OrderStatus,
  PageRoute,
  PaymentMethod,
  PromoOffer,
  StoreConfig,
} from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  beverages: Beverage[];
  storeConfig: StoreConfig;
  profile: CustomerProfile;
  offers: PromoOffer[];
  appliedPromoCode: string;
  useRewardVoucher: boolean;
  onPlaceOrder: (order: Order, redeemReward: boolean) => void;
  onNavigate: (page: PageRoute) => void;
}

export function CheckoutPage({
  cart,
  beverages,
  storeConfig,
  profile,
  offers,
  appliedPromoCode,
  useRewardVoucher,
  onPlaceOrder,
  onNavigate,
}: CheckoutPageProps) {
  const [customerName, setCustomerName] = useState(profile.name);
  const [mobile, setMobile] = useState(profile.mobile);
  const [email, setEmail] = useState(profile.email);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    storeConfig.deliveryEnabled ? FulfillmentType.PICKUP : FulfillmentType.PICKUP
  );
  const [pickupHub, setPickupHub] = useState(
    profile.preferredHub || storeConfig.pickupHubs[0] || 'Rajpur Road Flagship Kiosk'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(profile.defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.UPI);
  const [upiId, setUpiId] = useState('aarav@okicici');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartLines = cart
    .map((item) => {
      const beverage = beverages.find((b) => b.id === item.beverageId);
      if (!beverage) return null;
      return { item, beverage, lineTotal: beverage.price * item.quantity };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  if (cartLines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-[#2B1B12] mb-2">Your bag is empty</h1>
        <p className="text-sm text-[#5E4536] mb-6">
          Add at least one First Sip beverage before checking out.
        </p>
        <button
          type="button"
          onClick={() => onNavigate(PageRoute.MENU)}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#EA580C] text-white text-sm font-semibold hover:bg-[#C2410C]"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const effectiveFulfillment = storeConfig.deliveryEnabled
    ? fulfillmentType
    : FulfillmentType.PICKUP;

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const packagingFee = storeConfig.packagingFee;
  const deliveryFee =
    effectiveFulfillment === FulfillmentType.DELIVERY
      ? subtotal >= storeConfig.freeDeliveryThreshold
        ? 0
        : storeConfig.deliveryFee
      : 0;

  let promoDiscount = 0;
  const matchedOffer = offers.find(
    (o) => o.code.toUpperCase() === appliedPromoCode.trim().toUpperCase()
  );
  if (matchedOffer && subtotal >= matchedOffer.minOrder) {
    promoDiscount =
      matchedOffer.discountType === 'percent'
        ? Math.round((subtotal * matchedOffer.discountValue) / 100)
        : matchedOffer.discountValue;
  }

  const voucherDiscount =
    useRewardVoucher && profile.unlockedRewardVoucher
      ? Math.min(subtotal, profile.unlockedRewardVoucher.discountAmount)
      : 0;

  const totalDiscount = Math.min(subtotal, promoDiscount + voucherDiscount);
  const grandTotal = Math.max(0, subtotal + packagingFee + deliveryFee - totalDiscount);
  const pointsEarned = Math.max(1, Math.floor(grandTotal / 10));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    const cleanPhone = mobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (effectiveFulfillment === FulfillmentType.DELIVERY && deliveryAddress.trim().length < 8) {
      setError('Please enter your full Dehradun delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNum = `FS-${Math.floor(1050 + Math.random() * 8900)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        customerName: customerName.trim(),
        mobile: cleanPhone,
        email: email.trim() || undefined,
        fulfillmentType: effectiveFulfillment,
        pickupHub: effectiveFulfillment === FulfillmentType.PICKUP ? pickupHub : undefined,
        deliveryAddress:
          effectiveFulfillment === FulfillmentType.DELIVERY ? deliveryAddress.trim() : undefined,
        paymentMethod,
        items: cartLines.map(({ beverage, item }) => ({
          beverageId: beverage.id,
          name: beverage.name,
          price: beverage.price,
          quantity: item.quantity,
          image: beverage.image,
        })),
        subtotal,
        packagingFee,
        deliveryFee,
        discountAmount: totalDiscount,
        promoCodeUsed: promoDiscount > 0 ? matchedOffer?.code : undefined,
        rewardRedeemed: voucherDiscount > 0 ? profile.unlockedRewardVoucher?.title : undefined,
        total: grandTotal,
        pointsEarned,
        estimatedMinutes:
          effectiveFulfillment === FulfillmentType.DELIVERY
            ? storeConfig.prepTimeMinutes + 10
            : storeConfig.prepTimeMinutes,
        status: OrderStatus.RECEIVED,
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onPlaceOrder(newOrder, voucherDiscount > 0);
    }, 550);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20">
      <button
        type="button"
        onClick={() => onNavigate(PageRoute.MENU)}
        className="text-sm font-semibold text-[#5E4536] hover:text-[#2B1B12] flex items-center gap-1.5 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </button>

      <h1 className="text-3xl font-extrabold text-[#2B1B12] tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Fulfillment Mode */}
          <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2B1B12]">1. Pickup or Delivery</h2>

            {!storeConfig.deliveryEnabled && (
              <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-3.5 text-xs text-[#9A3412] flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Delivery is currently paused by the store admin. Pickup is available at all
                  Dehradun kiosks.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType(FulfillmentType.PICKUP)}
                className={`p-4 rounded-2xl border text-left transition-colors ${
                  effectiveFulfillment === FulfillmentType.PICKUP
                    ? 'border-[#EA580C] bg-[#FFF7ED]'
                    : 'border-[#EAE2D6] bg-[#FAF7F2] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className="w-5 h-5 text-[#EA580C]" />
                  <span className="text-xs font-bold text-[#15803D]">Free</span>
                </div>
                <p className="text-sm font-bold text-[#2B1B12]">Campus / Kiosk Pickup</p>
                <p className="text-xs text-[#5E4536] mt-0.5">
                  Ready in ~{storeConfig.prepTimeMinutes} mins
                </p>
              </button>

              <button
                type="button"
                disabled={!storeConfig.deliveryEnabled}
                onClick={() => setFulfillmentType(FulfillmentType.DELIVERY)}
                className={`p-4 rounded-2xl border text-left transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${
                  effectiveFulfillment === FulfillmentType.DELIVERY
                    ? 'border-[#EA580C] bg-[#FFF7ED]'
                    : 'border-[#EAE2D6] bg-[#FAF7F2] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <MapPin className="w-5 h-5 text-[#EA580C]" />
                  <span className="text-xs font-bold text-[#2B1B12] tabular-nums">
                    {subtotal >= storeConfig.freeDeliveryThreshold
                      ? 'Free'
                      : `₹${storeConfig.deliveryFee}`}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#2B1B12]">Dehradun Delivery</p>
                <p className="text-xs text-[#5E4536] mt-0.5">
                  Free above ₹{storeConfig.freeDeliveryThreshold}
                </p>
              </button>
            </div>

            {effectiveFulfillment === FulfillmentType.PICKUP ? (
              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-2">
                  Select Dehradun Pickup Kiosk
                </label>
                <select
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
                >
                  {storeConfig.pickupHubs.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-2">
                  Delivery Address (Dehradun)
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Hostel / Flat, Street, Landmark, Dehradun"
                  className="w-full p-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2B1B12]">2. Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] tabular-nums focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                Email (Optional, for digital receipt)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#2B1B12]">3. Payment Method</h2>
              <span className="text-xs font-medium text-[#5E4536]">Demo Simulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  method: PaymentMethod.UPI,
                  label: 'UPI (Demo)',
                  sub: 'GPay · PhonePe · Paytm',
                  icon: Smartphone,
                },
                {
                  method: PaymentMethod.CASH,
                  label: 'Cash',
                  sub: 'Pay at kiosk / door',
                  icon: Banknote,
                },
                {
                  method: PaymentMethod.ONLINE_DEMO,
                  label: 'Online Card',
                  sub: 'Simulated gateway',
                  icon: CreditCard,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.method;
                return (
                  <button
                    key={opt.method}
                    type="button"
                    onClick={() => setPaymentMethod(opt.method)}
                    className={`p-3.5 rounded-2xl border text-left transition-colors ${
                      active
                        ? 'border-[#EA580C] bg-[#FFF7ED]'
                        : 'border-[#EAE2D6] bg-[#FAF7F2] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#EA580C] mb-1.5" />
                    <p className="text-sm font-bold text-[#2B1B12]">{opt.label}</p>
                    <p className="text-xs text-[#5E4536]">{opt.sub}</p>
                  </button>
                );
              })}
            </div>

            {paymentMethod === PaymentMethod.UPI && (
              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Demo UPI ID (No real charge is made)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12]"
                />
              </div>
            )}

            <div className="rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] p-3 text-xs text-[#5E4536] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>
                Prototype Notice: Orders are simulated locally for demonstration. No real payment is
                processed.
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-[#FEF2F2] border border-[#FECACA] p-4 text-sm text-[#B91C1C]">
              {error}
            </div>
          )}
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-[#2B1B12]">Order Summary</h2>

          <div className="divide-y divide-[#EAE2D6] max-h-64 overflow-y-auto">
            {cartLines.map(({ beverage, item, lineTotal }) => (
              <div key={beverage.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2B1B12] truncate">
                    {item.quantity} × {beverage.name}
                  </p>
                  <p className="text-xs text-[#5E4536]">{beverage.flavour}</p>
                </div>
                <span className="text-sm font-bold text-[#2B1B12] tabular-nums">
                  ₹{lineTotal}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EAE2D6] space-y-2 text-sm">
            <div className="flex justify-between text-[#5E4536]">
              <span>Subtotal</span>
              <span className="tabular-nums">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#5E4536]">
              <span>Packaging Fee</span>
              <span className="tabular-nums">₹{packagingFee}</span>
            </div>
            <div className="flex justify-between text-[#5E4536]">
              <span>Delivery Fee</span>
              <span className="tabular-nums">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-[#15803D] font-medium">
                <span>Promo & Reward Discount</span>
                <span className="tabular-nums">-₹{totalDiscount}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#EAE2D6] flex items-center justify-between">
            <span className="text-base font-bold text-[#2B1B12]">Total Payable</span>
            <span className="text-2xl font-extrabold text-[#2B1B12] tabular-nums">
              ₹{grandTotal}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#15803D] bg-[#ECFDF3] border border-[#BBF7D0] rounded-xl px-3.5 py-2.5 text-center">
            You will earn +{pointsEarned} First Sip loyalty points on this order
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Placing Demo Order...</span>
              </>
            ) : (
              <span>Place Order · ₹{grandTotal}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
