import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Beverage, BeverageCategory, PageRoute } from '../types';
import { BeverageCard } from '../components/BeverageCard';

interface MenuPageProps {
  beverages: Beverage[];
  cartMap: Record<string, number>;
  favorites: string[];
  onAddToCart: (beverageId: string, quantity: number) => void;
  onUpdateCartQuantity: (beverageId: string, quantity: number) => void;
  onToggleFavorite: (beverageId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export function MenuPage({
  beverages,
  cartMap,
  favorites,
  onAddToCart,
  onUpdateCartQuantity,
  onToggleFavorite,
  onNavigate,
}: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);

  const categories = ['All', ...Object.values(BeverageCategory)];

  const filteredBeverages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return beverages.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (onlyBestSellers && !item.isBestSeller) return false;
      if (q) {
        const hay = `${item.name} ${item.flavour} ${item.category} ${item.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [beverages, selectedCategory, searchQuery, onlyBestSellers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-semibold text-[#15803D] mb-1.5">
            Freshly Crafted · Core Price ₹50
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B1B12] tracking-tight">
            Our Beverage Menu
          </h1>
          <p className="text-sm sm:text-base text-[#5E4536] mt-1.5 max-w-xl">
            Every cup is shaken to order in 350 ml with honest ingredients and transparent pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(PageRoute.FIND_YOUR_SIP)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[#2B1B12] text-sm font-semibold flex items-center gap-2 self-start md:self-auto whitespace-nowrap transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#EA580C]" />
          <span>Find Your First Sip</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7D6455] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cold coffee, mango, lemon, chocolate..."
              className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-sm text-[#2B1B12] placeholder:text-[#8E7565] focus:outline-none focus:border-[#EA580C]"
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyBestSellers((prev) => !prev)}
            className={`min-h-[44px] px-4 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              onlyBestSellers
                ? 'bg-[#2B1B12] text-white border-[#2B1B12]'
                : 'bg-[#FAF7F2] text-[#5E4536] border-[#EAE2D6] hover:text-[#2B1B12]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Best Sellers Only</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#EA580C] text-white'
                    : 'bg-[#FAF7F2] text-[#5E4536] hover:bg-[#F2ECE1] hover:text-[#2B1B12]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredBeverages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EAE2D6] p-12 text-center">
          <h2 className="text-lg font-bold text-[#2B1B12] mb-2">No matching beverages found</h2>
          <p className="text-sm text-[#5E4536] mb-5">
            Try clearing your search or switching back to all drink categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setOnlyBestSellers(false);
            }}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-sm font-semibold hover:bg-[#C2410C] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeverages.map((beverage) => (
            <BeverageCard
              key={beverage.id}
              beverage={beverage}
              cartQuantity={cartMap[beverage.id] || 0}
              isFavorite={favorites.includes(beverage.id)}
              onAddToCart={onAddToCart}
              onUpdateCartQuantity={onUpdateCartQuantity}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
