import { FormEvent, useState } from 'react';
import {
  Check,
  Copy,
  Gift,
  Heart,
  Package,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { LOYALTY_REWARDS } from '../data/seedData';
import {
  Beverage,
  CustomerProfile,
  LoyaltyReward,
  Order,
  PageRoute,
  StoreConfig,
} from '../types';
import { BeverageImage } from '../components/BeverageImage';

interface CustomerDashboardPageProps {
  profile: CustomerProfile;
  orders: Order[];
  beverages: Beverage[];
  storeConfig: StoreConfig;
  onUpdateProfile: (next: CustomerProfile) => void;
  onRedeemReward: (reward: LoyaltyReward) => void;
  onSimulateReferral: () => void;
  onTrackOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  onAddToCart: (beverageId: string, quantity: number) => void;
  onToggleFavorite: (beverageId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export function CustomerDashboardPage({
  profile,
  orders,
  beverages,
  storeConfig,
  onUpdateProfile,
  onRedeemReward,
  onSimulateReferral,
  onTrackOrder,
  onReorder,
  onAddToCart,
  onToggleFavorite,
  onNavigate,
}: CustomerDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'orders' | 'favorites' | 'profile'>(
    'loyalty'
  );
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [nameInput, setNameInput] = useState(profile.name);
  const [mobileInput, setMobileInput] = useState(profile.mobile);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [addressInput, setAddressInput] = useState(profile.defaultAddress);
  const [hubInput, setHubInput] = useState(profile.preferredHub);

  const favoriteBeverages = beverages.filter((b) => profile.favorites.includes(b.id));
  const pointsToFreeDrink = Math.max(0, 50 - profile.loyaltyPoints);
  const progressPct = Math.min(100, Math.round((profile.loyaltyPoints / 50) * 100));

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(profile.referralCode).catch(() => {});
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 1800);
  };

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: nameInput.trim() || profile.name,
      mobile: mobileInput.trim() || profile.mobile,
      email: emailInput.trim(),
      defaultAddress: addressInput.trim(),
      preferredHub: hubInput,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20 space-y-8">
      {/* Top Loyalty Summary Banner */}
      <div className="bg-[#2B1B12] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-semibold text-[#FDBA74]">
            First Sip Club · {profile.name}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile.loyaltyPoints} Loyalty Points Available
          </h1>
          <p className="text-sm text-[#E7D8C9]">
            Earn 1 point for every ₹10 spent.{' '}
            {pointsToFreeDrink === 0
              ? 'You have enough points for a Free Classic Drink!'
              : `${pointsToFreeDrink} more points to unlock your next Free Classic Drink (₹50 value).`}
          </p>
          <div className="pt-2">
            <div className="h-2.5 w-full max-w-md bg-[#442C1F] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EA580C] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-[#E7D8C9] mt-1.5 tabular-nums">
              {profile.loyaltyPoints} / 50 pts toward Free Classic Drink
            </p>
          </div>
        </div>

        <div className="bg-[#3B261A] border border-[#543827] rounded-2xl p-5 space-y-3 lg:w-80 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#FDBA74]">Refer &amp; Earn +25 pts</span>
            <Users className="w-4 h-4 text-[#FDBA74]" />
          </div>
          <p className="text-xs text-[#E7D8C9] leading-relaxed">
            Share your code with Dehradun classmates. Both of you get 25 bonus points on their first
            sip.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyReferral}
              className="flex-1 min-h-[38px] px-3 rounded-xl bg-[#2B1B12] border border-[#543827] text-xs font-mono font-semibold text-white flex items-center justify-between"
            >
              <span>{profile.referralCode}</span>
              {copiedReferral ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onSimulateReferral}
              className="px-3 min-h-[38px] rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold whitespace-nowrap"
            >
              +25 Demo
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'loyalty', label: 'Rewards & Points' },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'favorites', label: `Favorites (${favoriteBeverages.length})` },
          { id: 'profile', label: 'My Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#EA580C] text-white'
                : 'bg-white border border-[#EAE2D6] text-[#5E4536] hover:text-[#2B1B12]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Loyalty Rewards */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {profile.unlockedRewardVoucher && (
            <div className="bg-[#ECFDF3] border border-[#BBF7D0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#15803D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#15803D]">
                    Active Reward Voucher: {profile.unlockedRewardVoucher.title}
                  </p>
                  <p className="text-xs text-[#166534] mt-0.5">
                    ₹{profile.unlockedRewardVoucher.discountAmount} discount is ready to apply inside
                    your Bag at checkout.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto"
              >
                Order &amp; Use Voucher
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LOYALTY_REWARDS.map((reward) => {
              const canRedeem =
                profile.loyaltyPoints >= reward.pointsCost && !profile.unlockedRewardVoucher;
              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl border border-[#EAE2D6] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Gift className="w-5 h-5 text-[#EA580C]" />
                      <span className="text-xs font-mono font-bold text-[#2B1B12] tabular-nums">
                        {reward.pointsCost} pts
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#2B1B12] mb-1.5">{reward.title}</h2>
                    <p className="text-sm text-[#5E4536] leading-relaxed mb-6">
                      {reward.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!canRedeem}
                    onClick={() => onRedeemReward(reward)}
                    className={`w-full min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      canRedeem
                        ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                        : 'bg-[#FAF7F2] text-[#8E7565] border border-[#EAE2D6] cursor-not-allowed'
                    }`}
                  >
                    {profile.unlockedRewardVoucher
                      ? 'Use Active Voucher First'
                      : profile.loyaltyPoints >= reward.pointsCost
                      ? 'Redeem Reward'
                      : `Need ${reward.pointsCost - profile.loyaltyPoints} more pts`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Previous & Active Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE2D6] p-12 text-center">
              <Package className="w-10 h-10 text-[#EA580C] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-[#2B1B12] mb-1">No orders yet</h2>
              <p className="text-sm text-[#5E4536] mb-5">
                Your First Sip orders and live tracking receipts will appear here.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-sm font-semibold"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#EAE2D6] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5E4536]">
                    <span className="font-mono font-bold text-[#2B1B12]">{order.orderNumber}</span>
                    <span>·</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#15803D]">{order.status}</span>
                  </div>
                  <p className="text-sm font-bold text-[#2B1B12]">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <p className="text-xs text-[#5E4536]">
                    {order.pickupHub ? `Pickup: ${order.pickupHub}` : `Delivery: ${order.deliveryAddress}`}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-[#2B1B12] tabular-nums">
                      ₹{order.total}
                    </p>
                    <p className="text-xs text-[#15803D] tabular-nums">+{order.pointsEarned} pts</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] hover:bg-[#F2ECE1] text-xs font-semibold text-[#2B1B12] whitespace-nowrap"
                    >
                      Track
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Favorite Beverages */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteBeverages.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE2D6] p-12 text-center">
              <Heart className="w-10 h-10 text-[#EA580C] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-[#2B1B12] mb-1">No favorites saved yet</h2>
              <p className="text-sm text-[#5E4536] mb-5">
                Tap the heart icon on any drink in our Menu to save your go-to break sips.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-sm font-semibold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteBeverages.map((bev) => (
                <div
                  key={bev.id}
                  className="bg-white rounded-2xl border border-[#EAE2D6] p-4 flex gap-4 items-center"
                >
                  <BeverageImage
                    src={bev.image}
                    alt={bev.name}
                    className="w-20 h-20 rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#2B1B12] truncate">{bev.name}</h3>
                    <p className="text-xs text-[#5E4536] mb-2">
                      {bev.flavour} · ₹{bev.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToCart(bev.id, 1)}
                        className="px-3 py-1.5 rounded-lg bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(bev.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EAE2D6] text-xs font-medium text-[#5E4536]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Customer Profile */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleProfileSave}
          className="bg-white rounded-3xl border border-[#EAE2D6] p-6 sm:p-8 max-w-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2B1B12]">Customer Profile</h2>
            {profileSaved && (
              <span className="text-xs font-semibold text-[#15803D] flex items-center gap-1">
                <UserCheck className="w-4 h-4" />
                Saved locally
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
              Preferred Dehradun Pickup Hub
            </label>
            <select
              value={hubInput}
              onChange={(e) => setHubInput(e.target.value)}
              className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
            >
              {storeConfig.pickupHubs.map((hub) => (
                <option key={hub} value={hub}>
                  {hub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
              Default Delivery Address
            </label>
            <textarea
              rows={2}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
            />
          </div>

          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold"
          >
            Save Profile Changes
          </button>
        </form>
      )}
    </div>
  );
}
