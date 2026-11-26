import { FormEvent, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Edit3,
  Plus,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { BASELINE_WEEKLY_SALES } from '../data/seedData';
import {
  Beverage,
  BeverageCategory,
  ContactInquiry,
  FeedbackEntry,
  Order,
  OrderStatus,
  StoreConfig,
} from '../types';

interface AdminDashboardPageProps {
  beverages: Beverage[];
  orders: Order[];
  feedbackList: FeedbackEntry[];
  inquiries: ContactInquiry[];
  storeConfig: StoreConfig;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onSaveBeverage: (beverage: Beverage) => void;
  onDeleteBeverage: (beverageId: string) => void;
  onUpdateStoreConfig: (config: StoreConfig) => void;
}

export function AdminDashboardPage({
  beverages,
  orders,
  feedbackList,
  inquiries,
  storeConfig,
  onUpdateOrderStatus,
  onSaveBeverage,
  onDeleteBeverage,
  onUpdateStoreConfig,
}: AdminDashboardPageProps) {
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'products' | 'feedback'>(
    'overview'
  );
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingBev, setEditingBev] = useState<Beverage | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Product Form State
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('50');
  const [pFlavour, setPFlavour] = useState('');
  const [pCategory, setPCategory] = useState<string>(BeverageCategory.COFFEE);
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState(beverages[0]?.image || '');
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pAvailable, setPAvailable] = useState(true);

  const openAddModal = () => {
    setEditingBev(null);
    setPName('');
    setPPrice('50');
    setPFlavour('Fresh & Balanced');
    setPCategory(BeverageCategory.FRUIT);
    setPDesc('');
    setPImage(beverages[0]?.image || '/src/assets/images/drink_cold_coffee_1795677565168.jpg');
    setPBestSeller(false);
    setPAvailable(true);
    setIsProductModalOpen(true);
  };

  const openEditModal = (bev: Beverage) => {
    setEditingBev(bev);
    setPName(bev.name);
    setPPrice(String(bev.price));
    setPFlavour(bev.flavour);
    setPCategory(bev.category);
    setPDesc(bev.description);
    setPImage(bev.image);
    setPBestSeller(bev.isBestSeller);
    setPAvailable(bev.isAvailable);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    const numericPrice = Math.max(10, Number(pPrice) || 50);
    const saved: Beverage = {
      id: editingBev ? editingBev.id : `bev-${Date.now()}`,
      name: pName.trim(),
      price: numericPrice,
      flavour: pFlavour.trim() || 'Refreshing',
      category: pCategory,
      description: pDesc.trim() || 'Freshly prepared Dehradun signature beverage.',
      image: pImage.trim() || '/src/assets/images/drink_first_sip_special_1795677567461.jpg',
      volumeMl: editingBev?.volumeMl ?? 350,
      prepMinutes: editingBev?.prepMinutes ?? 6,
      isBestSeller: pBestSeller,
      isFeatured: editingBev?.isFeatured ?? false,
      isAvailable: pAvailable,
      tags: editingBev?.tags ?? [pFlavour.toLowerCase(), pCategory.toLowerCase()],
    };
    onSaveBeverage(saved);
    setIsProductModalOpen(false);
  };

  // Computed Analytics
  const liveRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length + 452; // Baseline week + live orders
  const totalSalesAmount = liveRevenue + 26720;
  const uniqueCustomersCount = new Set(orders.map((o) => o.mobile)).size + 312;

  const beverageUnitsMap = useMemo(() => {
    const counts: Record<string, number> = {
      'Classic Cold Coffee': 168,
      'Alphonso Mango Cooler': 124,
      'Dehradun Lemon Refreshment': 112,
      'Signature First Sip Special': 88,
      'Peach & Mint Iced Tea': 96,
      'Dark Choco Chill': 74,
    };
    for (const order of orders) {
      for (const item of order.items) {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
      }
    }
    return Object.entries(counts)
      .map(([name, cups]) => ({
        name: name.replace('Dehradun ', '').replace('Signature ', ''),
        cups,
      }))
      .sort((a, b) => b.cups - a.cups);
  }, [orders]);

  const topDrink = beverageUnitsMap[0]?.name || 'Classic Cold Coffee';

  const weeklyChartData = useMemo(() => {
    const updated = [...BASELINE_WEEKLY_SALES];
    const lastIdx = updated.length - 1;
    updated[lastIdx] = {
      ...updated[lastIdx],
      orders: updated[lastIdx].orders + orders.length,
      revenue: updated[lastIdx].revenue + liveRevenue,
    };
    return updated;
  }, [orders.length, liveRevenue]);

  const filteredOrders =
    statusFilter === 'All' ? orders : orders.filter((o) => o.status === statusFilter);

  const avgRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-20 space-y-8">
      {/* Header + Store Delivery Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#15803D] mb-1">
            Founder Operations Console · Dehradun
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tracking-tight">
            First Sip Admin Dashboard
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE2D6] p-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#EA580C]" />
            <span className="text-xs font-semibold text-[#2B1B12]">Delivery Mode:</span>
            <button
              type="button"
              onClick={() =>
                onUpdateStoreConfig({
                  ...storeConfig,
                  deliveryEnabled: !storeConfig.deliveryEnabled,
                })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                storeConfig.deliveryEnabled
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#F2ECE1] text-[#5E4536]'
              }`}
            >
              {storeConfig.deliveryEnabled ? 'Enabled' : 'Paused (Pickup Only)'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-[#5E4536] font-medium">Fee ₹</label>
            <input
              type="number"
              min={0}
              max={100}
              value={storeConfig.deliveryFee}
              onChange={(e) =>
                onUpdateStoreConfig({
                  ...storeConfig,
                  deliveryFee: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-16 px-2 py-1 rounded-lg border border-[#EAE2D6] bg-[#FAF7F2] text-xs font-mono font-bold text-[#2B1B12] tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#EAE2D6] p-5">
          <div className="flex items-center justify-between text-xs text-[#5E4536] mb-2">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#EA580C]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tabular-nums">
            {totalOrdersCount}
          </p>
          <p className="text-xs text-[#15803D] mt-1 tabular-nums">
            {orders.length} live queue orders
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE2D6] p-5">
          <div className="flex items-center justify-between text-xs text-[#5E4536] mb-2">
            <span>Total Sales</span>
            <TrendingUp className="w-4 h-4 text-[#15803D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tabular-nums">
            ₹{totalSalesAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#5E4536] mt-1 tabular-nums">Avg ticket ₹58 / order</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE2D6] p-5">
          <div className="flex items-center justify-between text-xs text-[#5E4536] mb-2">
            <span>Active Customers</span>
            <Users className="w-4 h-4 text-[#EA580C]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tabular-nums">
            {uniqueCustomersCount}
          </p>
          <p className="text-xs text-[#5E4536] mt-1">Dehradun campuses &amp; offices</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE2D6] p-5">
          <div className="flex items-center justify-between text-xs text-[#5E4536] mb-2">
            <span>Best-Selling Drink</span>
            <span className="text-xs font-mono font-bold text-[#EA580C]">{avgRating}★</span>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#2B1B12] truncate">{topDrink}</p>
          <p className="text-xs text-[#15803D] mt-1 tabular-nums">
            {beverageUnitsMap[0]?.cups ?? 0} cups sold
          </p>
        </div>
      </div>

      {/* Admin Sub-Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Analytics & Charts' },
          { id: 'orders', label: `Order Management (${orders.length})` },
          { id: 'products', label: `Products (${beverages.length})` },
          { id: 'feedback', label: `Feedback & Inquiries (${feedbackList.length + inquiries.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setAdminTab(tab.id as typeof adminTab)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              adminTab === tab.id
                ? 'bg-[#2B1B12] text-white'
                : 'bg-white border border-[#EAE2D6] text-[#5E4536] hover:text-[#2B1B12]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Charts */}
      {adminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAE2D6] p-6">
            <h2 className="text-base font-bold text-[#2B1B12] mb-1">Weekly Revenue (₹)</h2>
            <p className="text-xs text-[#5E4536] mb-5">
              Daily sales across Dehradun kiosks including today&apos;s live orders
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE2D6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#5E4536' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5E4536' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EAE2D6',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue (₹)" fill="#EA580C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE2D6] p-6">
            <h2 className="text-base font-bold text-[#2B1B12] mb-1">Top Beverages (Cups Sold)</h2>
            <p className="text-xs text-[#5E4536] mb-5">Unit volume ranking across menu items</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={beverageUnitsMap} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE2D6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#5E4536' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 11, fill: '#2B1B12' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #EAE2D6',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="cups" name="Cups Sold" fill="#15803D" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Order Management */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#EAE2D6] overflow-hidden">
          <div className="p-5 border-b border-[#EAE2D6] flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#2B1B12]">Live Order Queue</h2>
            <div className="flex flex-wrap gap-1.5">
              {['All', ...Object.values(OrderStatus)].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#EA580C] text-white'
                      : 'bg-[#FAF7F2] text-[#5E4536] hover:text-[#2B1B12]'
                  }`}
                >
                  {st === OrderStatus.READY ? 'Ready / Out' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF7F2] border-b border-[#EAE2D6] text-xs text-[#5E4536]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D6]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#2B1B12]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#2B1B12]">{order.customerName}</p>
                      <p className="text-xs text-[#5E4536] tabular-nums">{order.mobile}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5E4536] max-w-xs">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5E4536]">
                      {order.pickupHub ? `Pickup: ${order.pickupHub}` : `Delivery: ${order.deliveryAddress}`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#2B1B12] tabular-nums">
                      ₹{order.total}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#EAE2D6] bg-white text-xs font-semibold text-[#2B1B12]"
                      >
                        {Object.values(OrderStatus).map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Product Management */}
      {adminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2B1B12]">Beverage Catalog</h2>
            <button
              type="button"
              onClick={openAddModal}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Drink</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAE2D6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF7F2] border-b border-[#EAE2D6] text-xs text-[#5E4536]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Drink</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Flavour</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D6]">
                  {beverages.map((bev) => (
                    <tr key={bev.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="py-3.5 px-4 font-semibold text-[#2B1B12]">{bev.name}</td>
                      <td className="py-3.5 px-4 text-xs text-[#5E4536]">{bev.category}</td>
                      <td className="py-3.5 px-4 text-xs text-[#5E4536]">{bev.flavour}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2B1B12] tabular-nums">
                        ₹{bev.price}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span
                          className={`font-semibold ${
                            bev.isAvailable ? 'text-[#15803D]' : 'text-[#DC2626]'
                          }`}
                        >
                          {bev.isAvailable ? 'Available' : 'Paused'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(bev)}
                            aria-label={`Edit ${bev.name}`}
                            className="p-2 rounded-lg border border-[#EAE2D6] hover:bg-[#FAF7F2] text-[#2B1B12]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteBeverage(bev.id)}
                            aria-label={`Delete ${bev.name}`}
                            className="p-2 rounded-lg border border-[#EAE2D6] hover:bg-[#FEF2F2] text-[#DC2626]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Customer Feedback & Inquiries */}
      {adminTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-4">
            <h2 className="text-base font-bold text-[#2B1B12]">
              Customer Ratings ({feedbackList.length})
            </h2>
            <div className="divide-y divide-[#EAE2D6]">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2B1B12]">{fb.beverageName}</span>
                    <span className="font-bold text-[#EA580C] tabular-nums">{fb.rating} / 5 ★</span>
                  </div>
                  <p className="text-sm text-[#5E4536]">&ldquo;{fb.comment}&rdquo;</p>
                  <p className="text-xs text-[#7D6455]">{fb.customerName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EAE2D6] p-6 space-y-4">
            <h2 className="text-base font-bold text-[#2B1B12]">
              Contact Inquiries ({inquiries.length})
            </h2>
            <div className="divide-y divide-[#EAE2D6]">
              {inquiries.map((inq) => (
                <div key={inq.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2B1B12]">{inq.topic}</span>
                    <span className="text-[#5E4536]">{inq.contact}</span>
                  </div>
                  <p className="text-sm text-[#5E4536]">{inq.message}</p>
                  <p className="text-xs text-[#7D6455]">From {inq.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Beverage Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1B12]/45 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE2D6] w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2B1B12]">
                {editingBev ? `Edit ${editingBev.name}` : 'Add New Beverage'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl border border-[#EAE2D6] text-[#5E4536]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                    Drink Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                    Category
                  </label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                  >
                    {Object.values(BeverageCategory).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                    Flavour Profile
                  </label>
                  <input
                    type="text"
                    value={pFlavour}
                    onChange={(e) => setPFlavour(e.target.value)}
                    placeholder="e.g., Zesty & Minty"
                    className="w-full min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1B12]">
                  <input
                    type="checkbox"
                    checked={pBestSeller}
                    onChange={(e) => setPBestSeller(e.target.checked)}
                    className="accent-[#EA580C]"
                  />
                  <span>Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2B1B12]">
                  <input
                    type="checkbox"
                    checked={pAvailable}
                    onChange={(e) => setPAvailable(e.target.checked)}
                    className="accent-[#15803D]"
                  />
                  <span>In Stock Today</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE2D6] text-xs font-semibold text-[#5E4536]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold"
                >
                  {editingBev ? 'Save Changes' : 'Add Beverage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
