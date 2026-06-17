import { useState } from "react";
import { Sparkles, Info, Heart, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INGREDIENTS } from "../data";
import { Ingredient } from "../types";

export default function IngredientCodex() {
  const [selectedIng, setSelectedIng] = useState<Ingredient>(INGREDIENTS[0]);
  const [userSkinType, setUserSkinType] = useState<string>("all");

  const skinTypes = [
    { id: "all", label: "Show All" },
    { id: "dry", label: "Dry & Dehydrated" },
    { id: "oily", label: "Oily & Congested" },
    { id: "sensitive", label: "Sensitive & Flushed" },
    { id: "combination", label: "Balanced / Mixed" },
  ];

  const getCompatibilityScore = (ing: Ingredient, skin: string): number => {
    if (skin === "all") return 100;
    
    const labelLower = skin.toLowerCase();
    const ingTitle = ing.name.toLowerCase();
    const compText = ing.skinTypeCompatibility.toLowerCase();
    
    // Custom scientific matching logic
    if (labelLower === "dry") {
      if (ingTitle.includes("sea buckthorn")) return 98;
      if (ingTitle.includes("saffron")) return 92;
      return 85;
    }
    if (labelLower === "sensitive") {
      if (ingTitle.includes("centella")) return 99;
      if (ingTitle.includes("niacinamide")) return 90;
      return 80;
    }
    if (labelLower === "oily") {
      if (ingTitle.includes("niacinamide")) return 98;
      if (ingTitle.includes("centella")) return 88;
      return 60; // Oils are less optimal
    }
    if (labelLower === "combination") {
      return 95; // highly versatile
    }
    return 90;
  };

  return (
    <section className="bg-white py-24 md:py-32 border-b border-beige/40 scroll-mt-20" id="ingredients-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24 text-left">
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold block mb-3">
            Pure Scientific Credibility
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal font-light leading-snug">
            The Ingredient Codex
          </h2>
          <div className="w-16 h-[1px] bg-gold my-6" />
          <p className="text-sm md:text-base text-taupe leading-relaxed font-light">
            We operate on a strict philosophy of zero redundant filler. Every peptide and botanical stem exist for a molecular purpose. Filter below to discover biocompatible alignments.
          </p>
        </div>

        {/* Dynamic Skin Type Compatibility Matcher */}
        <div className="mb-12">
          <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-taupe mb-4">
            Filter by your Current Bio-State
          </span>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {skinTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setUserSkinType(t.id)}
                className={`px-5 py-2.5 rounded-full text-xs tracking-wider cursor-pointer transition-all border ${
                  userSkinType === t.id
                    ? "bg-charcoal text-white border-charcoal font-medium"
                    : "bg-ivory/40 text-taupe border-beige/60 hover:bg-beige/25"
                }`}
                id={`skin-filter-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Codex Visual Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* Active Ingredients Selector Column */}
          <div className="lg:col-span-5 space-y-4">
            {INGREDIENTS.map((ing) => {
              const score = getCompatibilityScore(ing, userSkinType);
              const isSelected = selectedIng.name === ing.name;

              return (
                <button
                  key={ing.name}
                  onClick={() => setSelectedIng(ing)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-ivory/60 border-gold shadow-sm"
                      : "bg-white border-beige/40 hover:border-beige/80 hover:bg-ivory/20"
                  }`}
                  id={`ing-selector-${ing.name.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {/* Score Indicator Badge */}
                  {userSkinType !== "all" && (
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-white/85 px-2.5 py-1 rounded-full border border-beige/30 shadow-xs">
                      <Heart className={`w-3 h-3 ${score > 85 ? "text-rose-500 fill-rose-500" : "text-taupe"}`} />
                      <span className="font-mono text-[9px] font-medium text-charcoal">
                        {score}% Match
                      </span>
                    </div>
                  )}

                  <span className="block text-[8px] font-mono tracking-[0.3em] uppercase text-taupe mb-1">
                    {ing.role}
                  </span>
                  
                  <span className="block font-serif text-xl text-charcoal font-medium group-hover:text-gold transition-colors">
                    {ing.name}
                  </span>

                  <span className="block text-[10px] font-sans text-taupe italic mt-1 pb-1">
                    {ing.scientificName}
                  </span>

                  {/* Micro tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-beige/10">
                    {ing.benefitTags.map(tag => (
                      <span key={tag} className="text-[8px] tracking-wider uppercase bg-white/90 border border-beige/40 font-mono text-taupe px-2 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Luxury Specification Sheet Panel */}
          <div className="lg:col-span-7 bg-ivory rounded-3xl p-8 md:p-10 border border-beige/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIng.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
                id="codex-spec-sheet"
              >
                <div>
                  <span className="font-mono text-[10px] text-gold uppercase tracking-[0.4em] block mb-2">
                    BIOMETRIC DATA REPORT
                  </span>
                  <div className="flex flex-col md:flex-row md:items-baseline md:space-x-4">
                    <h3 className="font-serif text-3xl text-charcoal font-medium">
                      {selectedIng.name}
                    </h3>
                    <span className="text-xs font-serif italic text-taupe mt-1 md:mt-0">
                      {selectedIng.scientificName}
                    </span>
                  </div>
                  <div className="h-[1px] bg-beige/50 w-full mt-4" />
                </div>

                <div className="space-y-4">
                  <p className="text-sm md:text-base text-charcoal leading-relaxed font-light">
                    {selectedIng.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-white/60 p-5 rounded-xl border border-beige/10">
                    <span className="block text-[9px] font-mono text-taupe uppercase tracking-widest mb-1">
                      Molecular Synergy
                    </span>
                    <span className="block text-xs font-serif text-charcoal leading-relaxed">
                      {selectedIng.synergy}
                    </span>
                  </div>

                  <div className="bg-white/60 p-5 rounded-xl border border-beige/10">
                    <span className="block text-[9px] font-mono text-taupe uppercase tracking-widest mb-1">
                      Sourcing Coordinates
                    </span>
                    <span className="block text-xs font-serif text-charcoal leading-relaxed">
                      {selectedIng.origin}
                    </span>
                  </div>
                </div>

                <div className="border-t border-beige/30 pt-6 space-y-4">
                  <div className="flex justify-between items-center bg-white/40 p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-taupe">
                        Target Biotype Alignment
                      </span>
                    </div>
                    <span className="text-xs uppercase text-charcoal font-medium tracking-wide">
                      Optimal
                    </span>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-left">
                    <Info className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <p className="text-[10px] text-taupe uppercase tracking-widest leading-relaxed">
                      CRITICAL METARATIONAL NOTE: {selectedIng.name} is processed at sterile sub-temperatures below 40 degrees Celsius to halt active polyphenol denaturation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
