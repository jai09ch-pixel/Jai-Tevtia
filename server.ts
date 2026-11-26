import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface MenuItemSummary {
  id: string;
  name: string;
  price: number;
  category: string;
  flavour: string;
  description: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // AI Beverage Recommender: "Find Your First Sip"
  app.post('/api/ai/recommend', async (req, res) => {
    const { flavour, mood, base, menuItems } = req.body as {
      flavour?: string;
      mood?: string;
      base?: string;
      menuItems?: MenuItemSummary[];
    };

    if (!flavour || !mood || !base || !Array.isArray(menuItems) || menuItems.length === 0) {
      res.status(400).json({ error: 'Please select flavour, mood, and drink base.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ mode: 'demo' });
      return;
    }

    try {
      const catalogText = menuItems
        .map(
          (item) =>
            `- ID: "${item.id}" | Name: ${item.name} | Price: ₹${item.price} | Category: ${item.category} | Flavour: ${item.flavour} | Description: ${item.description}`
        )
        .join('\n');

      const prompt = `A First Sip customer in Dehradun answered our "Find Your First Sip" quiz:
- Preferred flavour: ${flavour}
- Current mood: ${mood}
- Preferred base: ${base}

Available Menu:
${catalogText}

Pick the single best beverage ID from the Available Menu above. Write a friendly, youthful 2-sentence explanation referencing their mood and Dehradun campus/work break vibe, and a short 1-sentence pairing or custom tip.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the beverage curator for First Sip, an affordable youth-focused beverage brand in Dehradun (average price ₹50). Always select an exact ID from the provided menu.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedId: {
                type: Type.STRING,
                description: 'Exact ID of the recommended menu beverage.',
              },
              reason: {
                type: Type.STRING,
                description: 'Friendly 2-sentence explanation tailored to the customer answers.',
              },
              pairingTip: {
                type: Type.STRING,
                description: 'Short 1-sentence refreshment tip or moment suggestion.',
              },
            },
            required: ['recommendedId', 'reason', 'pairingTip'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({
        mode: 'ai',
        recommendedId: parsed.recommendedId,
        reason: parsed.reason,
        pairingTip: parsed.pairingTip,
      });
    } catch (error) {
      console.error('Gemini recommend error:', error);
      res.status(502).json({
        error: 'Unable to reach AI recommendation service right now.',
      });
    }
  });

  // AI Chatbot: "Sip Assistant"
  app.post('/api/ai/chat', async (req, res) => {
    const { message, history, menuItems, offers, deliveryEnabled, deliveryFee } = req.body as {
      message?: string;
      history?: Array<{ role: 'user' | 'assistant'; text: string }>;
      menuItems?: MenuItemSummary[];
      offers?: Array<{ code: string; title: string; description: string }>;
      deliveryEnabled?: boolean;
      deliveryFee?: number;
    };

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ mode: 'demo' });
      return;
    }

    try {
      const menuText = (menuItems ?? [])
        .map((m) => `${m.name} (₹${m.price}, ${m.category}, ${m.flavour}): ${m.description}`)
        .join('\n');

      const offersText = (offers ?? [])
        .map((o) => `Code ${o.code}: ${o.title} — ${o.description}`)
        .join('\n');

      const historyText = (history ?? [])
        .slice(-6)
        .map((h) => `${h.role === 'user' ? 'Customer' : 'Sip Assistant'}: ${h.text}`)
        .join('\n');

      const systemInstruction = `You are "Sip Assistant", the friendly, upbeat AI helper for First Sip — an affordable beverage startup in Dehradun, Uttarakhand built for college students (18-24) and young professionals (18-30).
Tagline: "Your Break. Your Refreshment. Your First Sip."
Core target price: ₹50 per drink (menu spans ₹40–₹70).

Live Menu:
${menuText}

Current Offers:
${offersText}

Loyalty Program:
- Earn 1 point per ₹10 spent.
- 50 points = Free Classic Drink (₹50 value).
- 30 points = ₹20 Off any order.
- Referral bonus: +25 points when a friend orders with your code.

Ordering & Delivery:
- Pickup hubs in Dehradun: Rajpur Road Flagship Kiosk, Clement Town (Graphic Era Gate), and Prem Nagar (UPES Express Point).
- Delivery is currently ${deliveryEnabled ? `enabled (₹${deliveryFee ?? 15} fee, free above ₹149)` : 'paused (Pickup only today)'}.
- Average prep time: 8–12 minutes.
- Payment methods: UPI (GPay/PhonePe/Paytm demo), Cash, and Demo Online Payment.

Style rules: Keep replies concise (2-4 sentences), warm, youthful, and practical. Never invent menu items or prices that are not listed above.`;

      const contents = historyText
        ? `Previous conversation:\n${historyText}\n\nCustomer: ${message}`
        : message;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({
        mode: 'ai',
        reply: response.text?.trim() || "Hey! I'm Sip Assistant — ask me about our ₹40–₹70 drinks, flavours, offers, or Dehradun pickup points!",
      });
    } catch (error) {
      console.error('Gemini chat error:', error);
      res.status(502).json({
        error: 'Sip Assistant could not connect right now.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`First Sip server running on http://localhost:${PORT}`);
  });
}

startServer();
