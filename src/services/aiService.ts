import { Beverage, PromoOffer } from '../types';

export interface RecommendationRequest {
  flavour: string;
  mood: string;
  base: string;
  menuItems: Beverage[];
}

export interface RecommendationResult {
  beverage: Beverage;
  reason: string;
  pairingTip: string;
  mode: 'ai' | 'demo';
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

function localMatchRecommendation(req: RecommendationRequest): RecommendationResult {
  const { flavour, mood, base, menuItems } = req;
  const available = menuItems.filter((item) => item.isAvailable);
  const pool = available.length > 0 ? available : menuItems;

  const flavourLower = flavour.toLowerCase();
  const moodLower = mood.toLowerCase();
  const baseLower = base.toLowerCase();

  let best = pool[0];
  let bestScore = -1;

  for (const item of pool) {
    let score = 0;
    const text = `${item.name} ${item.category} ${item.flavour} ${item.description} ${item.tags.join(' ')}`.toLowerCase();

    if (baseLower.includes('coffee') && (item.category.toLowerCase().includes('coffee') || text.includes('espresso'))) {
      score += 5;
    }
    if (baseLower.includes('tea') && item.category.toLowerCase().includes('tea')) {
      score += 5;
    }
    if (baseLower.includes('fruit') && (item.category.toLowerCase().includes('fruit') || item.category.toLowerCase().includes('citrus') || text.includes('mango') || text.includes('lemon'))) {
      score += 5;
    }
    if (baseLower.includes('something else') && (item.category.toLowerCase().includes('chocolate') || item.category.toLowerCase().includes('signature'))) {
      score += 5;
    }

    if (text.includes(flavourLower)) score += 3;
    if (text.includes(moodLower)) score += 2;
    if (flavourLower === 'creamy' && (text.includes('coffee') || text.includes('choco'))) score += 3;
    if (flavourLower === 'refreshing' && (text.includes('lemon') || text.includes('tea') || text.includes('citrus'))) score += 3;
    if (flavourLower === 'fruity' && (text.includes('mango') || text.includes('peach') || text.includes('orange'))) score += 3;
    if (flavourLower === 'sweet' && (text.includes('mango') || text.includes('choco') || text.includes('coffee'))) score += 2;

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  const moodCopy: Record<string, string> = {
    'study break': 'built to reset your focus between lectures or late-night notes without draining your wallet',
    energetic: 'crafted to give you a crisp lift before classes, deadlines, or an evening walk down Rajpur Road',
    relaxing: 'made for slowing down with friends after a long day in Dehradun',
    fun: 'bright, bold, and made for hanging out on campus or catching up at the kiosk',
  };

  return {
    beverage: best,
    reason: `Your ${flavour.toLowerCase()} craving and ${mood.toLowerCase()} mood point straight to ${best.name} (₹${best.price}). It is ${moodCopy[moodLower] || 'packed with fresh flavour at our signature ₹50 everyday value range'}.`,
    pairingTip: `Ready in ${best.prepMinutes} minutes and earns you ${Math.max(1, Math.floor(best.price / 10))} First Sip loyalty points.`,
    mode: 'demo',
  };
}

export async function getBeverageRecommendation(
  req: RecommendationRequest
): Promise<RecommendationResult> {
  const response = await fetch('/api/ai/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flavour: req.flavour,
      mood: req.mood,
      base: req.base,
      menuItems: req.menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        category: m.category,
        flavour: m.flavour,
        description: m.description,
      })),
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || 'Could not generate recommendation.');
  }

  const data = (await response.json()) as {
    mode: 'ai' | 'demo';
    recommendedId?: string;
    reason?: string;
    pairingTip?: string;
  };

  if (data.mode === 'demo' || !data.recommendedId) {
    return localMatchRecommendation(req);
  }

  const matched =
    req.menuItems.find((m) => m.id === data.recommendedId) ?? localMatchRecommendation(req).beverage;

  return {
    beverage: matched,
    reason:
      data.reason ||
      `We matched your ${req.flavour.toLowerCase()} taste and ${req.mood.toLowerCase()} mood with ${matched.name}.`,
    pairingTip: data.pairingTip || `Freshly prepared in ${matched.prepMinutes} minutes.`,
    mode: 'ai',
  };
}

