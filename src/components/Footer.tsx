import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-[#EAE2D6] pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-2.5">
          <p className="font-display text-lg font-extrabold text-[#2B1B12]">First Sip</p>
          <p className="text-sm text-[#5E4536] max-w-sm leading-relaxed">
            Your Break. Your Refreshment. Your First Sip. Fresh, youth-focused beverages crafted in
            Dehradun around an honest ₹50 core price.
          </p>
        </div>

        <div className="md:col-span-4 space-y-2">
          <p className="text-xs font-bold text-[#2B1B12]">Explore</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#5E4536]">
            <button type="button" onClick={() => onNavigate(PageRoute.HOME)} className="text-left hover:text-[#EA580C]">
              Home
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.MENU)} className="text-left hover:text-[#EA580C]">
              Menu
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.FIND_YOUR_SIP)} className="text-left hover:text-[#EA580C]">
              Find Your First Sip
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.DASHBOARD)} className="text-left hover:text-[#EA580C]">
              Loyalty &amp; Orders
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.ABOUT)} className="text-left hover:text-[#EA580C]">
              About Us
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.CONTACT)} className="text-left hover:text-[#EA580C]">
              Contact &amp; Ratings
            </button>
            <button type="button" onClick={() => onNavigate(PageRoute.ADMIN)} className="text-left hover:text-[#EA580C]">
              Admin Dashboard
            </button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-2 text-sm text-[#5E4536]">
          <p className="text-xs font-bold text-[#2B1B12]">Dehradun Kiosks</p>
          <p>Rajpur Road Flagship</p>
          <p>Clement Town · Graphic Era</p>
          <p>Prem Nagar · UPES Hub</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#EAE2D6] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7D6455]">
        <span>© {new Date().getFullYear()} First Sip Beverages · Dehradun, Uttarakhand</span>
        <span>Average Core Price ₹50 · Prototype Interactive Web App</span>
      </div>
    </footer>
  );
}
