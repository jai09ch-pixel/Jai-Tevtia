import { Check, CheckCircle2, Clock, MapPin, RefreshCw, Store } from 'lucide-react';
import { FulfillmentType, Order, OrderStatus, PageRoute } from '../types';
import { BeverageImage } from '../components/BeverageImage';

interface OrderConfirmationPageProps {
  order: Order | null;
  onAdvanceStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onNavigate: (page: PageRoute) => void;
}

const STATUS_STEPS: OrderStatus[] = [
  OrderStatus.RECEIVED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.COMPLETED,
];

export function OrderConfirmationPage({
  order,
  onAdvanceStatus,
  onNavigate,
}: OrderConfirmationPageProps) {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-[#2B1B12] mb-2">No active order selected</h1>
        <p className="text-sm text-[#5E4536] mb-6">
          Place an order from the menu or select any previous order in your Dashboard.
        </p>
        <button
          type="button"
          onClick={() => onNavigate(PageRoute.MENU)}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#EA580C] text-white text-sm font-semibold"
        >
          Order a Drink
        </button>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(order.status);
  const nextStatus =
    currentIdx >= 0 && currentIdx < STATUS_STEPS.length - 1
      ? STATUS_STEPS[currentIdx + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20 space-y-8">
      <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D6]">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#15803D] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#15803D] mb-1">
                Order Confirmed · +{order.pointsEarned} Loyalty Points Earned
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tabular-nums">
                Order {order.orderNumber}
              </h1>
              <p className="text-xs text-[#5E4536] mt-1">
                Placed by {order.customerName} · {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl border border-[#EAE2D6] px-4 py-3 flex items-center gap-3 shrink-0">
            <Clock className="w-5 h-5 text-[#EA580C]" />
            <div>
              <p className="text-xs text-[#5E4536]">Estimated Time</p>
              <p className="text-sm font-bold text-[#2B1B12] tabular-nums">
                {order.estimatedMinutes}–{order.estimatedMinutes + 4} mins
              </p>
            </div>
          </div>
        </div>

        {/* Live 4-Step Order Status Tracker */}
        <div className="py-7 border-b border-[#EAE2D6]">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-base font-bold text-[#2B1B12]">Live Order Status</h2>
            {nextStatus && (
              <button
                type="button"
                onClick={() => onAdvanceStatus(order.id, nextStatus)}
                className="text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7ED] border border-[#FED7AA]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate Next Step</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {STATUS_STEPS.map((step, index) => {
              const reached = index <= currentIdx;
              const isCurrent = index === currentIdx;
              const label =
                step === OrderStatus.READY
                  ? order.fulfillmentType === FulfillmentType.PICKUP
                    ? 'Ready for Pickup'
                    : 'Out for Delivery'
                  : step;
              return (
                <div
                  key={step}
                  className={`rounded-2xl p-4 border transition-colors ${
                    isCurrent
                      ? 'bg-[#FFF7ED] border-[#EA580C]'
                      : reached
                      ? 'bg-[#ECFDF3] border-[#BBF7D0]'
                      : 'bg-[#FAF7F2] border-[#EAE2D6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#5E4536]">
                      0{index + 1}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        reached ? 'bg-[#15803D] text-white' : 'bg-[#EAE2D6] text-[#5E4536]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#2B1B12]">{label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment & Items */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D6] p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#2B1B12]">
              {order.fulfillmentType === FulfillmentType.PICKUP ? (
                <>
                  <Store className="w-4 h-4 text-[#EA580C]" />
                  <span>Pickup Location</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#EA580C]" />
                  <span>Delivery Address</span>
                </>
              )}
            </div>
            <p className="text-sm text-[#5E4536] leading-relaxed">
              {order.fulfillmentType === FulfillmentType.PICKUP
                ? order.pickupHub
                : order.deliveryAddress}
            </p>
            <div className="pt-2 border-t border-[#EAE2D6] text-xs text-[#5E4536] tabular-nums">
              Contact: +91 {order.mobile}
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-[#2B1B12]">Items Ordered</h3>
            <div className="divide-y divide-[#EAE2D6] border border-[#EAE2D6] rounded-2xl px-4">
              {order.items.map((item) => (
                <div key={item.beverageId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <BeverageImage
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2B1B12] truncate">
                        {item.quantity} × {item.name}
                      </p>
                      <p className="text-xs text-[#5E4536] tabular-nums">₹{item.price} each</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#2B1B12] tabular-nums">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-base font-extrabold text-[#2B1B12]">
              <span>Total Amount</span>
              <span className="tabular-nums">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate(PageRoute.DASHBOARD)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#2B1B12] text-white text-sm font-semibold hover:bg-[#3F291C]"
          >
            View Loyalty & Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigate(PageRoute.MENU)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-[#2B1B12] text-sm font-semibold hover:bg-[#F2ECE1]"
          >
            Order More Drinks
          </button>
        </div>
      </div>
    </div>
  );
}
