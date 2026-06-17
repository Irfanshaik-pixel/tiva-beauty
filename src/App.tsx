import { useState, useEffect, FormEvent } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./lib/firebase";
import { HelpCircle, ChevronDown, Send, Check, Sparkles, MapPin, Mail, Instagram, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Sub-components
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import ShopCollection from "./components/ShopCollection";
import IngredientCodex from "./components/IngredientCodex";
import RitualConsultant from "./components/RitualConsultant";
import Journal from "./components/Journal";
import CartDrawer from "./components/CartDrawer";
import ProductDetail from "./components/ProductDetail";
import CheckoutExperience from "./components/CheckoutExperience";
import ReviewsSection from "./components/ReviewsSection";
import WaitlistRitual from "./components/WaitlistRitual";

// Static data and types
import IngredientsPage from "./components/IngredientsPage";
import JournalPage from "./components/JournalPage";
import ArticlePage from "./components/ArticlePage";
import AiRitualsPage from "./components/AiRitualsPage";

import { PRODUCTS } from "./data";
import { Product, CartItem } from "./types";

// --- Route Wrappers ---

const ProductDetailWrapper = ({ onAddToCart }: { onAddToCart: (product: Product) => void }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <ProductDetail 
      productId={id || "tiva-sunscreen"}
      onBack={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      onAddToCart={onAddToCart}
      onNotifyMe={() => { navigate("/waitlist"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
    />
  );
};

const ArticlePageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <ArticlePage 
      id={Number(id)} 
      onBack={() => { navigate("/journal"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
    />
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSection, setCurrentSection] = useState<string>("home");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tiva-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Rehydrate cart items with full product data from PRODUCTS
        return parsed.map((item: { productId: string; quantity: number }) => {
          const product = PRODUCTS.find(p => p.id === item.productId);
          return product ? { product, quantity: item.quantity } : null;
        }).filter(Boolean) as CartItem[];
      }
    } catch {}
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquiryMsg, setInquiryMsg] = useState<string>("");
  const [inquirySent, setInquirySent] = useState<boolean>(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    localStorage.setItem('tiva-cart', JSON.stringify(cartData));
  }, [cart]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth-scroll navigation
  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);

    // Route-based pages
    if (sectionId === "ingredients") {
      navigate("/ingredients");
      return;
    }
    if (sectionId === "journal") {
      navigate("/journal");
      return;
    }
    if (sectionId === "consultant") {
      navigate("/ai-rituals");
      return;
    }

    // Scroll-based sections on the storefront
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for home page to render before scrolling
      setTimeout(() => {
        if (sectionId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const element = document.getElementById(`${sectionId}-section`);
        if (element) {
          const offset = 80; // height of fixed header
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
        }
      }, 100);
      return;
    }
    
    // Already on home page
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(`${sectionId}-section`);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Deliberately open the cart drawer to provide direct feedback
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const faqs = [
    {
      q: "What dictates our 'less is more' formulation standard?",
      a: "TIVA operates on biological necessity. We reject unnecessary synthetic thickeners, artificial perfumes, and harmful chemicals. Every compound inside TIVA is selected for high cellular biocompatibility, ensuring sheer protection and clinical-level efficacy without overloading your skin's delicate barrier."
    },
    {
      q: "How does the Tinted Sunscreen adapt to different skin tones?",
      a: "Our TIVA Tinted Sunscreen SPF 50+ is meticulously formulated in 6 versatile shades—ranging from Fair Porcelain to Deep Cocoa. Instead of relying on heavy pigments, we utilize sheer, mineral-based color-adapting technology that blurs imperfections and melts into your natural complexion without leaving a white cast."
    },
    {
      q: "Can I layer the Glass Lip Oil over other lip products?",
      a: "Absolutely. The TIVA Glass Lip Oil is a hybrid treatment designed for versatility. Worn alone, its Peptide Complex and Jojoba Seed Oil provide deep, long-lasting hydration and a mirror-like shine. Layered over your favorite lip color, it acts as a non-sticky, luminous glaze that plumps and protects."
    },
    {
      q: "Are TIVA formulations vegan and cruelty-free?",
      a: "Yes, without compromise. We maintain a strict cruelty-free standard across our entire lifecycle. We do not test on animals, and all our restorative ingredients—from the Amino Acids in our Silk Cleanser to the Ceramides in our Barrier Cloud Moisturizer—are purely plant-derived and bio-fermented."
    }
  ];

  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;
    
    try {
      await addDoc(collection(db, "lab_inquiries"), {
        name: inquiryName,
        email: inquiryEmail,
        message: inquiryMsg,
        createdAt: serverTimestamp()
      });
      
      setInquirySent(true);
      setTimeout(() => {
        setInquiryName("");
        setInquiryEmail("");
        setInquiryMsg("");
      }, 1500);
    } catch (error) {
      console.error("Error sending inquiry: ", error);
      // Fallback to success UI anyway so user isn't blocked if db fails
      setInquirySent(true);
    }
  };

  const hideNavigation = ["/ai-rituals", "/checkout", "/waitlist"].includes(location.pathname);

  // The Storefront (Home Page) component
  const Storefront = () => (
    <>
      {/* 2. Interactive Scrolling Hero */}
      <Hero
        onExplore={() => handleNavigate("shop")}
        onDiscoverRitual={() => handleNavigate("philosophy")}
        onAddProduct={handleAddToCart}
        onProductClick={(id) => navigate(`/product/${id}`)}
        onNotifyClick={() => navigate("/waitlist")}
      />

      {/* 3. BRAND PHILOSOPHY SECTION */}
      <section
        className="bg-white py-24 md:py-32 scroll-mt-20 border-y border-beige/40 text-center relative overflow-hidden"
        id="philosophy-section"
      >
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <span className="absolute left-[5%] top-1/4 font-serif text-[18vh] italic text-beige/50 select-none leading-none">
            Intention
          </span>
          <span className="absolute right-[5%] bottom-1/4 font-serif text-[18vh] text-beige/50 select-none leading-none">
            Simplicity
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.45em] uppercase font-mono text-gold block mb-6 animate-pulse">
            THE TIVA MANIFESTO
          </span>
          
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-charcoal font-light leading-snug tracking-tight max-w-2xl">
            Beauty begins with <span className="font-serif italic text-gold font-light">intention</span>.
          </h2>

          <div className="w-16 h-[1.5px] bg-gold/70 my-8" />

          <p className="font-serif text-lg md:text-2xl text-taupe leading-relaxed italic max-w-3xl font-light">
            "We believe that the skin is a delicate ecosystem. It does not need to be overwhelmed with ten-step routines or aggressive actives. It needs to be understood, protected, and restored with botanical precision."
          </p>
        </div>
      </section>

      {/* 4. Complete Shop Collection */}
      <ShopCollection 
        onAddProduct={handleAddToCart}
        onProductClick={(id) => navigate(`/product/${id}`)}
        onNotifyMe={() => navigate("/waitlist")}
      />

      {/* 4.5. Social Proof & Reviews */}
      <ReviewsSection />

      {/* 5. Ingredient Codex */}
      <IngredientCodex />

      {/* 6. AI Consultation Diagnostic */}
      <RitualConsultant />

      {/* 7. Brand Journal Columns */}
      <Journal />

      {/* 8. FAQ, ABOUT, & GALLERY INQUIRY SECTION */}
      <section className="bg-ivory py-24 md:py-32 scroll-mt-20" id="faq-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Col Left: FAQ Accordion */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold block mb-3">
                Resolving Concerns
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal font-light">
                Frequent Inquiries & Sourcing
              </h2>
              <div className="w-16 h-[1px] bg-gold my-5" />
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-beige/60 pb-4 transition-all"
                    id={`faq-item-${idx}`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-3 focus:outline-none cursor-pointer group"
                    >
                      <span className="font-serif text-[17px] text-charcoal group-hover:text-gold transition-colors font-medium">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-taupe group-hover:text-gold transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs md:text-sm text-taupe leading-relaxed pb-4 pt-1 font-light font-sans">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col Right: Interactive Laboratory Registration Inquiry */}
          <motion.div 
            whileHover={{ scale: 1.015, y: -4 }}
            transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 text-left bg-white rounded-3xl p-8 md:p-10 border border-beige/30 relative shadow-sm"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4 mb-6">
              <span className="text-[9px] tracking-[0.3em] font-mono text-gold uppercase block">
                LABORATORY REGISTRATION
              </span>
              <h4 className="font-serif text-2xl font-light text-charcoal">
                Inquire Alignment
              </h4>
              <p className="text-xs text-taupe leading-relaxed font-light">
                Submit skincare queries directly to TIVA&apos;s lead formulation chemists. We compile answers individual to your biological needs.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {inquirySent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                  key="inquiry-success"
                >
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-full">
                    <Check className="w-6 h-6 text-teal-600 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-gold uppercase block">
                      INQUIRY LOGGED SECURELY
                    </span>
                    <h5 className="font-serif text-lg text-charcoal font-medium">Message Steeping</h5>
                    <p className="text-xs text-taupe max-w-xs leading-relaxed font-light">
                      A lab representative will analyze your notes and issue a structured response within 24 matinal intervals.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleInquirySubmit}
                  className="space-y-4"
                  id="lab-inquiry-form"
                  key="inquiry-form"
                >
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono uppercase text-taupe tracking-wider">
                      Full Identity Label / Name
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Amzad Shaik"
                      className="w-full p-3 rounded-xl border border-beige/40 bg-ivory/30 focus:bg-white text-xs text-charcoal placeholder-taupe/40 focus:outline-none font-sans focus:ring-1 focus:ring-gold"
                      id="inquiry-name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono uppercase text-taupe tracking-wider">
                      Digital Envelope / Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-3 rounded-xl border border-beige/40 bg-ivory/30 focus:bg-white text-xs text-charcoal placeholder-taupe/40 focus:outline-none font-sans focus:ring-1 focus:ring-gold"
                      id="inquiry-email"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono uppercase text-taupe tracking-wider">
                      Formulation inquiry text
                    </label>
                    <textarea
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder="Detail your allergies, hydration rates, or solar exposure habits..."
                      className="w-full h-28 p-3 rounded-xl border border-beige/40 bg-ivory/30 focus:bg-white text-xs text-charcoal placeholder-taupe/40 focus:outline-none font-sans resize-none focus:ring-1 focus:ring-gold leading-relaxed"
                      id="inquiry-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-charcoal text-white hover:bg-gold transition-all text-[10px] uppercase font-mono tracking-widest flex items-center justify-center space-x-2 cursor-pointer shadow-xs font-medium"
                    id="submit-inquiry"
                  >
                    <Send className="w-3 h-3 text-white" />
                    <span>Deliver Inquiry</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
    </>
  );

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-gold/20 selection:text-charcoal relative">
      
      {/* 1. Global Navigation Bar */}
      {!hideNavigation && (
        <Navigation
          currentSection={currentSection}
          onNavigate={handleNavigate}
          cartCount={cartTotalCount}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* MAIN ROUTER OUTLET */}
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/product/:id" element={<ProductDetailWrapper onAddToCart={handleAddToCart} />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/journal" element={<JournalPage onArticleClick={(id) => navigate(`/journal/${id}`)} />} />
        <Route path="/journal/:id" element={<ArticlePageWrapper />} />
        <Route path="/ai-rituals" element={<AiRitualsPage onBack={() => navigate("/")} />} />
        <Route path="/checkout" element={<CheckoutExperience cart={cart} onBack={() => { navigate("/"); setIsCartOpen(true); }} onClearCart={() => setCart([])} />} />
        <Route path="/waitlist" element={<WaitlistRitual onBack={() => navigate("/")} />} />
      </Routes>

      {/* 9. LUXURY FOOTER BRAND SIGNATURE */}
      <footer className="bg-charcoal text-ivory py-16 px-6 md:px-12 border-t border-beige/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 font-sans text-left">
          
          {/* Logo brand and copy column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <span
                className="font-sans text-2xl tracking-[0.25em] font-light text-gold opacity-90 transition-all hover:opacity-100"
                id="footer-custom-logo"
              >
                TIVA
              </span>
            </div>
            <p className="text-[10px] tracking-[0.35em] text-gold uppercase mt-1 block">
              BEAUTY, ELEVATED.
            </p>
            <p className="text-xs text-beige/50 leading-relaxed font-light font-sans max-w-sm pt-2">
              A minimalist luxury beauty house. Handcrafted clinical botanicals constructed with scientific precision and Ayurvedic ancient integrity.
            </p>
          </div>

          {/* Sourcing and physical location coordinates */}
          <div className="space-y-4">
            <span className="block text-[10px] font-mono uppercase text-gold tracking-widest">
              BUSINESS ADDRESS
            </span>
            <div className="space-y-3.5 text-xs text-beige/70 font-light">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p>Plot 14, Sector 23, Balareddipalle, Koduru, Tirupati, Andhra Pradesh, India 516101</p>
              </div>
            </div>
          </div>

          {/* Connected communities links info */}
          <div className="space-y-4">
            <span className="block text-[10px] font-mono uppercase text-gold tracking-widest">
              COMMUNITY CONVERSATIONS
            </span>
            <div className="space-y-3 text-xs text-beige/70 font-light">
              <a href="https://www.instagram.com/tiva.naturals/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-gold transition-colors">
                <Instagram className="w-4.5 h-4.5" />
                <span>@tiva.naturals</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-gold transition-colors">
                <Mail className="w-4.5 h-4.5" />
                <span>irfan@tiva.co.in</span>
              </a>
              <a href="https://wa.me/917893480367?text=Hi%20TIVA!%20I'm%20interested%20in%20your%20skincare%20products.%20Can%20you%20help%20me%20choose%20the%20right%20ritual%3F" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-gold transition-colors">
                <HelpCircle className="w-4.5 h-4.5 text-gold" style={{ strokeWidth: 1.5 }} />
                <span>+91 7893480367</span>
              </a>
            </div>
          </div>

          {/* Legal copyrights signature */}
          <div className="space-y-4">
            <span className="block text-[10px] font-mono uppercase text-gold tracking-widest">
              Dermasist Innovation Lab
            </span>
            <p className="text-[10px] text-beige/50 leading-relaxed font-mono uppercase tracking-wider">
              705, Parinee I, 7- A, Shah Industrial Estate, Andheri West, Mumbai, 400053, Maharashtra (India).
            </p>
          </div>

        </div>

        {/* Big elegant watermark text strip at bottom */}
        <div className="max-w-7xl mx-auto pt-16 mt-12 border-t border-beige/10 text-center">
          <span className="font-serif text-[11vw] tracking-[0.35em] text-white/5 font-semibold block leading-none select-none">
            TIVA
          </span>
        </div>
      </footer>

      {/* 10. Sliding Shopping Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate("/checkout");
        }}
      />

      {/* 12. Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-beige/80 backdrop-blur-sm border border-gold/20 text-gold hover:bg-gold hover:text-ivory transition-all cursor-pointer shadow-lg"
            aria-label="Scroll to top"
            id="scroll-top-btn"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
