import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ArrowRight, BookOpen, Clock, Droplet, User, FlaskConical, Beaker, Sun } from "lucide-react";
import featuredImage from "../assets/images/regenerated_image_1781420113594.png";
import skinBarrierImage from "../assets/images/regenerated_image_1781421376732.png";
import hydrationImage from "../assets/images/regenerated_image_1781425378429.png";
import vitaminCImage from "../assets/images/regenerated_image_1781425499348.png";
import ceramidesImage from "../assets/images/regenerated_image_1781425731683.png";
import morningNightImage from "../assets/images/regenerated_image_1781425839675.png";
import LazyImage from "./ui/LazyImage";

// Fake Articles Data
const CATEGORIES = [
  "All", "Skincare", "Ingredients", "Sun Protection", "Serums", 
  "Moisturizers", "Cleansers", "Lip Care", "Beauty Science", 
  "Wellness", "Skin Barrier", "Routine Guides", "Myths vs Facts", "Seasonal Care"
];

export const ARTICLES = [
  {
    id: 1,
    title: "How SPF Actually Works at a Molecular Level",
    excerpt: "Understanding the physics and chemistry behind modern sun protection and why it is the most critical step in aging prevention.",
    category: "Sun Protection",
    readTime: "8 min read",
    author: "Dr. Ananya Iyer",
    date: "May 12, 2026",
    image: featuredImage,
    featured: true
  },
  {
    id: 2,
    title: "Why Your Skin Barrier Matters More Than Active Ingredients",
    excerpt: "Before introducing powerful exfoliants and serums, you must ensure the foundation of your skin is structurally sound.",
    category: "Skin Barrier",
    readTime: "5 min read",
    author: "Maya Sharma, Lead Formulator",
    date: "Apr 28, 2026",
    image: skinBarrierImage
  },
  {
    id: 3,
    title: "The Difference Between Hydration & Moisturization",
    excerpt: "These terms are often used interchangeably, but they serve completely different biological functions in skincare.",
    category: "Moisturizers",
    readTime: "4 min read",
    author: "Dr. Rajiv Menon",
    date: "Apr 15, 2026",
    image: hydrationImage
  },
  {
    id: 4,
    title: "How Vitamin C Brightens Skin and Builds Collagen",
    excerpt: "An in-depth look at L-Ascorbic acid, stabilization techniques, and how antioxidants protect cellular integrity.",
    category: "Ingredients",
    readTime: "7 min read",
    author: "Maya Sharma, Lead Formulator",
    date: "Mar 02, 2026",
    image: vitaminCImage
  },
  {
    id: 5,
    title: "Ceramides Explained: The Mortar of Your Skin",
    excerpt: "Why these lipids make up 50% of your epidermis and how substituting them can reverse compromised skin.",
    category: "Ingredients",
    readTime: "6 min read",
    author: "Dr. Sneha Desai",
    date: "Feb 20, 2026",
    image: ceramidesImage
  },
  {
    id: 6,
    title: "Morning vs Night Routine: What Actually Changes",
    excerpt: "Optimizing your skincare steps based on your circadian rhythm and the biological priorities of your skin at different hours.",
    category: "Routine Guides",
    readTime: "6 min read",
    author: "TIVA Editorial Board",
    date: "Jan 10, 2026",
    image: morningNightImage
  }
];

const MYTHS = [
  { myth: "Oily skin doesn't need moisturizer.", fact: "Hydration supports a healthy skin barrier regardless of skin type. Dehydration can actually trigger excess oil production." },
  { myth: "You only need SPF when it's sunny.", fact: "UVA rays penetrate clouds and glass, causing premature aging and DNA damage every single day of the year." },
  { myth: "Pores can shrink or open up.", fact: "Pores do not have muscles. They cannot open or close. You can only minimize their appearance by keeping them clear of sebum." }
];

const luxuryEase = [0.22, 1, 0.36, 1];

