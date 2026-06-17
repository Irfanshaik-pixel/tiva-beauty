import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Search, ChevronDown, Check, Droplet, Shield, Beaker, Hexagon } from "lucide-react";

// Types
type Category = "All" | "Sunscreen" | "Moisturizer" | "Serum" | "Cleanser" | "Lip Oil";

interface Ingredient {
  name: string;
  benefits: string[];
  description?: string;
  function?: string;
  origin?: string;
}

interface ProductDetails {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  philosophy: string[];
  ingredients: Ingredient[];
}

const CATEGORIES: Category[] = ["All", "Sunscreen", "Moisturizer", "Serum", "Cleanser", "Lip Oil"];

const PRODUCTS_DATA: ProductDetails[] = [
  {
    id: "sunscreen",
    category: "Sunscreen",
    title: "TIVA Tinted Sunscreen SPF 50+",
    subtitle: "Protection That Looks Like Skin.",
    description: "Daily broad spectrum mineral protection with skincare benefits and natural glow finish designed specifically for Indian skin tones.",
    philosophy: [
      "Hybrid skincare + makeup.",
      "Weightless texture.",
      "No white cast.",
      "Daily wearable luxury."
    ],
    ingredients: [
      { name: "Niacinamide", benefits: ["Improves uneven skin tone", "Supports barrier repair", "Reduces appearance of pores", "Controls excess oil"] },
      { name: "Hyaluronic Acid", benefits: ["Deep hydration", "Plumps skin", "Prevents dehydration", "Maintains moisture balance"] },
      { name: "Vitamin E", benefits: ["Powerful antioxidant", "Protects from environmental stress", "Supports healthy skin barrier"] },
      { name: "Bisabolol", benefits: ["Calms redness", "Soothes irritation", "Sensitive skin friendly"] },
      { name: "Titanium Dioxide", benefits: ["Mineral UV filter", "Reflects UV rays", "Gentle protection"] },
      { name: "Zinc Oxide", benefits: ["Broad spectrum protection", "Anti-inflammatory", "Suitable for acne-prone skin"] },
      { name: "Iron Oxides", benefits: ["Provide natural tint", "Protect against visible light", "Improve shade adaptation"] }
    ]
  },
  {
    id: "moisturizer",
    category: "Moisturizer",
    title: "TIVA Daily Moisturizer",
    subtitle: "Hydration Without Weight.",
    description: "Barrier-first deep hydration that melts into skin without heaviness, perfect for everyday use under makeup.",
    philosophy: [
      "Barrier-first skincare.",
      "Deep hydration without heaviness.",
      "Perfect under makeup.",
      "Suitable for daily use."
    ],
    ingredients: [
      { name: "Ceramides", benefits: ["Strengthen skin barrier", "Reduce moisture loss", "Improve elasticity"] },
      { name: "Panthenol", benefits: ["Hydrates", "Repairs", "Soothes irritation"] },
      { name: "Hyaluronic Acid", benefits: ["Water retention", "Deep hydration", "Skin plumping"] },
      { name: "Squalane", benefits: ["Lightweight nourishment", "Soft finish", "Balances skin"] },
      { name: "Glycerin", benefits: ["Draws moisture", "Long-lasting hydration"] }
    ]
  },
  {
    id: "serum",
    category: "Serum",
    title: "TIVA Brightening Serum",
    subtitle: "Powered by Science & Nature.",
    description: "High-performance active blend designed for visible radiance while remaining gentle enough for everyday use.",
    philosophy: [
      "High-performance active blend.",
      "Visible radiance.",
      "Gentle everyday use."
    ],
    ingredients: [
      { name: "Vitamin C", benefits: ["Brightens skin", "Improves radiance", "Fades pigmentation", "Supports collagen"] },
      { name: "Niacinamide", benefits: ["Balances tone", "Reduces pores", "Strengthens barrier"] },
      { name: "Ferulic Acid", benefits: ["Antioxidant protection", "Improves Vitamin C stability", "Fights free radicals"] },
      { name: "Hyaluronic Acid", benefits: ["Hydrates deeply", "Smooth texture", "Maintains moisture"] }
    ]
  },
  {
    id: "cleanser",
    category: "Cleanser",
    title: "TIVA Gentle Cleanser",
    subtitle: "Cleanse Without Compromise.",
    description: "Soap-free, low irritation formula that respects the skin microbiome and leaves skin clean, never stripped.",
    philosophy: [
      "Soap-free.",
      "Low irritation.",
      "Respects skin microbiome.",
      "Leaves skin clean, never stripped."
    ],
    ingredients: [
      { name: "Amino Acids", benefits: ["Gentle cleansing", "Maintains natural balance", "Removes impurities"] },
      { name: "Ceramides", benefits: ["Barrier support", "Prevents dryness", "Locks moisture"] },
      { name: "Panthenol", benefits: ["Hydration", "Calming", "Repair support"] },
      { name: "Glycerin", benefits: ["Softness", "Moisture retention", "Comfort after cleansing"] }
    ]
  },
  {
    id: "lipoil",
    category: "Lip Oil",
    title: "TIVA Glass Lip Oil",
    subtitle: "Nourishment With Glass Shine.",
    description: "Treatment meets shine with a non-sticky, comfortable everyday wear formula.",
    philosophy: [
      "Treatment meets shine.",
      "Non-sticky.",
      "Comfortable everyday wear."
    ],
    ingredients: [
      { name: "Jojoba Oil", benefits: ["Softens lips", "Locks moisture"] },
      { name: "Vitamin E", benefits: ["Protects against dryness", "Repairs damaged lips"] },
      { name: "Squalane", benefits: ["Smooth finish", "Lightweight nourishment"] },
      { name: "Sunflower Seed Oil", benefits: ["Essential fatty acids", "Long-lasting hydration"] }
    ]
  }
];

