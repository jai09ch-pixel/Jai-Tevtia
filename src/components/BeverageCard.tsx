import { useState } from 'react';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Beverage } from '../types';
import { BeverageImage } from './BeverageImage';

interface BeverageCardProps {
  beverage: Beverage;
  cartQuantity: number;
  isFavorite: boolean;
  onAddToCart: (beverageId: string, quantity: number) => void;
  onUpdateCartQuantity: (beverageId: string, quantity: number) => void;
  onToggleFavorite: (beverageId: string) => void;
}

export function BeverageCard({
  beverage,
  cartQuantity,
  isFavorite,
  onAddToCart,
  onUpdateCartQuantity,
  onToggleFavorite,
}: BeverageCardProps) {
  const [pendingQty, setPendingQty] = useState(1);

  return (
    <article className="group bg-white rounded-2xl border border-[#EAE2D6] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#2B1B12]/5">
      <div className="relative aspect-[4/3] w-full bg-[#F2ECE1] overflow-hidden">
        <BeverageImage
          src={beverage.image}
          alt={beverage.name}
          className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(beverage.id)}
          aria-label={isFavorite ? `Remove ${beverage.name} from favorites` : `Save ${beverage.name} to favorites`}
          className="absolute top-3 right-3 min-h-[40px] min-w-[40px] rounded-xl bg-white/90 backdrop-blur-sm border border-[#EAE2D6] flex items-center justify-center text-[#2B1B12] hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-[#EA580C]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#EA580C] text-[#EA580C]' : 'text-[#5E4536]'
            }`}
          />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5E4536] mb-1.5">
          <span className="truncate">
            {beverage.category} · {beverage.flavour}
          </span>
          {beverage.isBestSeller && (
            <span className="font-semibold text-[#15803D] whitespace-nowrap shrink-0">
              Best Seller
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-[#2B1B12] leading-snug">{beverage.name}</h3>
          <span className="text-lg font-bold text-[#2B1B12] tabular-nums shrink-0">
            ₹{beverage.price}
          </span>
        </div>

        <p className="text-sm text-[#5E4536] leading-relaxed line-clamp-2 mb-4 flex-1">
          {beverage.description}
        </p>

        <div className="text-xs text-[#7D6455] mb-4 tabular-nums">
          {beverage.volumeMl} ml · Ready in {beverage.prepMinutes} min · +{Math.max(1, Math.floor(beverage.price / 10))} pts
        </div>

        {!beverage.isAvailable ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-[#F2ECE1] text-[#5E4536] text-sm font-medium text-center">
            Sold Out Today
          </div>
        ) : cartQuantity > 0 ? (
          <div className="flex items-center justify-between gap-2 bg-[#FAF7F2] border border-[#EAE2D6] rounded-xl p-1">
            <button
              type="button"
              onClick={() => onUpdateCartQuantity(beverage.id, cartQuantity - 1)}
              aria-label={`Decrease ${beverage.name} quantity`}
              className="min-h-[40px] min-w-[40px] rounded-lg bg-white border border-[#EAE2D6] flex items-center justify-center text-[#2B1B12] hover:bg-[#F2ECE1] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#2B1B12] tabular-nums whitespace-nowrap">
              {cartQuantity} in bag
            </span>
            <button
              type="button"
              onClick={() => onUpdateCartQuantity(beverage.id, cartQuantity + 1)}
              aria-label={`Increase ${beverage.name} quantity`}
              className="min-h-[40px] min-w-[40px] rounded-lg bg-[#EA580C] text-white flex items-center justify-center hover:bg-[#C2410C] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#EAE2D6] rounded-xl bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => setPendingQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity to add"
                className="min-h-[42px] min-w-[36px] flex items-center justify-center text-[#5E4536] hover:text-[#2B1B12]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-[#2B1B12] tabular-nums">
                {pendingQty}
              </span>
              <button
                type="button"
                onClick={() => setPendingQty((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity to add"
                className="min-h-[42px] min-w-[36px] flex items-center justify-center text-[#5E4536] hover:text-[#2B1B12]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddToCart(beverage.id, pendingQty);
                setPendingQty(1);
              }}
              className="flex-1 min-h-[42px] px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Add · ₹{beverage.price * pendingQty}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