function localChatReply(
  message: string,
  menuItems: Beverage[],
  offers: PromoOffer[],
  deliveryEnabled: boolean,
  deliveryFee: number
): string {
  const q = message.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('cheap') || q.includes('50') || q.includes('menu')) {
    const list = menuItems.map((m) => `${m.name} (₹${m.price})`).join(', ');
    return `Our drinks are priced between ₹40 and ₹70, centered around our ₹50 sweet spot! Right now we serve: ${list}.`;
  }

  if (q.includes('offer') || q.includes('discount') || q.includes('code') || q.includes('promo')) {
    const offerStr = offers.map((o) => `${o.code} (${o.title})`).join(' and ');
    return `We have active Dehradun launch offers! Try ${offerStr} right inside your Bag before checkout.`;
  }

  if (q.includes('loyalty') || q.includes('point') || q.includes('reward') || q.includes('free')) {
    return `You earn 1 point for every ₹10 spent! Collect 50 points to unlock a Free Classic Drink (₹50 value), or redeem 30 points for ₹20 off. Plus, referring a friend adds 25 bonus points.`;
  }

  if (q.includes('order') || q.includes('deliver') || q.includes('pickup') || q.includes('how')) {
    const deliveryText = deliveryEnabled
      ? `Delivery is live across Dehradun for ₹${deliveryFee} (free above ₹149), or pick up in 8 mins.`
      : `Delivery is currently paused by the store, so Pickup is active at our Dehradun kiosks.`;
    return `Ordering takes under a minute: add drinks from the Menu, open your Bag, pick Pickup or Delivery, and choose UPI, Cash, or Demo Online Payment. ${deliveryText}`;
  }

  if (q.includes('study') || q.includes('coffee') || q.includes('recommend') || q.includes('best')) {
    return `For a study break, our Classic Cold Coffee (₹50) is our #1 campus best seller! If you want something zesty and non-dairy, try the Dehradun Lemon Refreshment (₹40) or Signature First Sip Special (₹70).`;
  }

  if (q.includes('dehradun') || q.includes('about') || q.includes('who') || q.includes('where')) {
    return `First Sip was born in Dehradun for college students and young professionals who want café-grade refreshment at ₹50 instead of ₹200+. Find our pickup hubs at Rajpur Road, Clement Town (Graphic Era Gate), and Prem Nagar (UPES)!`;
  }

  return `Hey! I'm Sip Assistant. Ask me about our ₹40–₹70 drinks, student promo codes like CAMPUS20, loyalty rewards, or where to grab your First Sip in Dehradun!`;
}

export async function sendSipAssistantMessage(params: {
  message: string;
  history: ChatTurn[];
  menuItems: Beverage[];
  offers: PromoOffer[];
  deliveryEnabled: boolean;
  deliveryFee: number;
}): Promise<{ reply: string; mode: 'ai' | 'demo' }> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: params.message,
      history: params.history,
      menuItems: params.menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        category: m.category,
        flavour: m.flavour,
        description: m.description,
      })),
      offers: params.offers,
      deliveryEnabled: params.deliveryEnabled,
      deliveryFee: params.deliveryFee,
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || 'Sip Assistant failed to respond.');
  }

  const data = (await response.json()) as { mode: 'ai' | 'demo'; reply?: string };
  if (data.mode === 'demo' || !data.reply) {
    return {
      mode: 'demo',
      reply: localChatReply(
        params.message,
        params.menuItems,
        params.offers,
        params.deliveryEnabled,
        params.deliveryFee
      ),
    };
  }

  return { mode: 'ai', reply: data.reply };
}
