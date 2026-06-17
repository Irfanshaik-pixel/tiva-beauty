import { useState, useEffect } from "react";
import { Sparkles, Eye, ShoppingBag, X, Check, Bell, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../data";
import { Product } from "../types";
import LazyImage from "./ui/LazyImage";

interface ShopCollectionProps {
  onAddProduct: (prod: Product) => void;
  onProductClick: (id: string) => void;
  onNotifyMe?: () => void;
}

export default function ShopCollection({ onAddProduct, onProductClick, onNotifyMe }: ShopCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Complete Collection" },
    { id: "essential", label: "Daily Essentials" },
    { id: "serum", label: "Active Serums" },
    { id: "cleanser", label: "Cleanser" },
    { id: "oil", label: "lip care" },
    { id: "Moisturizer", label: "Moisturizer" },
  ];

  const filteredProducts = selectedCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const handleQuickAdd = (p: Product) => {
    onAddProduct(p);
    setJustAddedId(p.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1500);
  };

  return (
    <section className="bg-ivory py-24 md:py-32 scroll-mt-20" id="shop-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold block mb-3">
              Intentional Formula Collection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal font-light leading-tight">
              Quiet Formulations
            </h2>
            <div className="w-16 h-[1px] bg-gold my-5" />
            <p className="text-sm text-taupe leading-relaxed font-light">
              Crafted in low batches using traditional infusion alongside advanced clinical molecules. Free from parabens, synthetic colorants, and mineral wax.
            </p>
          </div>

          {/* Sizing description badge */}
          <div className="border border-gold/25 p-4 rounded-xl bg-white/40 self-start md:self-end">
            <span className="text-[9px] font-mono uppercase tracking-widest text-gold block">
              ESTIMATED STANDARD SHIPPING
            </span>
            <span className="text-xs font-serif text-charcoal mt-1 block">
              Complimentary on all domestic placements
            </span>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2 mb-12 pb-2 border-b border-beige/40">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-light cursor-pointer relative transition-all ${
                selectedCategory === cat.id
                  ? "text-gold font-medium"
                  : "text-taupe hover:text-charcoal"
              }`}
              id={`cat-tab-${cat.id}`}
            >
              {cat.label}
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCategoryBorder"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="group flex flex-col justify-between"
              id={`product-card-${product.id}`}
            >
              {/* Image Container Card */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-beige/20 shadow-xs border border-beige/10 mb-4 cursor-pointer group/card">
                {product.images && product.images.length > 0 ? (
                  <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {product.images.map((imgUrl, idx) => (
                      <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                        <LazyImage
                          src={imgUrl}
                          alt={`${product.name} - view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                  />
                )}

                {/* Dark overlay fade */}
                <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Inspect Overlay Trigger */}
                <div className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); onProductClick(product.id); }}
                    className="p-3 bg-white/95 rounded-full hover:bg-gold hover:text-white transition-colors cursor-pointer pointer-events-auto shadow-sm"
                    title="Inspect Formulation"
                    aria-label={`Inspect ${product.name}`}
                  >
                    <Eye className="w-4.5 h-4.5 stroke-[1.5]" />
                  </button>
                </div>

                {/* Sold Out badge */}
                <div className="absolute top-4 right-4 bg-charcoal/5 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-charcoal/20 pointer-events-none z-20 shadow-[0_0_15px_rgba(28,24,22,0.3)]">
                  <span className="font-mono text-[8px] text-charcoal uppercase tracking-widest font-bold">
                    Sold Out
                  </span>
                </div>

                {/* Product Volume tag */}
                <div className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-beige/40 pointer-events-none z-20">
                  <span className="font-mono text-[8px] text-taupe uppercase tracking-widest">
                    {product.volume}
                  </span>
                </div>
              </div>

              {/* Text Meta details */}
              <div className="text-left space-y-1">
                <span className="text-[8px] tracking-[0.25em] font-mono text-gold uppercase block">
                  {product.subtitle}
                </span>

                <button
                  onClick={() => onProductClick(product.id)}
                  className="block font-serif text-lg tracking-normal text-charcoal hover:text-gold transition-colors font-medium text-left focus:outline-none"
                >
                  {product.name}
                </button>

                <div className="flex justify-between items-center pt-2 gap-2">
                  <div className="font-sans text-sm text-charcoal tracking-wide font-medium flex items-center space-x-1.5 flex-wrap opacity-60">
                    {product.salePrice ? (
                      <>
                        <span>₹{product.salePrice}.00</span>
                        <span className="text-taupe line-through text-xs font-light">₹{product.price}.00</span>
                        <span className="text-[8px] font-mono bg-gold/10 text-gold px-1 rounded tracking-wide">{Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF</span>
                      </>
                    ) : (
                      <span>₹{product.price}.00</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (onNotifyMe) onNotifyMe();
                    }}
                    className="px-4 py-1.5 rounded-full border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white text-[9px] uppercase tracking-widest font-mono cursor-pointer transition-all flex items-center space-x-1 group"
                    id={`notify-btn-${product.id}`}
                  >
                    <Bell className="w-3 h-3 group-hover:animate-bounce" />
                    <span>Notify Me</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Flagship Formulation Inspection Modal */}
      <AnimatePresence>
        {modalProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalProduct(null)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-4xl p-6 md:p-10 shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 overflow-hidden border border-beige/40 max-h-[90vh] overflow-y-auto text-left"
              id="product-inspection-modal"
            >
              {/* Close pin */}
              <button
                onClick={() => setModalProduct(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-ivory/80 text-taupe hover:text-charcoal cursor-pointer"
                aria-label="Close dialog"
                id="close-modal-btn"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Col Left: Beautiful Image Render */}
              <div className="md:col-span-5 h-[260px] md:h-full min-h-[300px] rounded-xl overflow-hidden relative bg-beige/10">
                <LazyImage
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/85 px-2 py-0.5 rounded-sm border border-beige/30">
                  <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-charcoal font-medium">
                    {modalProduct.volume} volume
                  </span>
                </div>
              </div>

              {/* Col Right: Detailed Spec details */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="font-mono text-[8px] text-gold tracking-[0.4em] block mb-2 uppercase">
                    FORMULATION DIAGNOSIS SHEET
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">
                    {modalProduct.name}
                  </h3>
                  <span className="text-xs text-taupe font-serif italic block mt-1">
                    {modalProduct.subtitle}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-taupe leading-relaxed font-light">
                  {modalProduct.description}
                </p>

                {/* Bullet benefits */}
                <div className="space-y-2 border-y border-beige/30 py-4">
                  <span className="block text-[8px] font-mono text-charcoal uppercase tracking-widest mb-2">
                    BIOMETRIC BENEFITS
                  </span>
                  {modalProduct.benefits.map((ben, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-charcoal font-light">
                      <span className="text-gold text-lg leading-none select-none">•</span>
                      <p>{ben}</p>
                    </div>
                  ))}
                </div>

                {/* Fluid Instructions */}
                <div>
                  <span className="block text-[8px] font-mono text-charcoal uppercase tracking-widest mb-1.5">
                    DIRECTIONS OF USE
                  </span>
                  <p className="text-xs text-taupe leading-relaxed italic">
                    {modalProduct.usage}
                  </p>
                </div>

                {/* Footer and bag triggers */}
                <div className="flex justify-between items-center pt-4 border-t border-beige/10 mt-6 gap-4 flex-wrap">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-taupe tracking-wider mb-0.5">RETAIL VALUE</span>
                    <div className="flex items-end space-x-2 opacity-60">
                      <span className="block font-serif text-2xl font-light text-charcoal">
                        ₹{modalProduct.salePrice || modalProduct.price}.00
                      </span>
                      {modalProduct.salePrice && (
                        <span className="font-serif text-[15px] font-light text-taupe line-through pb-1">
                          ₹{modalProduct.price}.00
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNotifyMe) onNotifyMe();
                      setModalProduct(null);
                    }}
                    className="flex-1 md:flex-initial border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white transition-colors tracking-[0.25em] text-xs uppercase px-8 py-3.5 flex items-center justify-center space-x-2 cursor-pointer shadow-md group"
                    id="modal-notify-me"
                  >
                    <Bell className="w-3.5 h-3.5 group-hover:animate-bounce" />
                    <span>Notify Me</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
