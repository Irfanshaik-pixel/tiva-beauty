import { useState, useEffect } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../data";
import { Product } from "../types";
import productFrontImg from "../assets/images/product-front.webp";
import productBackImg from "../assets/images/product-back.webp";

interface HeroProps {
  onExplore: () => void;
  onDiscoverRitual: () => void;
  onAddProduct: (prod: Product) => void;
  onProductClick: (id: string) => void;
  onNotifyClick: () => void;
}

export default function Hero({ onExplore, onDiscoverRitual, onAddProduct, onProductClick, onNotifyClick }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const sunscreen = PRODUCTS.find((p) => p.id === "tiva-sunscreen")!;

  // Smooth mouse tilt effect & scroll tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 60; // Wider horizontal rotation arc
      const y = ((e.clientY / innerHeight) - 0.5) * 30;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-ivory overflow-hidden flex flex-col justify-center py-24 lg:py-32" id="hero-section">
      {/* Editorial Decorative Background Details */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft morning sunlight glow */}
        <div className="absolute top-1/4 right-[2%] w-[600px] h-[600px] bg-beige/40 rounded-full blur-[140px] opacity-75" />
        <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[160px] opacity-50" />
        
        {/* Thin elegant gold horizon stripe */}
        <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-beige/25" />
        

        <div className="absolute bottom-12 left-12 hidden xl:block font-mono text-[9px] text-taupe/40 tracking-[0.4em] uppercase leading-relaxed text-left">
          CLINICALLY PROVEN <br />
          ZINC OXIDE 18% MINERALE
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center pt-24 md:pt-32 lg:pt-24 pb-16">
        
        {/* Editorial Narrative Text Columns */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center items-start text-left order-2 lg:order-1 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 border border-gold/20 bg-white/45 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[9px] tracking-[0.2em] font-light uppercase text-charcoal">
                The New Standard of Bio-Hydration
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl xl:text-8xl tracking-tight text-charcoal leading-[1.05] font-light">
              BEAUTY,
              <br />
              <span className="font-serif italic text-gold font-light">ELEVATED.</span>
            </h1>

            <p className="text-sm md:text-base text-taupe font-sans tracking-wide leading-relaxed max-w-sm xl:max-w-md font-light">
              Thoughtfully formulated essentials inspired by timeless Indian beauty rituals, backed by scientific derm-cohesion. We use only biological compounds at cell-cooperative ratios.
            </p>

            {/* Editorial Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
              <button
                onClick={onExplore}
                className="group px-8 py-4 bg-charcoal text-white tracking-[0.25em] text-xs uppercase hover:bg-gold transition-all flex items-center justify-center space-x-3 shadow-md hover:shadow-lg cursor-pointer transition-transform"
                id="hero-explore"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform stroke-[1.5]" />
              </button>

              <button
                onClick={onDiscoverRitual}
                className="px-8 py-4 bg-transparent border border-taupe/20 text-charcoal tracking-[0.25em] text-xs uppercase hover:bg-beige/40 cursor-pointer transition-all flex items-center justify-center"
                id="hero-rituals"
              >
                Discover Rituals
              </button>
            </div>

            {/* Micro details */}
            <div className="pt-8 border-t border-beige/40 flex items-center space-x-8">
              <div>
                <span className="block text-[10px] font-mono uppercase text-taupe tracking-wider">Active</span>
                <span className="block text-xs font-serif text-charcoal mt-1">18% Zinc Oxide</span>
              </div>
              <div className="h-6 w-[1px] bg-beige/50" />
              <div>
                <span className="block text-[10px] font-mono uppercase text-taupe tracking-wider">Protection</span>
                <span className="block text-xs font-serif text-charcoal mt-1">Broad-Spectrum SPF 50+</span>
              </div>
              <div className="h-6 w-[1px] bg-beige/50" />
              <div>
                <span className="block text-[10px] font-mono uppercase text-taupe tracking-wider">Purity</span>
                <span className="block text-xs font-serif text-charcoal mt-1">No Harmful Chemicals</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Rotating Sunscreen Showcase Canvas */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-center justify-center relative min-h-[400px] lg:min-h-[500px] order-1 lg:order-2 z-10 w-full mt-10 lg:mt-0">
          {/* Main Showcase Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full max-w-[400px] flex flex-col items-center"
            style={{ perspective: "1500px" }}
          >
            {/* Ambient Shadow cast by the container */}
            <div
              className="absolute bottom-4 w-4/5 h-6 bg-charcoal/5 rounded-full blur-xl transition-all duration-300"
              style={{
                transform: `translateX(${-mousePos.x * 1.5}px) translateY(${4}px) scale(${1 - Math.abs(mousePos.y) * 0.01})`,
              }}
            />

            {/* Interactive Object Showcase Base */}
            <div className="absolute bottom-8 w-60 h-8 bg-gradient-to-t from-beige/30 to-beige/5 border-t border-white/50 rounded-full blur-md opacity-70 pointer-events-none" />

            {/* THE BOTTLE WRAPPER with true 3D perspective and continuous rotation based on mouse/scroll */}
            <motion.div
              onClick={() => onProductClick(sunscreen.id)}
              className="relative z-10 w-48 h-[22rem] ease-out cursor-pointer group"
              style={{
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateY: (activeSide === "back" ? 180 : 0) + mousePos.x + (scrollY * 0.1),
                rotateX: -mousePos.y * 0.5,
              }}
              transition={{
                rotateY: { type: "spring", stiffness: 40, damping: 20, mass: 0.8 },
                rotateX: { type: "spring", stiffness: 40, damping: 20, mass: 0.8 }
              }}
            >
              {/* Front side of the bottle */}
              <div
                className="absolute inset-0 w-full h-[140%] -top-[20%] flex items-center justify-center pointer-events-none"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg) translateZ(1px)" }}
              >
                <img 
                  src={productFrontImg} 
                  alt="TIVA Product Front" 
                  className="w-full h-full object-contain drop-shadow-2xl scale-[1.35] lg:scale-150" 
                />
              </div>

              {/* Back side of the bottle */}
              <div
                className="absolute inset-0 w-full h-[140%] -top-[20%] flex items-center justify-center pointer-events-none"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg) translateZ(1px)" }}
              >
                <img 
                  src={productBackImg} 
                  alt="TIVA Product Back" 
                  className="w-full h-full object-contain drop-shadow-2xl scale-[1.35] lg:scale-150" 
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Inspection Camera Controls */}
          <div className="flex justify-center items-center space-x-3 mt-12 bg-white/60 backdrop-blur-sm p-1.5 rounded-full border border-beige/40 shadow-sm z-20">
            <button
              onClick={() => setActiveSide("front")}
              className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-mono cursor-pointer transition-all ${
                activeSide === "front"
                  ? "bg-charcoal text-white font-medium"
                  : "text-taupe hover:text-charcoal"
              }`}
              id="hero-view-front"
            >
              Front Product
            </button>
            <button
              onClick={() => setActiveSide("back")}
              className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-mono cursor-pointer transition-all ${
                activeSide === "back"
                  ? "bg-charcoal text-white font-medium"
                  : "text-taupe hover:text-charcoal"
              }`}
              id="hero-view-back"
            >
              Back Packaging
            </button>
          </div>

          {/* Interactive Buy Drawer quick addon under image */}
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={onNotifyClick}
              className="group text-[10px] uppercase font-light tracking-[0.2em] text-charcoal hover:text-gold flex items-center space-x-1 mt-2 focus:outline-none"
              id="hero-quick-add"
            >
              <span>Join Waitlist for Sunscreen</span>
              <span className="text-[8px] tracking-normal border border-charcoal/30 group-hover:border-gold px-1.5 rounded-sm py-0.5 ml-1 leading-none group-hover:bg-gold group-hover:text-white transition-all">
                Notify
              </span>
            </button>
          </div>

          {/* Scrolling indication */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center space-y-2 pointer-events-none opacity-50">
            <span className="text-[8px] tracking-[0.3em] uppercase font-mono text-taupe font-light">
              SCROLL DOWN
            </span>
            <div className="w-[1px] h-8 bg-taupe/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