export default function JournalPage({ onArticleClick }: { onArticleClick?: (id: number) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMyth, setActiveMyth] = useState<number | null>(null);

  const featuredArticle = ARTICLES.find(a => a.featured);
  const regularArticles = ARTICLES.filter(a => !a.featured && (activeCategory === "All" || a.category === activeCategory) && a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className="bg-ivory min-h-screen text-charcoal font-sans selection:bg-gold/20 selection:text-charcoal w-full relative pt-20"
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-beige/20 blur-[100px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
           transition={{ duration: 1, ease: luxuryEase }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-taupe mb-6 block">Editorial & Science</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-charcoal leading-tight mb-8">
            Knowledge Creates <span className="italic text-gold font-light">Better Skin.</span>
          </h1>
          <p className="text-taupe/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Science-backed skincare education, ingredient guides, routines, and beauty insights curated by TIVA.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter Nav */}
      <div className="sticky top-20 z-40 bg-ivory/90 backdrop-blur-md border-y border-beige/40 py-4 mb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex overflow-x-auto justify-start gap-3 w-full md:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-500 overflow-hidden ${
                  activeCategory === category ? "text-charcoal" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                <span className="relative z-10">{category}</span>
                {activeCategory === category ? (
                  <motion.div layoutId="activeCatJournal" className="absolute inset-0 bg-white border border-gold/40 shadow-sm rounded-full z-0" transition={{ duration: 0.6, ease: luxuryEase }} />
                ) : (
                  <div className="absolute inset-0 border border-beige rounded-full z-0 transition-colors hover:border-charcoal/20" />
                )}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 shrink-0">
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-beige rounded-full py-2.5 pl-10 pr-4 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" />
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && activeCategory === "All" && !searchQuery && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 relative z-10">
          <span className="font-mono text-xs tracking-widest text-gold uppercase mb-6 block border-b border-beige/50 pb-2">Featured Story</span>
          <motion.div 
            onClick={() => onArticleClick?.(featuredArticle.id)}
            whileHover={{ y: -8 }}
            className="group block overflow-hidden rounded-3xl bg-white border border-beige cursor-pointer transition-all duration-700 hover:shadow-xl hover:shadow-gold/5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-80 lg:h-full min-h-[20rem] overflow-hidden">
                <LazyImage src={featuredArticle.image} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-6 font-mono text-[10px] text-taupe uppercase tracking-widest">
                  <span className="bg-beige/30 px-3 py-1 rounded-full text-charcoal">{featuredArticle.category}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {featuredArticle.readTime}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-charcoal mb-6 leading-tight group-hover:text-gold transition-colors duration-500">
                  {featuredArticle.title}
                </h2>
                <p className="text-taupe font-light mb-8 text-lg leading-relaxed">{featuredArticle.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-beige/40">
                  <span className="text-xs text-taupe">{featuredArticle.author} · {featuredArticle.date}</span>
                  <div className="w-10 h-10 rounded-full border border-beige flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors duration-500">
                    <ArrowRight className="w-4 h-4 text-charcoal group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Editor Picks Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32 relative z-10">
        <div className="flex justify-between items-end mb-10 border-b border-beige/50 pb-4">
          <h3 className="font-serif text-2xl md:text-3xl text-charcoal">Editor's Picks</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <motion.div 
              onClick={() => onArticleClick?.(article.id)}
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: luxuryEase }}
              className="group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden mb-6 h-64 relative border border-beige/50">
                <LazyImage src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-charcoal shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-3 font-mono text-[10px] text-taupe uppercase tracking-widest">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {article.readTime}</span>
              </div>
              <h4 className="font-serif text-xl md:text-2xl text-charcoal mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                {article.title}
              </h4>
              <p className="text-taupe font-light text-sm mb-6 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-taupe">{article.author}</span>
                <span className="text-[11px] text-taupe/60">{article.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {regularArticles.length === 0 && (
          <div className="text-center py-24 text-taupe font-light">
            No articles found matching your criteria.
          </div>
        )}
      </section>

      {/* Routine Timeline */}
      <section className="bg-white py-32 border-y border-beige/40 relative z-10">
         <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="font-mono text-xs tracking-widest text-gold uppercase mb-4 block">Visualizer</span>
              <h3 className="font-serif text-3xl md:text-4xl text-charcoal">The Perfect Routine</h3>
              <p className="text-taupe font-light mt-4">A simple, effective timeline for optimal skin health.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center bg-ivory p-6 rounded-2xl border border-beige/60 relative">
                <div className="w-16 h-16 rounded-full bg-white border border-beige flex items-center justify-center shrink-0 mb-4 md:mb-0 md:mr-8 shadow-sm">
                   <Sun className="w-6 h-6 text-gold" />
                </div>
                <div>
                   <h4 className="font-serif text-xl mb-2 text-charcoal">Morning Protocol</h4>
                   <p className="text-sm text-taupe font-light leading-relaxed">Focus on protection and prevention. Cleanser (optional) → Antioxidant Serum (Vitamin C) → Moisturizer → Sunscreen (SPF 50).</p>
                </div>
              </div>
              
              <div className="flex justify-center py-2">
                 <div className="w-px h-8 bg-gold/30"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center bg-charcoal text-ivory p-6 rounded-2xl relative">
                <div className="w-16 h-16 rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center shrink-0 mb-4 md:mb-0 md:mr-8 shadow-sm">
                   <MoonIcon />
                </div>
                <div>
                   <h4 className="font-serif text-xl mb-2 text-ivory">Evening Protocol</h4>
                   <p className="text-sm text-ivory/70 font-light leading-relaxed">Focus on repair and cellular turnover. Double Cleanse → Treatment Serum (Retinol or Peptides) → Barrier Repair Moisturizer → Lip Core.</p>
                </div>
              </div>
            </div>
         </div>
      </section>

      {/* Myths vs Facts */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h3 className="font-serif text-3xl md:text-4xl text-charcoal">Skincare Myths vs Facts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MYTHS.map((item, idx) => (
             <motion.div 
               key={idx}
               className="relative h-64 [perspective:1000px] cursor-pointer group"
               onClick={() => setActiveMyth(activeMyth === idx ? null : idx)}
             >
                <motion.div 
                  className="w-full h-full transition-all duration-700 [transform-style:preserve-3d] relative"
                  animate={{ rotateY: activeMyth === idx ? 180 : 0 }}
                >
                   {/* Front */}
                   <div className="absolute inset-0 bg-white border border-beige rounded-2xl p-8 flex flex-col justify-center text-center [backface-visibility:hidden] shadow-sm group-hover:shadow-md transition-shadow">
                      <span className="font-mono text-xs text-taupe uppercase tracking-widest mb-4">The Myth</span>
                      <p className="font-serif text-lg text-charcoal">"{item.myth}"</p>
                      <div className="mt-8 text-[10px] font-mono text-gold uppercase tracking-widest">Click to reveal fact</div>
                   </div>
                   {/* Back */}
                   <div className="absolute inset-0 bg-charcoal border border-charcoal rounded-2xl p-8 flex flex-col justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm">
                      <span className="font-mono text-xs text-gold uppercase tracking-widest mb-4">The Fact</span>
                      <p className="font-sans text-sm font-light text-ivory leading-relaxed">{item.fact}</p>
                   </div>
                </motion.div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-ivory border-t border-beige/40 py-24 relative z-10 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-mono text-xs tracking-widest text-gold uppercase mb-4 block">Subscribe</span>
          <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">Stay Curious. Stay Informed.</h3>
          <p className="text-taupe font-light mb-8">Receive skincare education, ingredient insights, and wellness articles before everyone else. No spam, just pure knowledge.</p>
          <div className="relative max-w-md mx-auto">
             <input type="email" placeholder="Email address" className="w-full bg-white border border-beige rounded-full py-4 pl-6 pr-32 text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
             <button className="absolute right-2 top-2 bottom-2 bg-charcoal text-ivory rounded-full px-6 text-xs font-mono uppercase tracking-widest hover:bg-gold transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );
}
