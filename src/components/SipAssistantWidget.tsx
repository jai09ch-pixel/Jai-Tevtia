import { FormEvent, useRef, useState } from 'react';
import { Loader2, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { ChatTurn, sendSipAssistantMessage } from '../services/aiService';
import { Beverage, PromoOffer, StoreConfig } from '../types';

interface SipAssistantWidgetProps {
  beverages: Beverage[];
  offers: PromoOffer[];
  storeConfig: StoreConfig;
}

const SUGGESTED_PROMPTS = [
  "What's ₹50 or under?",
  'Best drink for studying?',
  'Any student offers?',
  'How do loyalty points work?',
];

export function SipAssistantWidget({
  beverages,
  offers,
  storeConfig,
}: SipAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: 'assistant',
      text: "Hey there! I'm Sip Assistant. Ask me about our ₹40–₹70 drinks, flavours, Dehradun pickup hubs, or student promo codes!",
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextHistory: ChatTurn[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 30);

    try {
      const res = await sendSipAssistantMessage({
        message: trimmed,
        history: messages,
        menuItems: beverages,
        offers,
        deliveryEnabled: storeConfig.deliveryEnabled,
        deliveryFee: storeConfig.deliveryFee,
      });

      setMessages((prev) => [...prev, { role: 'assistant', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            err instanceof Error
              ? `${err.message} Meanwhile, feel free to browse our Menu or try CAMPUS20 at checkout!`
              : 'Sorry, I hit a quick snag. Try asking again!',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sip Assistant chat"
          className="fixed bottom-18 right-4 md:bottom-6 md:right-6 z-40 h-12 px-4 rounded-2xl bg-[#2B1B12] hover:bg-[#3F291C] text-white shadow-xl border border-[#543827] flex items-center gap-2 text-sm font-semibold transition-transform active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-[#FDBA74]" />
          <span className="whitespace-nowrap">Sip Assistant</span>
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Sip Assistant Chat"
          className="fixed bottom-16 right-3 left-3 sm:left-auto sm:right-6 md:bottom-6 z-50 sm:w-[380px] h-[480px] max-h-[75vh] bg-[#FAF7F2] rounded-3xl border border-[#EAE2D6] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#2B1B12] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EA580C] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold leading-tight">Sip Assistant</h2>
                <p className="text-[11px] text-[#E7D8C9]">First Sip Dehradun Guide</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Sip Assistant"
              className="p-1.5 rounded-lg hover:bg-white/10 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#EA580C] text-white rounded-br-xs'
                      : 'bg-white border border-[#EAE2D6] text-[#2B1B12] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#EAE2D6] rounded-2xl px-3.5 py-2.5 text-xs text-[#5E4536] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EA580C]" />
                  <span>Mixing an answer...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto">
            {SUGGESTED_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[11px] font-medium text-[#2B1B12] whitespace-nowrap shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#EAE2D6] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about drinks, ₹50 prices, offers..."
              className="flex-1 min-h-[40px] px-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs sm:text-sm text-[#2B1B12] focus:outline-none focus:border-[#EA580C]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="min-h-[40px] min-w-[40px] rounded-xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
