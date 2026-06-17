import { motion, useInView } from "motion/react";
import { Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const REVIEWS = [
  {
    name: "Priya S.",
    city: "Mumbai, MH",
    stars: 5,
    text: "Finally, a sunscreen that doesn't melt off in the Mumbai humidity. It leaves zero white cast on my warm skin tone and feels like absolute silk. A staple in my routine now.",
  },
  {
    name: "Ananya R.",
    city: "Delhi, NCR",
    stars: 5,
    text: "The Vitamin C serum completely transformed my dullness within three weeks. It’s so hard to find formulations that are gentle yet effective for hyperpigmentation. Absolutely luxurious.",
  },
  {
    name: "Meera K.",
    city: "Bangalore, KA",
    stars: 5,
    text: "I've replaced my high-end international cleansers with this. It doesn't strip my skin at all, and the packaging feels incredibly premium on my vanity. Worth every rupee.",
  },
  {
    name: "Neha V.",
    city: "Chennai, TN",
    stars: 5,
    text: "The elegant tint in the sunscreen is perfect for daily wear. It beautifully blurs imperfections without feeling heavy in the coastal heat. Highly recommend.",
  },
  {
    name: "Kritika M.",
    city: "Pune, MH",
    stars: 5,
    text: "My skin barrier was compromised from over-exfoliation, and this recovery serum felt like a comforting hug. Extremely lightweight yet deeply nourishing. Absolutely adore the texture.",
  },
  {
    name: "Sneha J.",
    city: "Hyderabad, TG",
    stars: 5,
    text: "The lip oil is pure magic. It gives a sophisticated glassy shine without any of the stickiness you get with other glosses. The subtle tint looks stunning on my natural lip color.",
  },
  {
    name: "Roshni D.",
    city: "Kolkata, WB",
    stars: 5,
    text: "Finding a moisturizer that works in the humid monsoon season is a nightmare, but TIVA nailed it. Sinks in immediately, zero greasiness, and leaves my skin plump all day.",
  },
  {
    name: "Aarti P.",
    city: "Ahmedabad, GJ",
    stars: 5,
    text: "I was skeptical about AI recommended routines, but my curated ritual has completely cleared my texture issues within a month. Incredible personalization.",
  },
  {
    name: "Divya C.",
    city: "Chandigarh, CH",
    stars: 5,
    text: "The cleanser takes off all my waterproof makeup without stripping my skin dry. Finally a luxury Indian brand that truly understands our skin concerns.",
  },
  {
    name: "Vandana S.",
    city: "Jaipur, RJ",
    stars: 5,
    text: "I keep the serum in my bag everywhere I go. The glow it gives me in the dry desert heat is unmatched. TIVA is easily my favorite beauty discovery this year.",
  }
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function ReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth > 768 ? 424 : current.clientWidth - 40;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-ivory py-32 relative overflow-hidden">
      {/* Subtle warm gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Milestone Counter */}
        <div className="text-center mb-16 md:mb-24 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-charcoal text-4xl md:text-5xl lg:text-6xl mb-6 font-light tracking-wide leading-tight"
          >
            Over <span className="text-gold font-medium"><Counter end={1500} suffix="+" /></span><br className="hidden md:block" /> Rituals Delivered Across India
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-taupe uppercase tracking-[0.2em] text-xs md:text-sm font-medium"
          >
            Formulated for Indian skin. Loved by a growing community.
          </motion.p>

          {/* Navigation Buttons (Desktop mostly) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="hidden md:flex justify-end gap-3 absolute bottom-0 right-0 translate-y-12"
          >
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-beige/60 text-charcoal hover:bg-gold/10 hover:border-gold hover:text-gold transition-all duration-300 z-20 bg-ivory shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-beige/60 text-charcoal hover:bg-gold/10 hover:border-gold hover:text-gold transition-all duration-300 z-20 bg-ivory shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Reviews Horizontal Scroll Row */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 sm:px-0 sm:mx-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="bg-charcoal/5 backdrop-blur-xl border border-beige/40 rounded-[2rem] p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-gold/50 hover:shadow-[0_8px_40px_rgba(194,159,101,0.15)] hover:-translate-y-1 transition-all duration-500 group snap-center sm:snap-align-none shrink-0 w-[85vw] sm:w-[400px]"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1 relative">
                    {[...Array(review.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                    <div className="absolute inset-0 bg-gold/20 blur-md rounded-full -z-10 group-hover:bg-gold/40 transition-colors duration-500" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gold bg-gold/5 border border-gold/10 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
                <p className="text-sm text-charcoal font-light leading-relaxed italic mb-8">
                  "{review.text}"
                </p>
              </div>
              <div className="border-t border-beige/30 pt-6 mt-auto group-hover:border-gold/30 transition-colors duration-500">
                <p className="font-sans font-bold text-charcoal text-base tracking-wide">{review.name}</p>
                <p className="text-taupe text-[10px] uppercase tracking-[0.2em] mt-1">{review.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
