import { useState } from 'react';
import { ArrowRight, Gift, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { Beverage, CartItem, LoyaltyReward, PromoOffer, StoreConfig } from '../types';
import { BeverageImage } from './BeverageImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  beverages: Beverage[];
  storeConfig: StoreConfig;
  offers: PromoOffer[];
  appliedPromoCode: string;
  onApplyPromoCode: (code: string) => void;
  activeRewardVoucher: LoyaltyReward | null;
  useRewardVoucher: boolean;
  onToggleRewardVoucher: (use: boolean) => void;
  onUpdateQuantity: (beverageId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onBrowseMenu: () => void;
  onOpenRecommender: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  beverages,
  storeConfig,
  offers,
  appliedPromoCode,
  onApplyPromoCode,
  activeRewardVoucher,
  useRewardVoucher,
  onToggleRewardVoucher,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  onBrowseMenu,
  onOpenRecommender,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState(appliedPromoCode);
  const [promoFeedback, setPromoFeedback] = useState<string>('');

  if (!isOpen) return null;

  const cartLines = cart
    .map((item) => {
      const beverage = beverages.find((b) => b.id === item.beverageId);
      if (!beverage) return null;
      return { item, beverage, lineTotal: beverage.price * item.quantity };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = cartLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const packagingFee = cartLines.length > 0 ? storeConfig.packagingFee : 0;

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

  const rewardDiscount =
    useRewardVoucher && activeRewardVoucher ? Math.min(subtotal, activeRewardVoucher.discountAmount) : 0;

  const totalDiscount = Math.min(subtotal, promoDiscount + rewardDiscount);
  const estimatedTotal = Math.max(0, subtotal + packagingFee - totalDiscount);
  const pointsPreview = Math.max(1, Math.floor(estimatedTotal / 10));

  const handleApplyCode = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      onApplyPromoCode('');
      setPromoFeedback('');
      return;
    }
    const found = offers.find((o) => o.code.toUpperCase() === code);
    if (!found) {
      setPromoFeedback('Invalid code. Try CAMPUS20 or FIRSTSIP10.');
      return;
    }
    if (subtotal < found.minOrder) {
      setPromoFeedback(`Add ₹${found.minOrder - subtotal} more to unlock ${found.code}.`);
      return;
    }
    onApplyPromoCode(found.code);
    setPromoFeedback(`${found.code} applied!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div
        className="fixed inset-0 bg-[#2B1B12]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-[#FAF7F2] h-full flex flex-col shadow-2xl border-l border-[#EAE2D6]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE2D6] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2B1B12]">Your Bag</h2>
            <p className="text-xs text-[#5E4536]">
              {cartLines.length === 0
                ? 'Ready for fresh refreshment'
                : `${cartLines.reduce((acc, l) => acc + l.item.quantity, 0)} drinks · Freshly prepared`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cartLines.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs font-medium text-[#5E4536] hover:text-[#DC2626] px-2 py-1.5 rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bag"
              className="min-h-[40px] min-w-[40px] rounded-xl border border-[#EAE2D6] flex items-center justify-center text-[#2B1B12] hover:bg-[#FAF7F2]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {cartLines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F2ECE1] flex items-center justify-center text-[#EA580C] mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#2B1B12] mb-2">Your First Sip bag is empty</h3>
            <p className="text-sm text-[#5E4536] max-w-xs mb-6 leading-relaxed">
              Explore our ₹40–₹70 handcrafted beverages or let our AI matcher pick your ideal break drink.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseMenu();
                }}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Browse Menu
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRecommender();
                }}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[#2B1B12] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Find Your Sip
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartLines.map(({ item, beverage, lineTotal }) => (
                <div
                  key={beverage.id}
                  className="bg-white rounded-2xl border border-[#EAE2D6] p-3.5 flex gap-3.5 items-center"
                >
                  <BeverageImage
                    src={beverage.image}
                    alt={beverage.name}
                    className="w-20 h-20 rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#2B1B12] truncate">{beverage.name}</h3>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(beverage.id, 0)}
                        aria-label={`Remove ${beverage.name}`}
                        className="text-[#7D6455] hover:text-[#DC2626] p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#5E4536] mb-2.5">
                      {beverage.flavour} · ₹{beverage.price} each
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#EAE2D6] rounded-lg bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(beverage.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#2B1B12]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(beverage.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#2B1B12]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#2B1B12] tabular-nums">
                        ₹{lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Box */}
              <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2B1B12]">
                  <Tag className="w-4 h-4 text-[#EA580C]" />
                  <span>Promo Code (Try CAMPUS20 or FIRSTSIP10)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCode}
                    className="px-4 min-h-[40px] rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p
                    className={`text-xs ${
                      promoDiscount > 0 ? 'text-[#15803D] font-medium' : 'text-[#EA580C]'
                    }`}
                  >
                    {promoFeedback}
                  </p>
                )}
              </div>

              {/* Redeemed Loyalty Voucher */}
              {activeRewardVoucher && (
                <div className="bg-[#ECFDF3] rounded-2xl border border-[#BBF7D0] p-4 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Gift className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#15803D]">{activeRewardVoucher.title}</p>
                      <p className="text-xs text-[#166534]">
                        Save ₹{activeRewardVoucher.discountAmount} on this order
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleRewardVoucher(!useRewardVoucher)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      useRewardVoucher
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#15803D] border border-[#BBF7D0]'
                    }`}
                  >
                    {useRewardVoucher ? 'Applied' : 'Use Now'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer Totals */}
            <div className="bg-white border-t border-[#EAE2D6] p-5 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5E4536]">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#5E4536]">
                  <span>Eco Cup & Seal Packaging</span>
                  <span className="tabular-nums font-medium">₹{packagingFee}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-[#15803D] font-medium">
                    <span>Savings Applied</span>
                    <span className="tabular-nums">-₹{totalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5E4536] text-xs pt-1">
                  <span>Delivery fee calculated at checkout</span>
                  <span className="text-[#15803D] font-medium">+{pointsPreview} pts</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE2D6] flex items-center justify-between">
                <span className="text-base font-bold text-[#2B1B12]">Estimated Total</span>
                <span className="text-xl font-extrabold text-[#2B1B12] tabular-nums">
                  ₹{estimatedTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
