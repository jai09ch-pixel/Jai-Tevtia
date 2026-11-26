import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import { getBeverageRecommendation, RecommendationResult } from '../services/aiService';
import { Beverage, PageRoute } from '../types';
import { BeverageImage } from '../components/BeverageImage';

interface FindYourSipPageProps {
  beverages: Beverage[];
  onAddToCart: (beverageId: string, quantity: number) => void;
  onOpenCart: () => void;
  onNavigate: (page: PageRoute) => void;
}

const FLAVOUR_OPTIONS = ['Sweet', 'Fruity', 'Creamy', 'Refreshing'];
const MOOD_OPTIONS = ['Study Break', 'Energetic', 'Relaxing', 'Fun'];
const BASE_OPTIONS = ['Coffee', 'Tea', 'Fruit-Based', 'Something Else'];

export function FindYourSipPage({
  beverages,
  onAddToCart,
  onOpenCart,
  onNavigate,
}: FindYourSipPageProps) {
  const [flavour, setFlavour] = useState<string>('Creamy');
  const [mood, setMood] = useState<string>('Study Break');
  const [base, setBase] = useState<string>('Coffee');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [addedToBag, setAddedToBag] = useState(false);

  const handleRecommend = async () => {
    setIsLoading(true);
    setError(null);
    setAddedToBag(false);
    try {
      const rec = await getBeverageRecommendation({
        flavour,
        mood,
        base,
        menuItems: beverages,
      });
      setResult(rec);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong getting your match.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-semibold text-[#15803D] mb-1.5">
          AI Taste Match · Instant Recommendation
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B1B12] tracking-tight mb-3">
          Find Your First Sip
        </h1>
        <p className="text-sm sm:text-base text-[#5E4536] leading-relaxed">
          Tell us what you are craving right now, and we will match you with the ideal First Sip
          drink from our Dehradun menu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quiz Panel */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE2D6] p-6 sm:p-7 space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#2B1B12] mb-3">
              01. What flavour do you prefer?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {FLAVOUR_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFlavour(opt)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    flavour === opt
                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                      : 'bg-[#FAF7F2] text-[#2B1B12] border-[#EAE2D6] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2B1B12] mb-3">
              02. What is your mood right now?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMood(opt)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    mood === opt
                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                      : 'bg-[#FAF7F2] text-[#2B1B12] border-[#EAE2D6] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2B1B12] mb-3">
              03. What drink base sounds best?
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {BASE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBase(opt)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                    base === opt
                      ? 'bg-[#EA580C] text-white border-[#EA580C]'
                      : 'bg-[#FAF7F2] text-[#2B1B12] border-[#EAE2D6] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleRecommend}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Matching your flavour...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FDBA74]" />
                <span>Reveal My First Sip</span>
              </>
            )}
          </button>

          {error && (
            <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3.5 text-xs text-[#B91C1C]">
              {error}
            </div>
          )}
        </div>

        {/* Recommendation Result */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="bg-white rounded-3xl border border-[#EAE2D6] overflow-hidden">
              <div className="aspect-[4/3] bg-[#F2ECE1] relative">
                <BeverageImage
                  src={result.beverage.image}
                  alt={result.beverage.name}
                  className="w-full h-full"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className="text-[#15803D]">
                    {result.mode === 'ai' ? 'Gemini AI Match' : 'Smart Taste Match'} ·{' '}
                    {result.beverage.flavour}
                  </span>
                  <span className="text-[#5E4536] tabular-nums">
                    {result.beverage.volumeMl} ml · {result.beverage.prepMinutes} min
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-extrabold text-[#2B1B12]">
                    {result.beverage.name}
                  </h2>
                  <span className="text-2xl font-extrabold text-[#EA580C] tabular-nums">
                    ₹{result.beverage.price}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#2B1B12] leading-relaxed">
                  {result.reason}
                </p>

                <p className="text-xs text-[#5E4536] bg-[#FAF7F2] rounded-xl p-3.5 border border-[#EAE2D6]">
                  {result.pairingTip}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(result.beverage.id, 1);
                      setAddedToBag(true);
                    }}
                    className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {addedToBag ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag · ₹{result.beverage.price}</span>
                      </>
                    )}
                  </button>

                  {addedToBag ? (
                    <button
                      type="button"
                      onClick={onOpenCart}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#2B1B12] text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <span>Open Bag</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRecommend}
                      className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[#2B1B12] font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Re-Match</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F2ECE1] rounded-3xl border border-[#EAE2D6] p-8 sm:p-10 text-center min-h-[380px] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#EA580C] flex items-center justify-center mb-4 border border-[#EAE2D6]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-[#2B1B12] mb-2">
                Your match appears here
              </h2>
              <p className="text-sm text-[#5E4536] max-w-sm leading-relaxed mb-6">
                Pick your preferred flavour, mood, and base on the left, then click{' '}
                <strong className="text-[#2B1B12]">Reveal My First Sip</strong>.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(PageRoute.MENU)}
                className="text-xs font-semibold text-[#EA580C] hover:underline"
              >
                Or browse all drinks directly →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
