import { ArrowRight, Check, Clock, Compass, Copy, Flame, Leaf, Sparkles, Wallet } from 'lucide-react';
import { useState } from 'react';
import { HERO_IMAGE } from '../data/seedData';
import { Beverage, FeedbackEntry, PageRoute, PromoOffer } from '../types';
import { BeverageCard } from '../components/BeverageCard';
import { BeverageImage } from '../components/BeverageImage';

interface HomePageProps {
  beverages: Beverage[];
  offers: PromoOffer[];
  feedbackList: FeedbackEntry[];
  cartMap: Record<string, number>;
  favorites: string[];
  onAddToCart: (beverageId: string, quantity: number) => void;
  onUpdateCartQuantity: (beverageId: string, quantity: number) => void;
  onToggleFavorite: (beverageId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export function HomePage({
  beverages,
  offers,
  feedbackList,
  cartMap,
  favorites,
  onAddToCart,
  onUpdateCartQuantity,
  onToggleFavorite,
  onNavigate,
}: HomePageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const bestSellers = beverages.filter((b) => b.isBestSeller || b.isFeatured).slice(0, 3);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Split Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2">
            <p className="text-xs sm:text-sm font-semibold text-[#15803D] mb-3 tracking-wide">
              Dehradun · Handcrafted Everyday Refreshment · ₹40–₹70
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-[#2B1B12] leading-[1.08] tracking-tight mb-5"
              style={{ textWrap: 'balance' }}
            >
              Your Break. Your Refreshment. Your First Sip.
            </h1>
            <p className="text-base sm:text-lg text-[#5E4536] leading-relaxed max-w-xl mb-8">
              Café-grade cold coffee, crisp Assam iced teas, and real fruit coolers crafted for
              Dehradun college breaks and workday resets—at an honest ₹50 core price.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="min-h-[48px] px-7 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors active:scale-[0.98] whitespace-nowrap"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#2B1B12] border border-[#EAE2D6] font-semibold text-sm sm:text-base transition-colors whitespace-nowrap"
              >
                Explore Our Drinks
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] sm:min-h-[360px] rounded-3xl overflow-hidden border border-[#EAE2D6] bg-[#F2ECE1]">
              <BeverageImage
                src={HERO_IMAGE}
                alt="First Sip chilled cold coffee, mango cooler, and citrus iced tea in Dehradun"
                className="w-full h-full lg:h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-[#2B1B12]/80 via-[#2B1B12]/35 to-transparent text-white flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-[#FAF7F2]/85 mb-0.5">
                    Rajpur Road · Clement Town · Prem Nagar
                  </p>
                  <p className="text-sm sm:text-base font-bold">
                    Freshly shaken in 8 mins · Average price ₹50
                  </p>
                </div>
                <span className="text-xs font-mono bg-[#EA580C] text-white px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">
                  1 pt / ₹10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Pillar Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 sm:p-5">
            <Wallet className="w-5 h-5 text-[#EA580C] mb-2.5" />
            <h2 className="text-sm sm:text-base font-bold text-[#2B1B12] mb-1">₹50 Core Price</h2>
            <p className="text-xs sm:text-sm text-[#5E4536] leading-snug">
              Save 70% compared to ₹200+ café chains every single day.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 sm:p-5">
            <Flame className="w-5 h-5 text-[#EA580C] mb-2.5" />
            <h2 className="text-sm sm:text-base font-bold text-[#2B1B12] mb-1">Bold Real Taste</h2>
            <p className="text-xs sm:text-sm text-[#5E4536] leading-snug">
              Roasted Arabica, Assam tea leaves, and real fruit pulp—never syrupy.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 sm:p-5">
            <Clock className="w-5 h-5 text-[#15803D] mb-2.5" />
            <h2 className="text-sm sm:text-base font-bold text-[#2B1B12] mb-1">8-Min Express Prep</h2>
            <p className="text-xs sm:text-sm text-[#5E4536] leading-snug">
              Skip lecture-break lines with instant campus pickup or doorstep delivery.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE2D6] p-4 sm:p-5">
            <Leaf className="w-5 h-5 text-[#15803D] mb-2.5" />
            <h2 className="text-sm sm:text-base font-bold text-[#2B1B12] mb-1">Rewards Every Sip</h2>
            <p className="text-xs sm:text-sm text-[#5E4536] leading-snug">
              Earn 1 point per ₹10 spent and unlock a free drink at 50 points.
            </p>
          </div>
        </div>
      </section>

      {/* Promotional Offers Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2B1B12] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#FDBA74] mb-1.5">
              Dehradun Launch Offers · Valid Today
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Stretch your pocket money further
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:max-w-2xl w-full">
            {offers.map((offer) => (
              <div
                key={offer.code}
                className="bg-[#3B261A] border border-[#543827] rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{offer.title}</p>
                  <p className="text-xs text-[#E7D8C9] mt-0.5 line-clamp-1">
                    {offer.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(offer.code)}
                  className="px-3 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{offer.code}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#EA580C] mb-1.5">
              Campus Favourites
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tracking-tight">
              Best sellers in Dehradun right now
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(PageRoute.MENU)}
            className="text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            <span>See all {beverages.length} drinks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((beverage) => (
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
      </section>

      {/* AI Recommender Callout + Student Voices (Claim-to-Proof Adjacency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE2D6] p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFF3EB] text-[#EA580C] flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#15803D] mb-2">
              Personalized Taste Match
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1B12] tracking-tight mb-3">
              Not sure what to sip?
            </h2>
            <p className="text-sm sm:text-base text-[#5E4536] leading-relaxed mb-6">
              Take our 15-second &ldquo;Find Your First Sip&rdquo; quiz. Pick your mood, flavour
              craving, and drink base for an instant match from today&apos;s menu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(PageRoute.FIND_YOUR_SIP)}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 text-[#FDBA74]" />
            <span>Launch Find Your First Sip</span>
          </button>
        </div>

        <div className="lg:col-span-7 bg-[#F2ECE1] rounded-3xl border border-[#EAE2D6] p-7 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#5E4536] mb-1">
                Verified Campus & Workday Reviews
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2B1B12]">
                What Dehradun sips say
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(PageRoute.CONTACT)}
              className="text-xs font-semibold text-[#EA580C] hover:underline whitespace-nowrap"
            >
              Rate a drink
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedbackList.slice(0, 2).map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-2xl border border-[#EAE2D6] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#EA580C] mb-2 tabular-nums">
                    {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} · {fb.beverageName}
                  </div>
                  <p className="text-sm text-[#2B1B12] leading-relaxed mb-4">
                    &ldquo;{fb.comment}&rdquo;
                  </p>
                </div>
                <p className="text-xs font-medium text-[#5E4536]">{fb.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
