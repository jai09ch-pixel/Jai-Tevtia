import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Instagram,
  MapPin,
  MessageCircle,
  Send,
  Star,
} from 'lucide-react';
import { ABOUT_IMAGE } from '../data/seedData';
import { Beverage, ContactInquiry, FeedbackEntry, PageRoute } from '../types';
import { BeverageImage } from '../components/BeverageImage';

interface AboutContactPageProps {
  initialSection?: 'about' | 'contact';
  beverages: Beverage[];
  feedbackList: FeedbackEntry[];
  onSubmitFeedback: (entry: FeedbackEntry) => void;
  onSubmitInquiry: (inquiry: ContactInquiry) => void;
  onNavigate: (page: PageRoute) => void;
}

export function AboutContactPage({
  initialSection = 'about',
  beverages,
  feedbackList,
  onSubmitFeedback,
  onSubmitInquiry,
  onNavigate,
}: AboutContactPageProps) {
  const [section, setSection] = useState<'about' | 'contact'>(initialSection);

  // Feedback form state
  const [fbName, setFbName] = useState('');
  const [fbDrink, setFbDrink] = useState(beverages[0]?.name || 'Classic Cold Coffee');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');
  const [fbSent, setFbSent] = useState(false);

  // Contact form state
  const [cName, setCName] = useState('');
  const [cContact, setCContact] = useState('');
  const [cTopic, setCTopic] = useState('General Question');
  const [cMessage, setCMessage] = useState('');
  const [cSent, setCSent] = useState(false);

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComment.trim()) return;
    onSubmitFeedback({
      id: `fb-${Date.now()}`,
      customerName: fbName.trim(),
      beverageName: fbDrink,
      rating: fbRating,
      comment: fbComment.trim(),
      createdAt: new Date().toISOString(),
    });
    setFbName('');
    setFbComment('');
    setFbRating(5);
    setFbSent(true);
    setTimeout(() => setFbSent(false), 3000);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cContact.trim() || !cMessage.trim()) return;
    onSubmitInquiry({
      id: `inq-${Date.now()}`,
      name: cName.trim(),
      contact: cContact.trim(),
      topic: cTopic,
      message: cMessage.trim(),
      createdAt: new Date().toISOString(),
    });
    setCName('');
    setCContact('');
    setCMessage('');
    setCSent(true);
    setTimeout(() => setCSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-20 space-y-10">
      {/* Section Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSection('about')}
          className={`min-h-[42px] px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
            section === 'about'
              ? 'bg-[#2B1B12] text-white'
              : 'bg-white border border-[#EAE2D6] text-[#5E4536] hover:text-[#2B1B12]'
          }`}
        >
          About First Sip
        </button>
        <button
          type="button"
          onClick={() => setSection('contact')}
          className={`min-h-[42px] px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
            section === 'contact'
              ? 'bg-[#2B1B12] text-white'
              : 'bg-white border border-[#EAE2D6] text-[#5E4536] hover:text-[#2B1B12]'
          }`}
        >
          Contact &amp; Feedback
        </button>
      </div>

      {section === 'about' ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-xs font-semibold text-[#15803D]">
                Our Dehradun Story · Built for Students &amp; Young Pros
              </p>
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-[#2B1B12] tracking-tight leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Making daily refreshment flavourful, convenient, and ₹50 honest.
              </h1>
              <p className="text-sm sm:text-base text-[#5E4536] leading-relaxed">
                First Sip started in Dehradun with a simple observation: college students and
                young working professionals had only two choices for an afternoon break—overpriced
                ₹220 café chains or repetitive packaged sugar drinks.
              </p>
              <p className="text-sm sm:text-base text-[#5E4536] leading-relaxed">
                We set out to build a third option: freshly shaken cold coffee, crisp brewed iced
                tea, and real fruit coolers priced around ₹50, served fast near Dehradun campuses
                and tech offices, and continuously shaped by direct student feedback.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate(PageRoute.MENU)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold"
                >
                  Explore the Menu
                </button>
                <button
                  type="button"
                  onClick={() => setSection('contact')}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[#2B1B12] text-sm font-semibold"
                >
                  Share Feedback
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] rounded-3xl overflow-hidden border border-[#EAE2D6] bg-[#F2ECE1]">
                <BeverageImage
                  src={ABOUT_IMAGE}
                  alt="Students enjoying First Sip beverages in Dehradun"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#EAE2D6] p-6">
              <MapPin className="w-5 h-5 text-[#EA580C] mb-3" />
              <h2 className="text-base font-bold text-[#2B1B12] mb-1.5">Rajpur Road Flagship</h2>
              <p className="text-sm text-[#5E4536]">
                Near Jakhan &amp; Pacific Mall. Built for evening strolls and co-working breaks.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EAE2D6] p-6">
              <MapPin className="w-5 h-5 text-[#EA580C] mb-3" />
              <h2 className="text-base font-bold text-[#2B1B12] mb-1.5">
                Clement Town · Graphic Era
              </h2>
              <p className="text-sm text-[#5E4536]">
                Express student pickup window right outside campus for 10-minute class breaks.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EAE2D6] p-6">
              <MapPin className="w-5 h-5 text-[#EA580C] mb-3" />
              <h2 className="text-base font-bold text-[#2B1B12] mb-1.5">Prem Nagar · UPES Hub</h2>
              <p className="text-sm text-[#5E4536]">
                Serving Bidholi &amp; Kandoli students with fast iced coffees and mango coolers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#15803D] mb-1.5">
                We Listen &amp; Improve Every Week
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B1B12] tracking-tight">
                Contact &amp; Customer Feedback
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919876543210?text=Hi%20First%20Sip%20Dehradun!"
                target="_blank"
                rel="noreferrer"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+91 98765 43210)</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-[#EAE2D6] hover:bg-[#F2ECE1] text-[#2B1B12] text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Instagram className="w-4 h-4 text-[#EA580C]" />
                <span>@firstsip.dehradun</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Rate & Review Form */}
            <form
              onSubmit={handleFeedbackSubmit}
              className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE2D6] p-6 sm:p-7 space-y-4"
            >
              <h2 className="text-xl font-bold text-[#2B1B12]">Rate Your First Sip</h2>
              <p className="text-xs text-[#5E4536]">
                Your rating helps us refine recipes and shows up directly in the founder dashboard.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Your Name &amp; Campus / Role
                </label>
                <input
                  type="text"
                  required
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  placeholder="e.g., Tanvi · B.Com Student"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Which beverage did you try?
                </label>
                <select
                  value={fbDrink}
                  onChange={(e) => setFbDrink(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                >
                  {beverages.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} (₹{b.price})
                    </option>
                  ))}
                  <option value="Overall First Sip Experience">Overall First Sip Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFbRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1.5 rounded-lg hover:bg-[#FAF7F2]"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= fbRating
                            ? 'fill-[#EA580C] text-[#EA580C]'
                            : 'text-[#D6C7B6]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-[#5E4536] tabular-nums">
                    {fbRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Review Comment
                </label>
                <textarea
                  rows={3}
                  required
                  value={fbComment}
                  onChange={(e) => setFbComment(e.target.value)}
                  placeholder="How was the flavour, sweetness, or pickup speed?"
                  className="w-full p-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rating</span>
              </button>

              {fbSent && (
                <div className="rounded-xl bg-[#ECFDF3] border border-[#BBF7D0] p-3 text-xs text-[#15803D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you! Your review has been published.</span>
                </div>
              )}
            </form>

            {/* Contact Us Form */}
            <form
              onSubmit={handleContactSubmit}
              className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE2D6] p-6 sm:p-7 space-y-4"
            >
              <h2 className="text-xl font-bold text-[#2B1B12]">Contact the Team</h2>
              <p className="text-xs text-[#5E4536]">
                College fest stalls, office bulk orders, campus partnerships, or general queries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="Your name"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                    Phone or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={cContact}
                    onChange={(e) => setCContact(e.target.value)}
                    placeholder="Mobile or email"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">Topic</label>
                <select
                  value={cTopic}
                  onChange={(e) => setCTopic(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                >
                  <option value="General Question">General Question</option>
                  <option value="Campus Event Bulk Order">Campus Event Bulk Order</option>
                  <option value="Office Refreshment Tie-Up">Office Refreshment Tie-Up</option>
                  <option value="Investor / Faculty Inquiry">Investor / Faculty Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5E4536] mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={cMessage}
                  onChange={(e) => setCMessage(e.target.value)}
                  placeholder="Tell us how we can help..."
                  className="w-full p-3.5 rounded-xl border border-[#EAE2D6] bg-[#FAF7F2] text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-[#2B1B12] hover:bg-[#3F291C] text-white text-sm font-semibold"
              >
                Send Message
              </button>

              {cSent && (
                <div className="rounded-xl bg-[#ECFDF3] border border-[#BBF7D0] p-3 text-xs text-[#15803D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Message received! Our Dehradun team will reply shortly.</span>
                </div>
              )}
            </form>
          </div>

          {/* Recent Customer Reviews List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#2B1B12]">Recent Customer Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white rounded-2xl border border-[#EAE2D6] p-5 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-[#EA580C] mb-2 tabular-nums">
                      {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} · {fb.beverageName}
                    </p>
                    <p className="text-sm text-[#2B1B12] leading-relaxed mb-3">
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#5E4536]">{fb.customerName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
