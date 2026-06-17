import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  Droplet, 
  ShieldCheck, 
  Sun, 
  Wind, 
  Moon, 
  Activity,
  Download,
  Mail,
  Bookmark,
  RefreshCw,
  Camera,
  Layers,
  Sparkles,
  Zap
} from "lucide-react";

interface AiRitualsResultExperienceProps {
  imageFile: string | null;
  onRetake: () => void;
  diagnosisText: string;
  pinPositions: Array<{ id: number; name: string; top: string; left: string; color: string }>;
}

export default function AiRitualsResultExperience({
  imageFile,
  onRetake,
  diagnosisText,
  pinPositions
}: AiRitualsResultExperienceProps) {
  const [phase, setPhase] = useState<"processing" | "results">("processing");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Mapping facial topology...");

  const loadingMessages = [
    "Mapping facial topology...",
    "Detecting skin texture...",
    "Measuring hydration...",
    "Identifying pigmentation...",
    "Evaluating barrier strength...",
    "Comparing 2.5 million skin patterns...",
    "Building personalized ritual...",
    "AI Confidence: 98%"
  ];

  useEffect(() => {
    if (phase === "processing") {
      let currentProgress = 0;
      let messageIndex = 0;
      
      const interval = setInterval(() => {
        currentProgress += Math.random() * 2.5;
        if (currentProgress > 100) currentProgress = 100;
        
        setLoadingProgress(currentProgress);
        
        const nextMessageIndex = Math.floor((currentProgress / 100) * loadingMessages.length);
        if (nextMessageIndex !== messageIndex && nextMessageIndex < loadingMessages.length) {
          messageIndex = nextMessageIndex;
          setLoadingMessage(loadingMessages[messageIndex]);
        }
        
        if (currentProgress === 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("results"), 800);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [phase]);

  const [activeHeatmap, setActiveHeatmap] = useState<"none" | "hydration" | "texture" | "oil" | "pigmentation" | "barrier" | "glow">("none");
  const [activeIngredient, setActiveIngredient] = useState<number | null>(null);

  const getHeatmapColor = () => {
    switch(activeHeatmap) {
      case "hydration": return "bg-blue-500/30";
      case "texture": return "bg-stone-500/30";
      case "oil": return "bg-emerald-500/30";
      case "pigmentation": return "bg-orange-500/30";
      case "barrier": return "bg-indigo-500/30";
      case "glow": return "bg-gold/30";
      default: return "bg-transparent";
    }
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "processing" && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070708] overflow-hidden"
        >
          {/* Subtle animated background grid / particles effect */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-[pulse_4s_ease-in-out_infinite]" />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            <motion.div 
              className="relative w-48 h-48 mb-12"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-white/20 absolute inset-0">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
              </svg>
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold absolute inset-0 drop-shadow-[0_0_12px_rgba(201,162,39,0.5)]">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDashoffset={301.59 * (1 - loadingProgress / 100)} strokeDasharray="301.59" strokeLinecap="round" className="transition-all duration-300 ease-out" />
              </svg>
              
              {/* Central face scanning wireframe icon or uploaded image silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-32 border border-white/20 rounded-[2rem] relative overflow-hidden">
                   {imageFile && (
                     <img src={imageFile} className="w-full h-full object-cover opacity-30 mix-blend-screen scale-x-[-1]" alt="" referrerPolicy="no-referrer" />
                   )}
                   <motion.div 
                     className="absolute left-0 right-0 h-[1px] bg-gold shadow-[0_0_15px_#C9A227]"
                     animate={{ top: ["0%", "100%", "0%"] }}
                     transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                   />
                 </div>
              </div>
            </motion.div>

            <motion.div 
              key={loadingMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center w-full"
            >
              <p className="text-xl font-serif text-white mb-2">{loadingMessage}</p>
              <div className="w-full h-[1px] bg-white/10 mt-6 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 bottom-0 left-0 bg-gold"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-[0.3em] mt-4">
                Calibrating {Math.round(loadingProgress)}%
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {phase === "results" && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="min-h-screen bg-[#070708] text-white selection:bg-gold/30 pt-24 pb-32"
        >
          {/* Hero Results Section */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center space-x-2 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-stone-300">Analysis Complete</span>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-[#F8F8F8] font-bold tracking-tight mb-6">
                Your Personalized Skin Ritual
              </h1>
              <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                Your skin is unique. We've analyzed your facial features, skin condition, lifestyle, and environmental factors to create a bespoke skincare laboratory report.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16"
            >
              {[
                { label: "AI Confidence", value: "98%" },
                { label: "Analysis Time", value: "2.1 seconds" },
                { label: "Detected Profile", value: "Combination / Dehydrated" },
                { label: "Environment", value: "Bangalore, India" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono block mb-2">{stat.label}</span>
                  <span className="text-xl font-serif text-white font-medium">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Interactive Face Analysis */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full relative"
            >
              <div className="aspect-[3/4] max-h-[80vh] w-full max-w-md mx-auto relative rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-[#111]">
                {imageFile && (
                  <img src={imageFile} className="w-full h-full object-cover scale-x-[-1]" alt="Face Scan" referrerPolicy="no-referrer" />
                )}
                
                {/* Heatmap overlay */}
                <div className={`absolute inset-0 mix-blend-color transition-colors duration-1000 ${getHeatmapColor()}`} />

                {/* Hotspots */}
                {pinPositions.map((pin, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-20 group"
                    style={{ top: pin.top, left: pin.left }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  >
                    <div className="relative -ml-3 -mt-3">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        <div className="w-2 h-2 rounded-full bg-gold" />
                      </div>
                      <div className="absolute inset-0 rounded-full animate-ping border border-white opacity-50" />
                      
                      {/* Tooltip Card */}
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-48 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-50">
                        <h4 className="text-xs font-mono text-gold uppercase tracking-widest mb-2 border-b border-white/10 pb-2">{pin.name}</h4>
                        <ul className="text-stone-300 space-y-1.5 text-[10px]">
                          <li className="flex items-start gap-1.5 opacity-90"><Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> Mild dehydration detected</li>
                          <li className="flex items-start gap-1.5 opacity-90"><Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" /> Healthy barrier</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full space-y-12"
            >
              {/* Overall Score */}
              <div className="flex items-center gap-8 border-b border-white/10 pb-10">
                <div className="w-32 h-32 relative shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white/5 -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
                  </svg>
                  <motion.svg 
                    viewBox="0 0 100 100" 
                    className="w-full h-full text-gold absolute inset-0 stroke-current -rotate-90 drop-shadow-[0_0_10px_rgba(201,162,39,0.3)]"
                    initial={{ strokeDashoffset: Math.PI * 2 * 45 }}
                    whileInView={{ strokeDashoffset: Math.PI * 2 * 45 * (1 - 0.87) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  >
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={Math.PI * 2 * 45} strokeLinecap="round" />
                  </motion.svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-serif text-white">87</span>
                    <span className="text-[9px] font-mono text-stone-400 tracking-widest uppercase">/ 100</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white mb-2">Overall Skin Health</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-medium">Exceptional cellular retention structure with mild isolated stress indicators in the T-Zone.</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { name: "Hydration", value: 78 },
                  { name: "Barrier", value: 92 },
                  { name: "Brightness", value: 84 },
                  { name: "Texture", value: 81 },
                  { name: "Oil Balance", value: 89 },
                  { name: "Sensitivity", value: 90 },
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-stone-300 uppercase tracking-wider">{metric.name}</span>
                      <span className="font-medium text-white">{metric.value}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-stone-500 to-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Heatmap Toggles */}
              <div className="pt-8">
                <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-4">Laboratory Overlays</h4>
                <div className="flex flex-wrap gap-3">
                  {["hydration", "texture", "oil", "pigmentation", "barrier", "glow"].map((mapType) => (
                    <button
                      key={mapType}
                      onClick={() => setActiveHeatmap(mapType === activeHeatmap ? "none" : mapType as any)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-mono uppercase tracking-widest transition-all ${
                        activeHeatmap === mapType 
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                          : "bg-transparent text-stone-400 border-stone-700 hover:border-white/50"
                      }`}
                    >
                      {mapType}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </section>

          {/* AI Summary Editorial Card */}
          <section className="px-6 md:px-12 max-w-5xl mx-auto mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg viewBox="0 0 100 100" className="w-64 h-64 text-white">
                   <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                   <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-6 relative z-10">What We Noticed</h3>
              <div className="prose prose-invert max-w-none relative z-10 leading-relaxed text-stone-300">
                <p>
                  Your skin appears healthy with a remarkably strong protective barrier. 
                  The AI detected mild dehydration around the cheeks and slight uneven tone, likely influenced by environmental exposure in your current climate. 
                </p>
                <p>
                  There are no significant concerns, but focusing on restoring hydration layers and elevating daily sun protection defenses will noticeably enhance cellular brightness and refine texture over time.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Your Top Priorities */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
            <h3 className="font-serif text-3xl text-white text-center mb-12">Actionable Priorities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: "01", title: "Hydration", desc: "Increase water retention and strengthen moisture balance.", icon: Droplet },
                { num: "02", title: "Sun Protection", desc: "Maintain daily SPF usage to prevent pigmentation.", icon: Sun },
                { num: "03", title: "Brightening", desc: "Support even skin tone using antioxidant ingredients.", icon: Zap }
              ].map((priority, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500"
                >
                  <div className="text-gold/50 font-mono tracking-widest text-[10px] mb-6">PRIORITY {priority.num}</div>
                  <priority.icon className="w-8 h-8 text-white mb-6 opacity-80 group-hover:bg-gold duration-500 rounded p-1 group-hover:text-black" />
                  <h4 className="font-serif text-xl text-white mb-3">{priority.title}</h4>
                  <p className="text-stone-400 text-sm leading-relaxed">{priority.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Ingredient Match */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
            <h3 className="font-serif text-3xl text-white text-center mb-16">Scientific Ingredient Match</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { name: "Vitamin C", match: 5, desc: "Brightens skin and improves radiance. Essential for neutralising free radicals." },
                { name: "Niacinamide", match: 5, desc: "Balances oil and supports barrier function while reducing pore appearance." },
                { name: "Hyaluronic Acid", match: 5, desc: "Deep hydration and plumping to combat immediate moisture loss." },
                { name: "Ceramides", match: 4, desc: "Strengthens moisture barrier and protects structural integrity." },
              ].map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  layout
                  onClick={() => setActiveIngredient(activeIngredient === idx ? null : idx)}
                  className="bg-[#111] border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-gold/30 transition-all group overflow-hidden"
                >
                  <div className="flex justify-between items-center h-full">
                    <div>
                      <h4 className="font-serif text-lg text-white mb-2">{ing.name}</h4>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-3.5 h-3.5 ${star <= ing.match ? 'text-gold fill-gold' : 'text-stone-700'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <ChevronRight className={`w-4 h-4 text-stone-400 group-hover:text-gold transition-transform ${activeIngredient === idx ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {activeIngredient === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-stone-400 text-sm leading-relaxed border-t border-white/10 pt-4">
                          {ing.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI Routine Timeline */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
            <h3 className="font-serif text-3xl text-white text-center mb-16">Prescribed Daily Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -ml-px w-px bg-white/10" />
              
              {/* Morning */}
              <div>
                <div className="flex items-center space-x-3 mb-10 md:justify-end">
                  <h4 className="font-mono text-sm tracking-widest text-gold uppercase">Morning Sequence</h4>
                  <Sun className="w-5 h-5 text-gold" />
                </div>
                <div className="space-y-6">
                  {["Balancing Gel Cleanser", "Pure Vitamin C Serum", "Ceramide Complex Moisturizer", "Invisible Shield SPF 50"].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-[#111] p-5 rounded-2xl border border-white/5 flex items-center shadow-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0">
                        <span className="font-mono text-[10px] text-stone-300 tracking-widest">0{idx + 1}</span>
                      </div>
                      <span className="font-serif text-stone-200">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Night */}
              <div>
                <div className="flex items-center space-x-3 mb-10">
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-mono text-sm tracking-widest text-indigo-400 uppercase">Night Protocol</h4>
                </div>
                <div className="space-y-6">
                  {["Lipid Barrier Cleanser", "Niacinamide Repair Serum", "Deep Hydration Emulsion"].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      className="bg-[#111] p-5 rounded-2xl border border-indigo-500/10 flex items-center shadow-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mr-4 shrink-0">
                        <span className="font-mono text-[10px] text-indigo-300 tracking-widest">0{idx + 1}</span>
                      </div>
                      <span className="font-serif text-stone-200">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Expected Improvement Timeline */}
          <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32 overflow-hidden">
            <h3 className="font-serif text-3xl text-white text-center mb-16">Transformation Trajectory</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[
                  { label: "Today", desc: "Skin Baseline" },
                  { label: "2 Weeks", desc: "Improved Hydration" },
                  { label: "4 Weeks", desc: "More Even Tone" },
                  { label: "8 Weeks", desc: "Visible Glow" },
                  { label: "12 Weeks", desc: "Optimized Barrier" },
                ].map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative text-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-gold shadow-[0_0_15px_rgba(201,162,39,0.5)] mx-auto mb-6 relative z-10 hidden md:block" />
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                      <div className="font-mono text-[10px] text-gold uppercase tracking-widest mb-2">{milestone.label}</div>
                      <div className="font-serif text-white">{milestone.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Save Ritual Area */}
          <section className="px-6 md:px-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" />
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 relative z-10">Save Your Laboratory Report</h3>
              <p className="text-stone-400 mb-10 max-w-xl mx-auto relative z-10 text-sm">
                Secure your personalized diagnostics and custom protocol to track your molecular skin progression over time. 
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-8 w-full max-w-xl mx-auto">
                <button className="py-4 px-6 bg-white shrink-0 text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-gold transition-colors flex justify-center items-center gap-2 group shadow-xl">
                  <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" /> Save Analysis
                </button>
                <button className="py-4 px-6 bg-transparent border border-white/20 shrink-0 text-white font-mono text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-white/5 transition-colors flex justify-center items-center gap-2">
                  <Download className="w-4 h-4" /> Download Report
                </button>
                <button className="py-4 px-6 bg-[#111] shrink-0 text-white font-mono text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:bg-white/5 transition-colors flex justify-center items-center gap-2 border border-white/5">
                  <Mail className="w-4 h-4 text-stone-400" /> Email Report
                </button>
                <button className="py-4 px-6 bg-gradient-to-r from-gold to-[#A37B1D] shrink-0 text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(201,162,39,0.3)]">
                  Start My Routine
                </button>
              </div>

              <div className="relative z-10 pt-8 border-t border-white/10 mt-8 w-full max-w-xl mx-auto flex justify-center">
                 <button onClick={onRetake} className="text-xs font-mono tracking-widest text-stone-500 hover:text-white uppercase transition-colors flex items-center gap-2">
                   <RefreshCw className="w-3 h-3" /> Retake Consultation Analysis
                 </button>
              </div>
            </motion.div>
            
            <p className="text-center text-[10px] text-stone-600 mt-10 font-mono">
              Results vary depending on consistency, lifestyle, and individual epigenetic characteristics. Not intended to diagnose medical dermal conditions.
            </p>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