const GLOSSARY = PRODUCTS_DATA.flatMap(p => p.ingredients).filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i).sort((a, b) => a.name.localeCompare(b.name));

const PRINCIPLES = [
  { title: "Clean Beauty", icon: <Shield className="w-5 h-5 text-gold" />, desc: "Formulated without parabens, sulfates, or harmful endocrine disruptors." },
  { title: "Dermatologically Tested", icon: <Beaker className="w-5 h-5 text-gold" />, desc: "Rigorously tested for safety and efficacy across diverse skin biotypes." },
  { title: "Cruelty Free", icon: <Sparkles className="w-5 h-5 text-gold" />, desc: "We never test on animals. Our commitment to ethical beauty is absolute." },
  { title: "Consciously Made", icon: <Droplet className="w-5 h-5 text-gold" />, desc: "Sustainably sourced ingredients minimizing ecological impact." }
];

const luxuryEase = [0.22, 1, 0.36, 1];

const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] bg-gold/10 rounded-full pointer-events-none blur-[100px] z-50 hidden lg:block"
      animate={{
        x: mousePosition.x - 200,
        y: mousePosition.y - 200,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.8 }}
    />
  );
};

const MoleculeIcon = () => {
  return (
    <div className="w-10 h-10 mb-6 relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-dashed border-gold/40 rounded-full"
      >
        <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-gold/80 rounded-full blur-[1px]" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
        className="absolute -inset-1.5 border border-dotted border-beige/60 rounded-full"
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-10"
        whileHover={{ rotate: 8, scale: 1.15 }}
        transition={{ duration: 0.5, ease: luxuryEase }}
      >
        <Hexagon className="w-5 h-5 text-gold group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] transition-all duration-500" strokeWidth={1.5} />
      </motion.div>
    </div>
  );
};

const AnimatedSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const RevealText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.span 
      className={`inline-flex flex-wrap ${className || ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.03 }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: luxuryEase } }
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

export default function IngredientsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const filteredProducts = activeCategory === "All" ? PRODUCTS_DATA : PRODUCTS_DATA.filter(p => p.category === activeCategory);
  const filteredGlossary = GLOSSARY.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className="bg-ivory min-h-screen text-charcoal font-sans selection:bg-gold/20 selection:text-charcoal relative overflow-hidden" 
      id="ingredients-view"
    >
      <CursorGlow />
      
      {/* Background Animated Blobs & Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-white/40 blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -80, 40, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[20%] w-[50vw] h-[50vw] rounded-full bg-beige/40 blur-[120px]"
        />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: Math.random() * 0.5,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 10}vh`],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-40 pb-24 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: luxuryEase }}>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-taupe block mb-6">Ingredients Codex</span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-charcoal leading-tight mb-8 text-balance mx-auto">
            Every ingredient has a purpose.<br className="hidden md:block" />
            <span className="text-taupe"> Every formulation has a story.</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
            className="text-taupe/80 font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-12 text-balance"
          >
            Thoughtfully selected actives, proven by science and inspired by nature.
          </motion.p>
        </motion.div>
      </div>

      {/* Category Pills Navigation */}
      <div className="sticky top-20 z-40 bg-ivory/90 backdrop-blur-md border-y border-beige/40 py-4 mb-24">
        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`max-w-7xl mx-auto flex overflow-x-auto justify-start xl:justify-center gap-3 px-6 pb-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? "cursor-grabbing" : "cursor-default sm:cursor-grab"} touch-pan-x`}
        >
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative shrink-0 whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-500 overflow-hidden ${
                activeCategory === category 
                ? "text-charcoal" 
                : "text-charcoal/60 hover:text-charcoal"
              }`}
            >
              <span className="relative z-10">{category}</span>
              {activeCategory === category ? (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-white border border-gold/40 shadow-sm rounded-full z-0"
                  transition={{ duration: 0.6, ease: luxuryEase }}
                />
              ) : (
                <div className="absolute inset-0 border border-beige rounded-full z-0 transition-colors hover:border-charcoal/20" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Editorials */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-32 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="space-y-40"
          >
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start"
              >
                {/* Left Column: Context & Philosophy */}
                <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-8">
                  <div className="space-y-4">
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: luxuryEase }}
                      className="text-xs font-mono uppercase tracking-[0.2em] text-gold block"
                    >
                      {product.category}
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">
                      <RevealText text={product.title} />
                    </h2>
                    <motion.p 
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                      className="font-serif text-lg text-taupe italic"
                    >
                      {product.subtitle}
                    </motion.p>
                  </div>
                  <motion.div 
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: luxuryEase }}
                    className="w-12 h-[1px] bg-charcoal/20 origin-left" 
                  />
                  <motion.p 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    className="text-charcoal/80 font-light leading-relaxed"
                  >
                    {product.description}
                  </motion.p>
                  <AnimatedSection className="pt-8">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-charcoal mb-4">Formulation Philosophy</h4>
                    <ul className="space-y-3">
                      {product.philosophy.map((item, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease: luxuryEase }}
                          className="flex items-start text-sm text-taupe font-light"
                        >
                          <Check className="w-4 h-4 text-gold mr-3 mt-0.5 shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </AnimatedSection>
                </div>

                {/* Right Column: Key Ingredients */}
                <div className="lg:col-span-7">
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal mb-8 border-b border-beige/60 pb-4">Key Actives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.ingredients.map((ing, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: luxuryEase, delay: i * 0.08 }}
                        whileHover={{ 
                          y: -8, 
                          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
                          borderColor: "rgba(212, 175, 55, 0.4)",
                          backgroundColor: "rgba(255, 255, 255, 0.95)"
                        }}
                        className="bg-white/50 backdrop-blur-sm border border-beige p-8 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] group"
                      >
                        <MoleculeIcon />
                        <h3 className="font-serif text-xl text-charcoal mb-4 group-hover:text-gold transition-colors duration-500">{ing.name}</h3>
                        <ul className="space-y-3">
                          {ing.benefits.map((benefit, j) => (
                            <motion.li 
                              key={j} 
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: i * 0.08 + j * 0.1, ease: luxuryEase }}
                              className="text-sm font-light text-taupe flex items-start"
                            >
                              <div className="w-1.5 h-1.5 bg-gold/50 rounded-full mr-3 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* A-Z Glossary */}
      <AnimatedSection className="bg-white py-32 border-y border-beige/40 relative z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">Ingredient Library</h2>
            <p className="text-taupe font-light">A-Z searchable ingredient glossary and scientific notes.</p>
          </div>
          
          <div className="relative mb-12">
            <input 
              type="text" 
              placeholder="Search ingredient (e.g. Ceramide, Zinc Oxide)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ivory border border-beige/60 rounded-full py-4 pl-12 pr-6 text-sm font-light focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
          </div>

          <div className="space-y-2">
            {filteredGlossary.map((ingredient, idx) => {
              const isExpanded = expandedGlossary === ingredient.name;
              return (
                <div key={idx} className="border-b border-beige/60 last:border-0">
                  <button 
                    onClick={() => setExpandedGlossary(isExpanded ? null : ingredient.name)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">{ingredient.name}</span>
                    <ChevronDown className={`w-4 h-4 text-taupe transition-transform duration-500 ease-[0.22,1,0.36,1] ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: luxuryEase }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pt-2 space-y-4 text-sm text-taupe font-light">
                          <p><strong className="font-medium text-charcoal">Function:</strong> Primary active agent.</p>
                          <div>
                            <strong className="font-medium text-charcoal">Benefits:</strong>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {ingredient.benefits.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          </div>
                          <p><strong className="font-medium text-charcoal">Scientific Notes:</strong> Selected for its high biocompatibility and clinically proven efficacy in dermatological formulations.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {filteredGlossary.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-taupe font-light text-sm">
                No ingredients found matching "{searchQuery}".
              </motion.div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Formulation Principles */}
      <AnimatedSection className="bg-ivory text-charcoal py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-taupe block mb-4">Our Commitment</span>
            <h2 className="text-3xl md:text-5xl font-serif">Formulation Principles</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRINCIPLES.map((principle, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: luxuryEase }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 border border-white/5 transition-all text-center group shadow-sm hover:shadow-xl hover:shadow-gold/5"
              >
                <div className="w-12 h-12 rounded-full bg-beige/50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 ease-out">
                  {principle.icon}
                </div>
                <h3 className="font-serif text-lg mb-3">{principle.title}</h3>
                <p className="text-sm font-light text-taupe/80 leading-relaxed">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: luxuryEase }}
            className="flex flex-wrap justify-center gap-4 mt-16 pt-16 border-t border-beige/40"
          >
             <span className="text-xs font-mono text-taupe border border-beige px-4 py-2 rounded-full hover:border-gold/50 transition-colors cursor-default">No unnecessary fillers</span>
             <span className="text-xs font-mono text-taupe border border-beige px-4 py-2 rounded-full hover:border-gold/50 transition-colors cursor-default">Balanced active percentages</span>
             <span className="text-xs font-mono text-taupe border border-beige px-4 py-2 rounded-full hover:border-gold/50 transition-colors cursor-default">Luxury textures</span>
          </motion.div>
        </div>
      </AnimatedSection>
    </motion.div>
  );
}

