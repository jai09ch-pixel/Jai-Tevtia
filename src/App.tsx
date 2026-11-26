/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INITIAL_OFFERS } from './data/seedData';
import { storageService } from './services/storageService';
import {
  Beverage,
  CartItem,
  ContactInquiry,
  CustomerProfile,
  FeedbackEntry,
  LoyaltyReward,
  Order,
  OrderStatus,
  PageRoute,
  StoreConfig,
} from './types';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { SipAssistantWidget } from './components/SipAssistantWidget';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { FindYourSipPage } from './pages/FindYourSipPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(PageRoute.HOME);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [beverages, setBeverages] = useState<Beverage[]>(() => storageService.getBeverages());
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [profile, setProfile] = useState<CustomerProfile>(() => storageService.getProfile());
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() =>
    storageService.getStoreConfig()
  );
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() =>
    storageService.getFeedback()
  );
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() =>
    storageService.getInquiries()
  );

  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    () => storageService.getOrders()[0]?.id ?? null
  );
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');
  const [useRewardVoucher, setUseRewardVoucher] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    storageService.saveBeverages(beverages);
  }, [beverages]);

  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    storageService.saveStoreConfig(storeConfig);
  }, [storeConfig]);

  useEffect(() => {
    storageService.saveFeedback(feedbackList);
  }, [feedbackList]);

  useEffect(() => {
    storageService.saveInquiries(inquiries);
  }, [inquiries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.beverageId] = item.quantity;
    }
    return map;
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (beverageId: string, quantity: number) => {
    const drink = beverages.find((b) => b.id === beverageId);
    setCart((prev) => {
      const existing = prev.find((i) => i.beverageId === beverageId);
      if (existing) {
        return prev.map((i) =>
          i.beverageId === beverageId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { beverageId, quantity }];
    });
    if (drink) {
      showToast(`Added ${quantity} × ${drink.name} to bag`);
    }
  };

  const handleUpdateCartQuantity = (beverageId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.beverageId !== beverageId));
      return;
    }
    setCart((prev) => {
      const exists = prev.some((i) => i.beverageId === beverageId);
      if (!exists) return [...prev, { beverageId, quantity }];
      return prev.map((i) => (i.beverageId === beverageId ? { ...i, quantity } : i));
    });
  };

  const handleToggleFavorite = (beverageId: string) => {
    setProfile((prev) => {
      const exists = prev.favorites.includes(beverageId);
      const nextFavs = exists
        ? prev.favorites.filter((id) => id !== beverageId)
        : [...prev.favorites, beverageId];
      return { ...prev, favorites: nextFavs };
    });
  };

  const handlePlaceOrder = (order: Order, redeemReward: boolean) => {
    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.id);
    setCart([]);
    setAppliedPromoCode('');
    setUseRewardVoucher(false);
    setProfile((prev) => ({
      ...prev,
      name: order.customerName,
      mobile: order.mobile,
      email: order.email ?? prev.email,
      defaultAddress: order.deliveryAddress ?? prev.defaultAddress,
      preferredHub: order.pickupHub ?? prev.preferredHub,
      loyaltyPoints: prev.loyaltyPoints + order.pointsEarned,
      unlockedRewardVoucher: redeemReward ? null : prev.unlockedRewardVoucher,
    }));
    navigateTo(PageRoute.ORDER_CONFIRMATION);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order status updated to ${status}`);
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (profile.loyaltyPoints < reward.pointsCost || profile.unlockedRewardVoucher) return;
    setProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - reward.pointsCost,
      unlockedRewardVoucher: reward,
    }));
    setUseRewardVoucher(true);
    showToast(`${reward.title} unlocked & ready in your bag!`);
  };

  const handleSimulateReferral = () => {
    setProfile((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + 25,
      referralsCount: prev.referralsCount + 1,
    }));
    showToast('+25 referral loyalty points added!');
  };

  const handleReorder = (order: Order) => {
    const newItems: CartItem[] = order.items
      .filter((item) => beverages.some((b) => b.id === item.beverageId && b.isAvailable))
      .map((item) => ({ beverageId: item.beverageId, quantity: item.quantity }));

    if (newItems.length === 0) {
      showToast('Items from that order are currently unavailable.');
      return;
    }
    setCart(newItems);
    setIsCartOpen(true);
  };

  const handleSaveBeverage = (bev: Beverage) => {
    setBeverages((prev) => {
      const exists = prev.some((b) => b.id === bev.id);
      if (exists) {
        return prev.map((b) => (b.id === bev.id ? bev : b));
      }
      return [bev, ...prev];
    });
    showToast(`${bev.name} saved to menu`);
  };

  const handleDeleteBeverage = (beverageId: string) => {
    setBeverages((prev) => prev.filter((b) => b.id !== beverageId));
    setCart((prev) => prev.filter((c) => c.beverageId !== beverageId));
    showToast('Beverage removed from catalog');
  };

  const handleSubmitFeedback = (entry: FeedbackEntry) => {
    setFeedbackList((prev) => [entry, ...prev]);
  };

  const handleSubmitInquiry = (inquiry: ContactInquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);
  };

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? null,
    [orders, activeOrderId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2B1B12]">
      <Navbar
        currentPage={currentPage}
        cartCount={cartCount}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {currentPage === PageRoute.HOME && (
          <HomePage
            beverages={beverages}
            offers={INITIAL_OFFERS}
            feedbackList={feedbackList}
            cartMap={cartMap}
            favorites={profile.favorites}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.MENU && (
          <MenuPage
            beverages={beverages}
            cartMap={cartMap}
            favorites={profile.favorites}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.FIND_YOUR_SIP && (
          <FindYourSipPage
            beverages={beverages}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.CHECKOUT && (
          <CheckoutPage
            cart={cart}
            beverages={beverages}
            storeConfig={storeConfig}
            profile={profile}
            offers={INITIAL_OFFERS}
            appliedPromoCode={appliedPromoCode}
            useRewardVoucher={useRewardVoucher}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.ORDER_CONFIRMATION && (
          <OrderConfirmationPage
            order={activeOrder}
            onAdvanceStatus={handleUpdateOrderStatus}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.DASHBOARD && (
          <CustomerDashboardPage
            profile={profile}
            orders={orders}
            beverages={beverages}
            storeConfig={storeConfig}
            onUpdateProfile={setProfile}
            onRedeemReward={handleRedeemReward}
            onSimulateReferral={handleSimulateReferral}
            onTrackOrder={(order) => {
              setActiveOrderId(order.id);
              navigateTo(PageRoute.ORDER_CONFIRMATION);
            }}
            onReorder={handleReorder}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={navigateTo}
          />
        )}

        {(currentPage === PageRoute.ABOUT || currentPage === PageRoute.CONTACT) && (
          <AboutContactPage
            key={currentPage}
            initialSection={currentPage === PageRoute.CONTACT ? 'contact' : 'about'}
            beverages={beverages}
            feedbackList={feedbackList}
            onSubmitFeedback={handleSubmitFeedback}
            onSubmitInquiry={handleSubmitInquiry}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === PageRoute.ADMIN && (
          <AdminDashboardPage
            beverages={beverages}
            orders={orders}
            feedbackList={feedbackList}
            inquiries={inquiries}
            storeConfig={storeConfig}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSaveBeverage={handleSaveBeverage}
            onDeleteBeverage={handleDeleteBeverage}
            onUpdateStoreConfig={setStoreConfig}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        beverages={beverages}
        storeConfig={storeConfig}
        offers={INITIAL_OFFERS}
        appliedPromoCode={appliedPromoCode}
        onApplyPromoCode={setAppliedPromoCode}
        activeRewardVoucher={profile.unlockedRewardVoucher}
        useRewardVoucher={useRewardVoucher}
        onToggleRewardVoucher={setUseRewardVoucher}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCart([])}
        onProceedToCheckout={() => navigateTo(PageRoute.CHECKOUT)}
        onBrowseMenu={() => navigateTo(PageRoute.MENU)}
        onOpenRecommender={() => navigateTo(PageRoute.FIND_YOUR_SIP)}
      />

      <SipAssistantWidget
        beverages={beverages}
        offers={INITIAL_OFFERS}
        storeConfig={storeConfig}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-20 right-4 z-50 bg-[#2B1B12] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl border border-[#543827] flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
