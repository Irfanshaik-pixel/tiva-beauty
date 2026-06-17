import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronRight, Shield, Sparkles, Droplet, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, shade?: string) => void;
  onNotifyMe?: () => void;
}

const SHADES = [
  { name: "Fair Ivory", color: "#F2D5BA" },
  { name: "Light Beige", color: "#E6BA8B" },
  { name: "Light Medium Honey", color: "#D89B5F" },
  { name: "Medium Sand", color: "#C27A41" },
  { name: "Tan Caramel", color: "#A65E2E" },
  { name: "Deep Cocoa", color: "#733C1B" }
];

const customUploads: Record<string, string[]> = {};

export default function ProductDetail({ productId, onBack, onAddToCart, onNotifyMe }: ProductDetailProps) {
  const [selectedShade, setSelectedShade] = useState<string>("Light Medium Honey");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  
  const hasShades = product.id === "tiva-sunscreen";
  const [localImages, setLocalImages] = useState<string[]>([]);

  // reset image index and pad to 5 slots if product changes
  useEffect(() => {
    let initial = customUploads[productId] ? [...customUploads[productId]] : [...(product.images && product.images.length > 0 ? product.images : [product.image])];
    while (initial.length < 5) {
      initial.push("");
    }
    setLocalImages(initial.slice(0, 5));
    setActiveImageIdx(0);
  }, [productId, product]);

  const handleImageUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      const newImages = [...localImages];
      newImages[idx] = url;
      setLocalImages(newImages);
      customUploads[productId] = newImages;
      setActiveImageIdx(idx);
    }
  };

  const handleNotifyMe = () => {
    if (onNotifyMe) onNotifyMe();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-ivory pt-24 pb-32 px-6 md:px-12"
      id="product-detail-view"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={onBack}
          className="group flex items-center space-x-2 text-[10px] uppercase font-mono tracking-widest text-taupe hover:text-charcoal transition-colors mb-12 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* Left Column: Imagery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className={`w-full bg-white rounded-2xl border border-beige/40 p-8 flex items-center justify-center relative overflow-hidden group shadow-sm ${(activeImageIdx === 2 || activeImageIdx === 4) ? "aspect-auto" : "aspect-[4/5]"}`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-beige/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {localImages[activeImageIdx] ? (
                  <motion.img 
                    key={`img-${activeImageIdx}-${localImages[activeImageIdx]}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    src={localImages[activeImageIdx]} 
                    alt={`${product.name} showcase`} 
                    className={`w-full rounded-xl z-10 ${(activeImageIdx === 2 || activeImageIdx === 4) ? "h-auto object-contain" : "h-full object-cover"}`}
                  />
                ) : (
                  <motion.div
                    key={`placeholder-${activeImageIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center text-taupe/50 border-2 border-dashed border-beige/60 rounded-xl z-10"
                  >
                    <Sparkles className="w-8 h-8 mb-3 opacity-50" />
                    <span className="text-xs font-mono uppercase tracking-widest text-center px-4">Upload Image {activeImageIdx + 1}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center flex-wrap gap-4 mt-6">
              {localImages.map((img, idx) => (
                <div key={idx} className="relative group cursor-pointer w-16 h-20" onClick={() => setActiveImageIdx(idx)}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(idx, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    title={`Upload Product Image ${idx + 1}`}
                  />
                  <div 
                    className={`absolute inset-0 rounded-md border p-1 overflow-hidden transition-all z-10 ${
                      activeImageIdx === idx ? "border-gold bg-white ring-1 ring-gold/50" : "border-beige/40 bg-white/50 group-hover:border-taupe/80"
                    }`}
                  >
                    {img ? (
                      <img src={img} className="w-full h-full object-cover rounded-sm" alt={`${product.name} view ${idx + 1}`} />
                    ) : (
                      <div className="w-full h-full bg-beige/10 rounded-sm flex items-center justify-center transition-colors group-hover:bg-beige/20">
                        <span className="text-[18px] font-light text-taupe/40 leading-none mb-1">+</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="lg:col-span-6 flex flex-col justify-start text-left">
            <div className="space-y-6">
              {/* Labels */}
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 border border-charcoal/20 rounded-full text-[9px] uppercase font-mono tracking-widest text-charcoal bg-charcoal/5 shadow-[0_0_10px_rgba(194,159,101,0.5)] font-bold animate-pulse">
                  Sold Out
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-taupe">
                  {product.category}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal font-light leading-tight tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-charcoal mt-3 tracking-wide leading-relaxed font-medium">
                  {product.subtitle}
                </p>
                <p className="text-xl font-serif text-charcoal mt-4 font-light flex items-center space-x-3 flex-wrap gap-y-2 opacity-60">
                  <span className="text-charcoal font-medium">₹{product.salePrice || product.price}.00</span>
                  {product.salePrice && (
                    <>
                      <span className="text-taupe line-through text-base shrink-0">₹{product.price}.00</span>
                      <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-mono font-medium tracking-widest shrink-0">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                      </span>
                    </>
                  )}
                  <span className="text-sm font-sans text-taupe/70 sm:ml-2 block sm:inline w-full sm:w-auto uppercase">{product.volume}</span>
                </p>
              </div>

              <div className="h-[1px] w-full bg-beige/40" />

              {/* Poetic Description */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-light text-charcoal italic tracking-wide">
                  The Art of Formulation
                </h3>
                <p className="text-sm text-taupe leading-relaxed font-light">
                  {product.description}
                </p>
                <p className="text-sm text-taupe leading-relaxed font-light italic mt-2">
                  {product.usage}
                </p>
                
                {product.benefits && product.benefits.length > 0 && (
                  <ul className="space-y-1 mt-4">
                    {product.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-charcoal font-light">
                        <span className="text-gold mt-1">•</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="h-[1px] w-full bg-beige/40" />

              {/* Shade Selector Engine (conditionally rendered) */}
              {hasShades && (
                <div className="space-y-5 pt-2">
                  <div className="flex justify-between items-end">
                    <span className="block text-[11px] font-mono tracking-[0.2em] text-charcoal uppercase">
                      TIVA Bespoke Skin Lab
                    </span>
                    <span className="text-[10px] text-taupe font-mono uppercase">
                      Shade: <span className="text-charcoal font-medium ml-1">{selectedShade}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 opacity-60 pointer-events-none">
                    {SHADES.map((shadeObj) => (
                      <button
                        key={shadeObj.name}
                        onClick={() => setSelectedShade(shadeObj.name)}
                        className={`relative px-4 py-3 border rounded-lg text-left cursor-pointer transition-all flex items-center space-x-3 ${
                          selectedShade === shadeObj.name
                            ? "border-gold bg-gold/5 shadow-sm"
                            : "border-beige/40 bg-white hover:border-gold/50"
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full shadow-inner border border-black/10 shrink-0" 
                          style={{ backgroundColor: shadeObj.color }}
                        />
                        <span className={`block text-xs font-medium flex-1 pr-4 ${selectedShade === shadeObj.name ? 'text-charcoal' : 'text-taupe'}`}>
                          {shadeObj.name}
                        </span>
                        {selectedShade === shadeObj.name && (
                          <Check className="absolute top-1/2 -translate-y-1/2 right-3 w-3.5 h-3.5 text-charcoal/50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkout Actions */}
              <div className="pt-4">
                <button
                  onClick={handleNotifyMe}
                  className="group w-full py-4 border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-xs uppercase font-mono tracking-widest flex items-center justify-center cursor-pointer"
                >
                  <Bell className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  <span>Notify Me When Available</span>
                </button>
                
                <div className="mt-4 flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-taupe/80">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-gold" />
                    <span>Dermatologist Tested</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span>Vegan & Cruelty Free</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}