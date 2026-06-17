import { useState } from "react";
import { ArrowUpRight, BookOpen, Clock, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { JOURNAL_ARTICLES } from "../data";
import { JournalArticle } from "../types";

export default function Journal() {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  return (
    <section className="bg-white py-24 md:py-32 border-b border-beige/40 scroll-mt-20" id="journal-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24 text-left">
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold block mb-3">
            Quiet Editorial Columns
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal font-light leading-snug">
            The TIVA Chronicle
          </h2>
          <div className="w-16 h-[1px] bg-gold my-5" />
          <p className="text-sm md:text-base text-taupe leading-relaxed font-light">
            Insights at the intersection of bio-dermal chemistry and timeless aesthetic philosophy. Structured for slow, contemplative reading.
          </p>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {JOURNAL_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="group flex flex-col justify-between text-left cursor-pointer"
              onClick={() => setActiveArticle(art)}
              id={`journal-art-${art.id}`}
            >
              {/* Cover Image Frame */}
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-beige/25 border border-beige/12 mb-6 relative">
                <img
                  src={art.image}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/25 transition-colors" />

                {/* Meta float banner */}
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-sm border border-beige/30">
                  <span className="font-mono text-[8px] tracking-widest text-gold uppercase font-medium">
                    {art.category}
                  </span>
                </div>
              </div>

              {/* Text content summaries */}
              <div className="space-y-3">
                <div className="flex items-center space-x-4 font-mono text-[9px] text-taupe">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 stroke-[1.5]" />
                    <span>{art.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 stroke-[1.5]" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-charcoal font-medium group-hover:text-gold transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs md:text-sm text-taupe leading-relaxed font-light font-sans max-w-xl pb-4">
                  {art.excerpt}
                </p>

                <button
                  onClick={() => setActiveArticle(art)}
                  className="inline-flex items-center space-x-1.5 font-mono text-[9px] text-charcoal hover:text-gold uppercase tracking-[0.2em] font-medium border-b border-charcoal/30 pb-0.5 group-hover:border-gold transition-colors"
                  id={`read-article-trigger-${art.id}`}
                >
                  <span>Indulge in Column</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full screen immersive Editorial Reader */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-white">
            
            {/* Smooth back slide */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full min-h-screen py-16 px-6 md:px-12 flex flex-col justify-start relative text-left"
            >
              
              {/* Close command */}
              <button
                onClick={() => setActiveArticle(null)}
                className="fixed top-6 right-6 md:top-12 md:right-12 p-3 bg-ivory rounded-full hover:bg-beige/30 transition-all text-charcoal hover:text-gold z-10 cursor-pointer"
                aria-label="Exit Reader"
                id="close-reader-btn"
              >
                <X className="w-6 h-6 stroke-[1.3]" />
              </button>

              {/* Main reading viewport */}
              <div className="max-w-3xl mx-auto w-full pt-12 space-y-8 font-sans">
                
                {/* Meta heading */}
                <div className="space-y-4">
                  <span className="font-mono text-[9px] text-gold tracking-[0.4em] uppercase block">
                    {activeArticle.category} — TIVA JOURNAL
                  </span>
                  
                  <h1 className="font-serif text-3xl md:text-5xl text-charcoal font-light leading-snug">
                    {activeArticle.title}
                  </h1>

                  <div className="flex items-center space-x-6 text-xs text-taupe font-mono pb-4 border-b border-beige/40">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4.5 h-4.5 stroke-[1.3]" />
                      <span>{activeArticle.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4.5 h-4.5 stroke-[1.3]" />
                      <span>{activeArticle.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Big decorative image asset */}
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-beige/10">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Massive pristine text body */}
                <div className="prose prose-stone max-w-none text-charcoal font-sans text-sm md:text-base leading-[1.8] font-light space-y-6 pt-4">
                  {/* Styled first letter drop cap */}
                  <p className="first-line:uppercase first-line:tracking-wider">
                    {activeArticle.content.split(". ").map((sentence, idx) => {
                      if (idx === 0) {
                        return (
                          <span key={idx} className="block mb-4 text-base md:text-lg font-serif italic text-charcoal/90">
                            {sentence}.
                          </span>
                        );
                      }
                      return sentence + ". ";
                    })}
                  </p>
                </div>

                {/* Footer seal signature */}
                <div className="border-t border-beige/30 pt-12 mt-12 flex flex-col items-center space-y-4 pb-20">
                  <span className="font-serif text-3xl tracking-[0.3em] font-semibold text-charcoal/40 select-none">
                    TIVA
                  </span>
                  <span className="text-[8px] font-mono tracking-[0.4em] text-taupe uppercase">
                    BEAUTY, ELEVATED.
                  </span>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
