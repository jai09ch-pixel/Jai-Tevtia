import { Compass, Coffee, Home, ShoppingBag, User } from 'lucide-react';
import { PageRoute } from '../types';

interface NavbarProps {
  currentPage: PageRoute;
  cartCount: number;
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
}

export function Navbar({ currentPage, cartCount, onNavigate, onOpenCart }: NavbarProps) {
  const navItems: Array<{ label: string; route: PageRoute }> = [
    { label: 'Menu', route: PageRoute.MENU },
    { label: 'Find Your Sip', route: PageRoute.FIND_YOUR_SIP },
    { label: 'Rewards & Orders', route: PageRoute.DASHBOARD },
    { label: 'About & Contact', route: PageRoute.ABOUT },
    { label: 'Admin', route: PageRoute.ADMIN },
  ];

  const isAboutOrContact =
    currentPage === PageRoute.ABOUT || currentPage === PageRoute.CONTACT;

  return (
    <>
      <header className="sticky top-0 z-40 h-14 md:h-16 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE2D6]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single-line, no adjacent descriptor) */}
          <button
            type="button"
            onClick={() => onNavigate(PageRoute.HOME)}
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#2B1B12] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#EA580C] rounded-lg"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="28" height="28" rx="8" fill="#EA580C" />
              <path
                d="M9 10H19L17.8 20.2C17.68 21.22 16.82 22 15.8 22H12.2C11.18 22 10.32 21.22 10.2 20.2L9 10Z"
                fill="#FAF7F2"
              />
              <path
                d="M15.5 6L14 10"
                stroke="#FAF7F2"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="19" cy="7" r="2" fill="#15803D" />
            </svg>
            <span className="font-display">First Sip</span>
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                currentPage === item.route ||
                (item.route === PageRoute.ABOUT && isAboutOrContact);
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#EA580C] border-[#EA580C]'
                      : 'text-[#5E4536] border-transparent hover:text-[#2B1B12] hover:border-[#EAE2D6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action (Bag button) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] text-[#FAF7F2] text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Bag</span>
              <span className="tabular-nums font-mono text-xs bg-[#EA580C] text-white px-1.5 py-0.5 rounded-md">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (52px height, keeps total mobile sticky height well under 15% cap) */}
      <nav
        aria-label="Mobile primary navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-[#EAE2D6] grid grid-cols-5 items-center"
      >
        <button
          type="button"
          onClick={() => onNavigate(PageRoute.HOME)}
          className={`flex flex-col items-center justify-center h-full ${
            currentPage === PageRoute.HOME ? 'text-[#EA580C]' : 'text-[#5E4536]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(PageRoute.MENU)}
          className={`flex flex-col items-center justify-center h-full ${
            currentPage === PageRoute.MENU ? 'text-[#EA580C]' : 'text-[#5E4536]'
          }`}
        >
          <Coffee className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">Menu</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(PageRoute.FIND_YOUR_SIP)}
          className={`flex flex-col items-center justify-center h-full ${
            currentPage === PageRoute.FIND_YOUR_SIP ? 'text-[#EA580C]' : 'text-[#5E4536]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">Match</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(PageRoute.DASHBOARD)}
          className={`flex flex-col items-center justify-center h-full ${
            currentPage === PageRoute.DASHBOARD ? 'text-[#EA580C]' : 'text-[#5E4536]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">Account</span>
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center h-full text-[#2B1B12] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#EA580C] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap">Bag</span>
        </button>
      </nav>
    </>
  );
}
