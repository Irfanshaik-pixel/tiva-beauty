import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navigation({
  currentSection,
  onNavigate,
  cartCount,
  onOpenCart,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop Collection" },
    { id: "ingredients", label: "Ingredient Codex" },
    { id: "journal", label: "Journal" },
    { id: "consultant", label: "AI Rituals" },
    { id: "faq", label: "FAQ & About" },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-sm border-b border-beige/30 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Brand Logo */}
          <button
            onClick={() => handleItemClick("home")}
            className="group flex flex-col items-start focus:outline-none text-left"
            id="nav-logo"
          >
            <div className="flex items-center space-x-2">
              <span
                className="font-sans text-2xl tracking-[0.25em] font-light text-gold transition-colors"
                id="tiva-custom-logo"
              >
                TIVA
              </span>
            </div>
            <span className="text-[8px] tracking-[0.45em] text-taupe uppercase mt-1.5 leading-none ml-1">
              Beauty & Wellness
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`uppercase text-xs tracking-[0.2em] font-light transition-all pb-1 focus:outline-none hover:text-gold relative ${
                  currentSection === item.id
                    ? "text-charcoal font-medium"
                    : "text-taupe"
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
                {currentSection === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Quick AI Routine Trigger Button */}
            <button
              onClick={() => handleItemClick("consultant")}
              className="hidden sm:flex items-center space-x-2 border border-gold/40 hover:border-gold px-4 py-2 rounded-full cursor-pointer transition-all bg-white/40"
              id="quick-ai-consult"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-[10px] tracking-[0.15em] uppercase font-light text-charcoal">
                AI Routine Diagnostic
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-charcoal hover:text-gold cursor-pointer transition-colors focus:outline-none group"
              aria-label="View Shopping Bag"
              id="nav-open-cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[9px] font-sans font-medium w-4.5 h-4.5 rounded-full flex items-center justify-center border border-ivory"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-gold cursor-pointer transition-colors focus:outline-none"
              aria-label="Toggle Mobile Menu"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.25]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.25]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-30 bg-ivory pt-24 px-6 pb-8 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col space-y-6 mt-8">
              {navItems.map((item, index) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left text-2xl font-serif text-charcoal tracking-wide focus:outline-none py-2 hover:text-gold flex items-center justify-between group border-b border-beige/10 ${
                    currentSection === item.id ? "text-gold pl-2 font-medium" : ""
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-taupe tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {`0${index + 1}`}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-t border-beige/40 pt-6 space-y-4"
            >
              <button
                onClick={() => handleItemClick("consultant")}
                className="w-full py-4 bg-charcoal text-white hover:bg-gold transition-colors tracking-[0.25em] text-xs uppercase flex items-center justify-center space-x-3"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>AI Skin Diagnostic</span>
              </button>
              <p className="text-[10px] text-center text-taupe uppercase tracking-[0.3em]">
                TIVA — Beauty, Elevated
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
