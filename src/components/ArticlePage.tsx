import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react";
import { ARTICLES } from "./JournalPage";
import spfDetailImage from "../assets/images/regenerated_image_1781425499348.png";
import ceramidesImage from "../assets/images/regenerated_image_1781425731683.png";
import morningNightImage from "../assets/images/regenerated_image_1781425839675.png";
import LazyImage from "./ui/LazyImage";

const luxuryEase = [0.22, 1, 0.36, 1];

export default function ArticlePage({ id, onBack }: { id: number, onBack: () => void }) {
  const article = ARTICLES.find((a) => a.id === id);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!article) return <div className="min-h-screen pt-32 text-center font-serif text-2xl">Article not found.</div>;

  const generateContent = (title: string) => {
    if (title.includes("SPF Actually Works")) {
      return [
        { type: "h2", text: "The Physics of Photoprotection" },
        { type: "p", text: "Sun protection factor (SPF) isn't just a number; it's a measure of time and energy. At a molecular level, UV filters work by intercepting photons before they can interact with our cellular DNA. The narrative surrounding skincare has shifted from quick fixes to long-term architectural integrity, with SPF at the forefront." },
        { type: "quote", text: "Prevention is scientifically proven to be more effective than correction. Sunscreen is your first line of defense." },
        { type: "p", text: "Chemical filters absorb UV radiation and convert it into low-impact heat, while physical filters like Zinc Oxide scatter and reflect the light. When we consider how formulations are constructed, polarity and structural compatibility dictate whether an active simply sits on the epidermis or whether it reaches the dermis to enact structural change." },
        { type: "callout", title: "Key Mechanisms of UV Filters", list: ["Photon absorption and energy dissipation.", "Reflection and scattering of UV rays.", "Prevention of free radical formation and DNA mutation."] },
        { type: "h2", text: "Broad Spectrum Matters" },
        { type: "p", text: "Isolation is rarely the answer. In nature as in formulation, ingredients perform best within perfectly calibrated ecosystems. Formulating a broad-spectrum SPF requires carefully balancing UVA and UVB filters to achieve complete coverage without compromising texture." },
        { type: "p", text: "As you curate your routine, consider not merely the SPF rating, but the texture and wearability. The best sunscreen is the one you will seamlessly wear every single day." }
      ];
    }
    if (title.includes("Skin Barrier Matters")) {
      return [
        { type: "h2", text: "The Stratum Corneum: Your First Defense" },
        { type: "p", text: "In the evolving landscape of modern dermatology, understanding how our cellular barriers interact with topical formulations has never been more critical. Your skin barrier, or stratum corneum, is a complex brick-and-mortar structure designed to keep pathogens out and hydration in." },
        { type: "quote", text: "You cannot build a healthy complexion on a compromised foundation. The barrier must come first." },
        { type: "p", text: "At the molecular level, every ingredient must justify its inclusion. Fillers and aggressive stripping agents have given way to biomimetic structures—ingredients that mirror the skin's native composition. When your barrier is compromised by over-exfoliation, microscopic fissures allow trans-epidermal water loss (TEWL) and irritants to enter." },
        { type: "callout", title: "Signs of a Compromised Barrier", list: ["Increased sensitivity and stinging upon product application.", "Redness, flaking, or unusual texture.", "Sudden breakouts in typically clear areas."] },
        { type: "h2", text: "Rebuilding the Architecture" },
        { type: "p", text: "Barrier-replenishing agents thrive when paired with exact ratios of ceramides, cholesterol, and fatty acids. It is crucial to pause active treatments like retinoids and acids until the barrier function is restored." },
        { type: "p", text: "This is the new frontier of cosmetic chemistry—creating formulations so precisely engineered they disappear into your cellular matrix, rebuilding the structural integrity from the outside in." }
      ];
    }
    if (title.includes("Difference Between Hydration")) {
      return [
        { type: "h2", text: "Water vs. Oil: The Biological Distinction" },
        { type: "p", text: "These terms are often used interchangeably, but they serve completely different biological functions in skincare. Hydration refers to the water content within the skin cells, making them plump and luminous. Moisturization refers to trapping and sealing that water in." },
        { type: "quote", text: "Hydrators bring water to the cellular table. Moisturizers ensure it doesn't leave." },
        { type: "p", text: "At the molecular level, humectants like Hyaluronic Acid and Glycerin bind to water molecules, pulling them into the epidermis. However, without an occlusive or emollient layer to seal them in, this water will simply evaporate in dry environments." },
        { type: "callout", title: "Categorizing Ingredients", list: ["Humectants (Hydrators): Glycerin, Hyaluronic Acid, Aloe Vera.", "Emollients (Softeners): Squalane, Jojoba Oil, Ceramides.", "Occlusives (Sealers): Petrolatum, Shea Butter, Beeswax."] },
        { type: "h2", text: "The Perfect Balance" },
        { type: "p", text: "Isolation is rarely the answer. Ingredients perform best within perfectly calibrated ecosystems. Dehydrated skin needs water (humectants), while dry skin lacks oil (emollients and occlusives)." },
        { type: "p", text: "As you curate your routine, consider not merely the active ingredient, but whether your skin is naturally lacking in oil production or simply depleted of water due to environmental stressors." }
      ];
    }
    if (title.includes("Vitamin C Brightens")) {
      return [
        { type: "h2", text: "The Power of L-Ascorbic Acid" },
        { type: "p", text: "Vitamin C is the gold standard of topical antioxidants. It protects cellular integrity by neutralizing free radicals—unstable molecules generated by UV exposure and pollution that damage collagen and elastin." },
        { type: "quote", text: "Antioxidants act as cellular shields, sacrificing themselves to stabilize free radicals before they can cause DNA damage." },
        { type: "p", text: "At the molecular level, L-Ascorbic acid is notoriously unstable. When we consider how formulations are constructed, the pH and accompanying stabilizers like Vitamin E and Ferulic Acid dictate whether the active simply oxidizes in the bottle or penetrates the dermis to enact structural change." },
        { type: "callout", title: "Benefits of Vitamin C", list: ["Inhibition of tyrosinase, reducing hyperpigmentation.", "Stimulation of collagen synthesis.", "Neutralization of oxidative stress."] },
        { type: "h2", text: "Formulation is Everything" },
        { type: "p", text: "Antioxidants require stabilizers. In nature as in formulation, ingredients perform best within perfectly calibrated ecosystems. Ascorbic acid requires a low pH environment to penetrate the stratum corneum effectively." },
        { type: "p", text: "As you curate your routine, consider the delivery system wrapping the Vitamin C. Dark glass bottles and airless pumps are essential to preserve the efficacy of this potent molecule." }
      ];
    }
    if (title.includes("Ceramides Explained")) {
      return [
        { type: "h2", text: "The Mortar Between the Bricks" },
        { type: "p", text: "If your skin cells are the bricks, ceramides are the crucial mortar holding them together. These naturally occurring lipids make up approximately 50% of the epidermis, playing a vital role in barrier function and hydration retention." },
        { type: "quote", text: "Without ceramides, the skin barrier collapses. It becomes permeable to irritants and incapable of retaining moisture." },
        { type: "p", text: "Age and environmental damage deplete our natural ceramide levels. Biomimetic structures—ingredients that mirror the skin's native composition—are essential for replenishing what is lost. When applied topically, they fuse directly with the lipid matrix." },
        { type: "callout", title: "The Lipid Matrix Ratio", list: ["50% Ceramides.", "25% Cholesterol.", "15% Free Fatty Acids."] },
        { type: "h2", text: "Synergistic Repair" },
        { type: "p", text: "Isolation is rarely the answer. Barrier-replenishing agents thrive when formulated in the golden ratio of 3:1:1 (Ceramides:Cholesterol:Fatty Acids). This perfectly mimics human inter-corneocyte lipids." },
        { type: "p", text: "As you curate your routine, consider that ceramide-dominant formulations are the absolute foundation of cosmetic chemistry—creating products so precisely engineered they disappear into your cellular matrix, leaving only health behind." }
      ];
    }
    if (title.includes("Morning vs Night")) {
      return [
        { type: "h2", text: "Circadian Rhythms of the Skin" },
        { type: "p", text: "Your skin functions differently depending on the time of day. Optimizing your skincare steps based on your circadian rhythm ensures you are providing exactly what the skin needs at the right precise moment." },
        { type: "quote", text: "The day is for protection and defense. The night is for repair and targeted cellular regeneration." },
        { type: "p", text: "During the day, the skin faces an onslaught of UV radiation and pollution. Formulations must focus on defense: antioxidants like Vitamin C paired with broad-spectrum SPF to neutralize oxidative stress." },
        { type: "callout", title: "Biomimetic Scheduling", list: ["AM: Antioxidants and UV Filters (Defense).", "PM: Retinoids, Peptides, and AHAs (Repair).", "Anytime: Ceramides and Hydration (Support)."] },
        { type: "h2", text: "Nocturnal Regeneration" },
        { type: "p", text: "At night, micro-circulation increases and the skin's barrier is naturally more permeable. This is the optimal time to deliver powerful exfoliants and cell-communicating ingredients like Retinol." },
        { type: "p", text: "As you curate your routine, separate your actives. The new frontier of cosmetic chemistry relies on understanding biological timing to maximize efficacy and minimize potential irritation." }
      ];
    }

    return [
      { type: "h2", text: "The Foundation of Skincare Science" },
      { type: "p", text: "In the evolving landscape of modern dermatology, understanding how our cellular barriers interact with topical formulations has never been more critical. The narrative surrounding skincare has shifted from quick fixes to long-term architectural integrity." },
      { type: "quote", text: "We formulate not for what the skin wants today, but for what its cellular memory will require a decade from now." },
      { type: "p", text: "At the molecular level, every ingredient must justify its inclusion. Fillers and aggressive stripping agents have given way to biomimetic structures—ingredients that mirror the skin's native composition. When we consider how formulations are constructed, size, polarity, and structural compatibility dictate whether an active simply sits on the epidermis or whether it reaches the dermis to enact structural change." },
      { type: "callout", title: "Mechanisms of Action", list: ["Cellular communication and signal targeting.", "Enzymatic pathway inhibition.", "Lipid barrier fortification and water-binding capacity."] },
      { type: "h2", text: "Biological Synergy" },
      { type: "p", text: "Isolation is rarely the answer. In nature as in formulation, ingredients perform best within perfectly calibrated ecosystems. Antioxidants require stabilizers, exfoliants require humectants, and barrier-replenishing agents thrive when paired with exact ratios of ceramides, cholesterol, and fatty acids." },
      { type: "p", text: "As you curate your routine, consider not merely the active ingredient, but the delivery system wrapping it. This is the new frontier of cosmetic chemistry—creating formulations so precisely engineered they disappear into your cellular matrix, leaving only health behind." }
    ];
  };

  const articleContent = generateContent(article.title);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className="bg-ivory min-h-screen text-charcoal font-sans selection:bg-gold/20 selection:text-charcoal w-full relative pt-20"
    >
      {/* Reading Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-50 rounded-full"
        style={{ scaleX }}
      />

      {/* Back Button */}
      <div className="fixed top-24 left-6 md:left-12 z-40">
         <button 
           onClick={onBack}
           className="flex items-center space-x-2 text-charcoal/60 hover:text-charcoal transition-colors group bg-ivory/80 backdrop-blur-md px-4 py-2 rounded-full border border-beige/40 shadow-sm"
         >
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           <span className="text-xs font-mono uppercase tracking-[0.2em]">Journal</span>
         </button>
      </div>

      <article className="max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-32">
        {/* Article Header */}
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: luxuryEase }}
            className="flex items-center justify-center space-x-4 mb-6 font-mono text-[10px] text-taupe uppercase tracking-widest"
          >
            <span className="bg-white border border-beige px-3 py-1 rounded-full text-charcoal">{article.category}</span>
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {article.readTime}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-charcoal leading-tight mb-8 text-balance"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: luxuryEase }}
            className="flex items-center justify-center space-x-4 text-xs font-mono uppercase tracking-widest border-t border-b border-beige/40 py-6 mx-auto max-w-lg"
          >
             <div className="text-left w-1/2 border-r border-beige/40">
                <span className="text-taupe block mb-1">Words By</span>
                <span className="text-charcoal">{article.author}</span>
             </div>
             <div className="text-left w-1/2 pl-4">
                <span className="text-taupe block mb-1">Published</span>
                <span className="text-charcoal">{article.date}</span>
             </div>
          </motion.div>
        </header>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: luxuryEase }}
          className="w-full h-[637.844px] rounded-3xl overflow-hidden mb-20 shadow-xl shadow-beige/20 relative"
        >
           <div className="relative h-full">
            <LazyImage src={article.id === 3 ? spfDetailImage : article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent mix-blend-multiply" />
           </div>
        </motion.div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Social Share Sidebar */}
          <div className="hidden lg:block lg:col-span-2 relative">
             <div className="sticky top-32 flex flex-col items-center space-y-6">
                <span className="text-[10px] font-mono text-taupe uppercase tracking-widest rotate-180 [writing-mode:vertical-lr] mb-4">Share Article</span>
                <button className="w-10 h-10 rounded-full border border-beige flex items-center justify-center text-taupe hover:text-charcoal hover:border-charcoal transition-all">
                   <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-beige flex items-center justify-center text-taupe hover:text-charcoal hover:border-charcoal transition-all">
                   <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-beige flex items-center justify-center text-taupe hover:text-charcoal hover:border-charcoal transition-all">
                   <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-beige flex items-center justify-center text-taupe hover:text-charcoal hover:border-charcoal transition-all mt-4">
                   <Bookmark className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="lg:col-span-10 w-full prose prose-lg prose-a:text-gold hover:prose-a:text-charcoal max-w-none">
             {/* Dynamic Content */}
             <p className="lead text-2xl font-serif text-charcoal/80 mb-12 italic leading-relaxed border-l-2 border-gold pl-6">
               {article.excerpt}
             </p>

             {articleContent.map((block, idx) => {
               if (block.type === "h2") {
                 return <h2 key={idx} className="text-3xl font-serif text-charcoal mt-16 mb-6">{block.text}</h2>
               }
               if (block.type === "p") {
                 return <p key={idx} className="text-charcoal/80 font-light leading-relaxed mb-8">{block.text}</p>
               }
               if (block.type === "quote") {
                 return (
                   <blockquote key={idx} className="my-16 py-12 px-8 bg-white border border-beige rounded-3xl text-center relative shadow-sm">
                      <div className="text-5xl text-gold font-serif absolute top-4 left-6 opacity-30">"</div>
                      <p className="text-2xl md:text-3xl font-serif text-charcoal italic leading-snug relative z-10 m-0 border-l-0 pl-0">
                        {block.text}
                      </p>
                      <div className="text-5xl text-gold font-serif absolute bottom-[-10px] right-6 opacity-30">"</div>
                   </blockquote>
                 )
               }
               if (block.type === "callout") {
                 return (
                   <div key={idx} className="my-12 p-8 bg-ivory border border-gold/30 rounded-2xl not-prose">
                      <h3 className="text-sm font-mono uppercase tracking-widest text-gold mb-6 mt-0">{block.title}</h3>
                      <ul className="space-y-4 m-0 p-0 list-none">
                        {block.list?.map((item, i) => (
                           <li key={i} className="flex items-start m-0 p-0 before:hidden">
                             <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 mr-4 shrink-0" />
                             <span className="font-light text-charcoal/80 text-lg m-0 p-0">{item}</span>
                           </li>
                        ))}
                      </ul>
                   </div>
                 )
               }
               return null;
             })}
          </div>
        </div>
      </article>

      {/* Footer / Newsletter */}
      <section className="bg-white border-t border-beige/40 py-24 relative z-10 overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-mono text-xs tracking-widest text-gold uppercase mb-4 block">End of Article</span>
          <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">Stay Curious. Stay Informed.</h3>
          <p className="text-taupe font-light mb-8">Receive skincare education, ingredient insights, and wellness articles before everyone else. No spam, just pure knowledge.</p>
          <div className="relative max-w-md mx-auto">
             <input type="email" placeholder="Email address" className="w-full bg-ivory border border-beige rounded-full py-4 pl-6 pr-32 text-sm focus:outline-none focus:ring-1 focus:ring-gold" />
             <button className="absolute right-2 top-2 bottom-2 bg-charcoal text-ivory rounded-full px-6 text-xs font-mono uppercase tracking-widest hover:bg-gold transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
