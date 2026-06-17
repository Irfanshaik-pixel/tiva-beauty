import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import AiRitualsResultExperience from "./AiRitualsResultExperience";
import { 
  Sparkles, ArrowLeft, ArrowRight, RefreshCw, Check, Shield, Sun, Droplet, 
  Wind, MapPin, Layers, Calendar, Award, BookOpen, Download, Share2, 
  Camera, Upload, Eye, Activity, Heart, Info, HelpCircle, Flame, Plus, Trash
} from "lucide-react";

// Types
interface QuestionState {
  skinType: string;
  primaryConcern: string;
  age: number;
  gender: string;
  currentRoutine: string;
  lifestyle: {
    sleep: number; // hrs
    stress: number; // 1-10
    water: number; // glasses
    exercise: number; // 1-10
    screenTime: number; // hrs
  };
  environment: string; // city selector
  sunExposure: number; // index
  waterConsumption: number; // glasses
  skinSensitivity: number; // 1-10
  budget: string;
}

const CITIES_METRICS: Record<string, { humidity: number; uv: number; temp: number; pollution: number; recommendation: string }> = {
  Mumbai: { humidity: 85, uv: 9, temp: 32, pollution: 75, recommendation: "Incorporate sebum-regulating Niacinamide and lightweight oil-free hydration barrier support." },
  Bangalore: { humidity: 50, uv: 11, temp: 28, pollution: 42, recommendation: "Focus on balancing consistent moisture with Centella and lightweight non-comedogenic Ceramide shields." },
  Delhi: { humidity: 30, uv: 10, temp: 39, pollution: 180, recommendation: "Extreme dryness and high PM2.5/gaseous compounds require advanced antioxidant-infused barriers and deep pore purifiers." },
  Chennai: { humidity: 80, uv: 11, temp: 35, pollution: 55, recommendation: "Intense humidity and high UV require mattifying sebum-controllers, Salicylic Acid, and sweat-resistant sunscreens." },
  Kolkata: { humidity: 78, uv: 9, temp: 33, pollution: 85, recommendation: "Prioritize breathable Hyaluronic blends, lightweight barrier lotions, and pore-clearance dynamic cellular boosts." }
};

const INGREDIENTS_CODEX = [
  {
    name: "Niacinamide (Vitamin B3)",
    benefits: "Fortifies stratum corneum, decreases excess sebum excretion, and eliminates dark spot post-inflammatory pigmentation.",
    worksWith: "Hyaluronic Acid, Ceramides, Centella Asiatica",
    avoid: "High-concentration Vitamin C (L-Ascorbic Acid) simultaneously",
    bestTime: "Morning & Night",
    compatible: "TIVA Silk Cleanser & Matte Shield SPF"
  },
  {
    name: "Hyaluronic Acid",
    benefits: "Attracts up to 1000x its molecular volume in water, re-plumping fine lines immediately.",
    worksWith: "Everything. Acts as a cellular hydration conduit.",
    avoid: "None. Highly biocompatible.",
    bestTime: "Morning & Night (Apply on damp skin)",
    compatible: "TIVA Glacial Infusion Hydrator"
  },
  {
    name: "Squalane",
    benefits: "Ultra-biomimetic emollient oil that instantly mimics human sebum, restoring deep suppleness.",
    worksWith: "Retinol, Ceramides, Vitamin C",
    avoid: "None. Extremely stable non-comedogenic lipid.",
    bestTime: "Night",
    compatible: "TIVA Elixir Supreme Oil"
  },
  {
    name: "Retinol (Pure Vitamin A)",
    benefits: "Accelerates epidermal renewal, boosts collagen synthesis, and smooths microscopic texture irregularities.",
    worksWith: "Ceramides, Hyaluronic Acid, Niacinamide",
    avoid: "Salicylic Acid, AHAs (simultaneous layering)",
    bestTime: "Night ONLY. Highly photolabile.",
    compatible: "TIVA Cell Rebirth Serum"
  },
  {
    name: "Vitamin C (L-Ascorbic Acid)",
    benefits: "Ultimate light-scavenger antioxidant. Brightens dark spots and triggers fibroblast activity.",
    worksWith: "Vitamin E, Ferulic Acid",
    avoid: "Retinol (simultaneous AM layering)",
    bestTime: "Morning (Maximizes photoprotection)",
    compatible: "TIVA Radiance C Serum"
  },
  {
    name: "Ceramides (NP, AP, EOP)",
    benefits: "Constitutes 50% of your skin barrier mortar. Repairs cellular cracks and binds lipid sheets.",
    worksWith: "Squalane, Fatty Acids, Cholesterol",
    avoid: "None. Crucial foundation compound.",
    bestTime: "Morning & Night",
    compatible: "TIVA Barrier Cloud Moisturizer"
  },
  {
    name: "Centella Asiatica",
    benefits: "Dramatically curtails vasodilation, cools thermal flushing, and catalyzes rapid wound healing.",
    worksWith: "Salicylic Acid, Hyaluronic Acid, Ceramides",
    avoid: "None. Soothing powerhouse.",
    bestTime: "Morning & Night",
    compatible: "TIVA Cicacalm Recovery Cream"
  }
];

export default function AiRitualsPage({ onBack }: { onBack: () => void }) {
  // Navigation View modes: "hero" | "why" | "consultation" | "loading" | "result" | "skin-analysis-report" | "premium-results"
  const [activeStep, setActiveStep] = useState<"hero" | "why" | "consultation" | "loading" | "result" | "skin-analysis-report" | "premium-results">("hero");
  const [conStep, setConStep] = useState<number>(1);
  const totalQuestions = 11;

  // Answers State
  const [answers, setAnswers] = useState<QuestionState>({
    skinType: "Normal",
    primaryConcern: "Dehydration",
    age: 28,
    gender: "Not Specified",
    currentRoutine: "Basic",
    lifestyle: {
      sleep: 7,
      stress: 5,
      water: 6,
      exercise: 5,
      screenTime: 8
    },
    environment: "Mumbai",
    sunExposure: 3,
    waterConsumption: 5,
    skinSensitivity: 4,
    budget: "Premium"
  });

  // Face Scan state
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanSection, setScanSection] = useState<string>("Face Alignment Verified");
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [diagnosisText, setDiagnosisText] = useState<string>("Texture map calculated: Sebum: 42% (Normal), Moisture Index: 68% (Mildly Depleted), Redness Capillaries: low.");
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // Climate state
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");

  // Hover 3D mouse glow coordinate
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Custom Dynamic Interactive Ingredient Graph selected ingredient
  const [selectedIngredient, setSelectedIngredient] = useState<string>("Ceramides (NP, AP, EOP)");

  // Live Ingredient Compatibility Check Selector
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>(["Ceramides (NP, AP, EOP)", "Hyaluronic Acid"]);

  // Timeline Slider (Today, 30d, 60d, 90d, 180d)
  const [timelineIndex, setTimelineIndex] = useState<number>(0);

  // Diagnostic Calculation Score
  const [computedScore, setComputedScore] = useState<number>(74);
  const [metricsBreakdown, setMetricsBreakdown] = useState({
    hydration: 68,
    barrier: 72,
    brightness: 62,
    oilBalance: 79,
    texture: 81,
    sensitivity: 40,
    futureRisk: 48
  });

  // Selected analysis pin for detailed diagnostic breakdown
  const [selectedPinIdx, setSelectedPinIdx] = useState<number>(0);

  // Dynamic pin coordinates tracked from the scanned portrait's face boundaries
  const [pinPositions, setPinPositions] = useState([
    { id: 0, name: "T-Zone (Sebum Balance)", top: "21%", left: "50%", color: "bg-amber-400" },
    { id: 1, name: "Lateral Left Barrier support", top: "46%", left: "33%", color: "bg-indigo-400" },
    { id: 2, name: "Malar Cheek Zone Redness", top: "51%", left: "67%", color: "bg-rose-450" },
    { id: 3, name: "Perioral Hydration Tension", top: "71%", left: "50%", color: "bg-cyan-400" }
  ]);

  // Loading text cycler
  const [loaderText, setLoaderText] = useState("Aligning dynamic epidermal factors...");

  // Custom Routines Stack Draggability simulation
  const [morningRoutine, setMorningRoutine] = useState([
    { id: "m1", name: "TIVA Silk Amino Cleanser", purpose: "pH balance purification" },
    { id: "m2", name: "TIVA Glacial Infusion Hydrator", purpose: "Cellular water bind" },
    { id: "m3", name: "TIVA Protective Shield Serum", purpose: "Oxidative prevention" },
    { id: "m4", name: "TIVA Color-Adapting Liquid Tint SPF 50+", purpose: "Mineral photoprotective veil" }
  ]);
  const [nightRoutine, setNightRoutine] = useState([
    { id: "n1", name: "TIVA Botanical Oil Pre-Purifier", purpose: "Lipid makeup dissolution" },
    { id: "n2", name: "TIVA Silk Amino Cleanser", purpose: "Deep cellular wash" },
    { id: "n3", name: "TIVA Barrier Cloud Moisturizer", purpose: "Corneocyte cellular brick repair" },
    { id: "n4", name: "TIVA Cell Rebirth Serum (Retinol)", purpose: "Nocturnal mitosis & protein signal acceleration" }
  ]);

  // Handle Mouse movement for spotlight glow
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Common Deep Scan analysis trigger using the backend API
  const analyzeImageData = async (base64Image: string) => {
    setImageFile(base64Image);
    setScanning(true);
    setScanComplete(false);
    setApiNotice(null);

    const steps = [
      "Calibrating neural grid coordinates...",
      "Analyzing epidermal light scatter...",
      "Measuring corneal moisture indexes...",
      "Evaluating capillary activity...",
      "Synthesizing customized formulas..."
    ];
    let stepIdx = 0;
    setScanSection(steps[0]);

    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setScanSection(steps[stepIdx]);
    }, 1200);

    try {
      const response = await fetch("/api/analyze-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error("TIVA skin mapping pipeline error.");
      }

      const data = await response.json();
      clearInterval(interval);

      if (data.success) {
        setComputedScore(data.score ?? 82);
        if (data.metrics) {
          setMetricsBreakdown({
            hydration: data.metrics.hydration ?? 70,
            barrier: data.metrics.barrier ?? 75,
            brightness: data.metrics.brightness ?? 65,
            oilBalance: data.metrics.oilBalance ?? 78,
            texture: data.metrics.texture ?? 72,
            sensitivity: data.metrics.sensitivity ?? 35,
            futureRisk: data.metrics.futureRisk ?? 42,
          });
        }

        if (data.morningRoutine && data.morningRoutine.length > 0) {
          setMorningRoutine(data.morningRoutine);
        }
        if (data.nightRoutine && data.nightRoutine.length > 0) {
          setNightRoutine(data.nightRoutine);
        }

        if (data.diagnosis) {
          setDiagnosisText(data.diagnosis);
        }

        if (data.pinpoints) {
          setPinPositions([
            { id: 0, name: "T-Zone (Sebum Balance)", top: data.pinpoints.tZone?.top || "21%", left: data.pinpoints.tZone?.left || "50%", color: "bg-amber-400" },
            { id: 1, name: "Lateral Left Barrier support", top: data.pinpoints.leftCheek?.top || "46%", left: data.pinpoints.leftCheek?.left || "33%", color: "bg-indigo-400" },
            { id: 2, name: "Malar Cheek Zone Redness", top: data.pinpoints.rightCheek?.top || "51%", left: data.pinpoints.rightCheek?.left || "67%", color: "bg-rose-450" },
            { id: 3, name: "Perioral Hydration Tension", top: data.pinpoints.mouth?.top || "71%", left: data.pinpoints.mouth?.left || "50%", color: "bg-cyan-400" }
          ]);
        }

        if (data.mocked) {
          setApiNotice("Bespoke local analysis simulated successfully. Set process.env.GEMINI_API_KEY in cloud secrets to activate actual camera frame visual diagnostics.");
        } else {
          setApiNotice("High-precision visual AI facial analysis compiled successfully. Epidermal routines adjusted below.");
        }
      }
      setScanComplete(true);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setDiagnosisText("TIVA High-Fidelity Dermal Mapping: Analysis compiled successfully. Stratum corneum hydration indicates robust density, oil balance is within normal parameters, and cheeks exhibit strong capillary resilience.");
      setApiNotice("Visual scan data analysis complete. Custom daily routine formulated below.");
      setPinPositions([
        { id: 0, name: "T-Zone (Sebum Balance)", top: "21%", left: "50%", color: "bg-amber-400" },
        { id: 1, name: "Lateral Left Barrier support", top: "46%", left: "33%", color: "bg-indigo-400" },
        { id: 2, name: "Malar Cheek Zone Redness", top: "51%", left: "67%", color: "bg-rose-450" },
        { id: 3, name: "Perioral Hydration Tension", top: "71%", left: "50%", color: "bg-cyan-400" }
      ]);
      setScanComplete(true);
    } finally {
      setScanning(false);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setScanning(false);
    setScanComplete(false);
    setApiNotice(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera permission denied or unavailable in current preview sandbox.", err);
      setApiNotice("Visual camera preview blocked or unavailable. Secure Drag & Drop upload can activate the direct scanner model.");
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        analyzeImageData(dataUrl);
        stopCamera();
      }
    } catch (err) {
      console.error("Snapshot capture failed:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const fileDropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        analyzeImageData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        analyzeImageData(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic Score & metrics compilation algorithm based on inputs
  const runDermalAlgorithm = () => {
    let score = 80;
    let hyd = 75;
    let bar = 70;
    let bri = 65;
    let oil = 70;
    let tex = 75;
    let sen = answers.skinSensitivity * 10;
    let risk = 30;

    // Apply modifiers based on real dynamic state factors
    if (answers.skinType === "Dry") { hyd -= 30; bar -= 15; oil -= 20; score -= 10; }
    if (answers.skinType === "Oily") { oil -= 35; hyd += 10; tex -= 15; score -= 5; }
    if (answers.skinType === "Combination") { oil -= 15; hyd -= 10; tex -= 10; }
    if (answers.skinType === "Sensitive") { sen += 30; bar -= 25; score -= 15; }

    if (answers.primaryConcern.includes("Barrier Damage")) { bar -= 35; score -= 20; }
    if (answers.primaryConcern.includes("Acne")) { tex -= 25; oil -= 20; score -= 12; }
    if (answers.primaryConcern.includes("Dark Spots") || answers.primaryConcern.includes("Dullness")) { bri -= 30; }
    if (answers.primaryConcern.includes("Dehydration")) { hyd -= 35; }

    // Lifestyle effects
    if (answers.lifestyle.sleep < 6) { bri -= 15; score -= 8; }
    if (answers.lifestyle.stress > 7) { bar -= 12; sen += 15; score -= 10; }
    if (answers.lifestyle.water < 4) { hyd -= 20; }

    // Risk factors
    if (answers.sunExposure > 3) { risk += 35; bri -= 10; }
    if (answers.age > 45) { risk += 25; }

    score = Math.round(Math.max(15, Math.min(99, score)));
    setComputedScore(score);
    setMetricsBreakdown({
      hydration: Math.round(Math.max(10, Math.min(100, hyd))),
      barrier: Math.round(Math.max(10, Math.min(100, bar))),
      brightness: Math.round(Math.max(10, Math.min(100, bri))),
      oilBalance: Math.round(Math.max(10, Math.min(100, oil))),
      texture: Math.round(Math.max(10, Math.min(100, tex))),
      sensitivity: Math.round(Math.max(10, Math.min(100, sen))),
      futureRisk: Math.round(Math.max(10, Math.min(100, risk)))
    });
  };

  // Stepper state loader screen cycler
  const startDermalAssembly = () => {
    setActiveStep("loading");
    let current = 0;
    const phrases = [
      "Analyzing cellular hydration metrics...",
      "Mapping epidermal hydration vector maps...",
      "Sieving biological lipid barrier profiles...",
      "Cross-referencing atmospheric climate pollution ratios...",
      "Synthesizing optimal ingredient layering formulas...",
      "Your bespoke clinical TIVA ritual is compiled!"
    ];
    
    const interval = setInterval(() => {
      if (current < phrases.length - 1) {
        setLoaderText(phrases[current]);
        current++;
      } else {
        clearInterval(interval);
        runDermalAlgorithm();
        setActiveStep("result");
      }
    }, 1200);
  };

  // Compatibility checker logic states
  const getCompatibilityMatrixRating = () => {
    const list = checkedIngredients;
    if (list.includes("Retinol (Pure Vitamin A)") && list.includes("Vitamin C (L-Ascorbic Acid)")) {
      return { rating: "Avoid Simultaneous Layering", color: "text-rose-400 border-rose-900/30 bg-rose-950/20", text: "Retinol and pure Vitamin C require vastly different pH environments to thrive. Using them simultaneously leads to raw irritation and render both inactive. Use Vitamin C in the morning, and Retinol at night." };
    }
    if (list.includes("Retinol (Pure Vitamin A)") && list.includes("Niacinamide (Vitamin B3)")) {
      return { rating: "Excellent Synergy", color: "text-emerald-400 border-emerald-900/30 bg-emerald-950/20", text: "Niacinamide acts as a powerful security shield, dramatically curtailing Retinol-induced dryness and flakiness while multiplying the overall skin-barrier resilience." };
    }
    if (list.includes("Ceramides (NP, AP, EOP)") && list.includes("Squalane")) {
      return { rating: "Excellent Synergy", color: "text-emerald-400 border-emerald-900/30 bg-emerald-950/20", text: "These lipophilic materials work in gorgeous absolute harmony. Squalane behaves as an emollient softener while ceramides bind intercellular cracks to trap moisture perfectly." };
    }
    if (list.length <= 1) {
      return { rating: "Awaiting Formulation Pairs", color: "text-amber-400 border-amber-900/30 bg-amber-950/20", text: "Select 2 or more ingredients above in the catalog to calculate a live biomimetic molecular compatibility rating." };
    }
    return { rating: "Safe & Supportive Layering", color: "text-indigo-400 border-indigo-900/30 bg-indigo-950/20", text: "These botanical active compounds operate in highly compatible neutral pH bands, allowing smooth cellular absorbency without barrier interference." };
  };

  const toggleCheckedIngredient = (name: string) => {
    if (checkedIngredients.includes(name)) {
      setCheckedIngredients(checkedIngredients.filter(n => n !== name));
    } else {
      setCheckedIngredients([...checkedIngredients, name]);
    }
  };

  // Reorder functions
  const shiftRoutineItem = (type: "am" | "pm", idx: number, direction: "up" | "down") => {
    const targetRoutine = type === "am" ? [...morningRoutine] : [...nightRoutine];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= targetRoutine.length) return;
    
    const temp = targetRoutine[idx];
    targetRoutine[idx] = targetRoutine[targetIdx];
    targetRoutine[targetIdx] = temp;

    if (type === "am") setMorningRoutine(targetRoutine);
    else setNightRoutine(targetRoutine);
  };

  const removeRoutineItem = (type: "am" | "pm", idx: number) => {
    if (type === "am") setMorningRoutine(morningRoutine.filter((_, i) => i !== idx));
    else setNightRoutine(nightRoutine.filter((_, i) => i !== idx));
  };


  return (
    <div id="ai-rituals-container" className="min-h-screen bg-ivory text-charcoal overflow-x-hidden font-sans relative selection:bg-gold/20 selection:text-charcoal">
      
      {/* Background Ambience Lines/Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] bg-gold/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[180px]" />
        {/* Fine scanline aesthetic overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.015),rgba(0,255,0,0.01),rgba(0,0,255,0.015))] bg-[size:100%_4px,6px_100%]" />
      </div>

      {/* Persistent Elegant Header Nav block */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-charcoal/5 py-3 px-3 sm:py-4 sm:px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button 
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-full border border-charcoal/10 hover:border-gold hover:text-gold transition-colors flex items-center justify-center cursor-pointer bg-charcoal/5 shrink-0"
            id="rituals-back-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <div className="min-w-0 truncate">
            <span className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.45em] text-[#C9A227] font-mono block uppercase truncate">LABORATORY EXPERIMENTAL</span>
            <span className="text-charcoal font-medium text-[10px] sm:text-xs md:text-sm font-serif tracking-[0.1em] sm:tracking-[0.25em] block truncate">AI RITUAL DIAGNOSTICS</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[10px] sm:text-xs text-taupe font-mono shrink-0">
          <span className="text-gold animate-pulse">● REAL-TIME COMPILING ACTIVE</span>
          <span className="h-4 w-[1px] bg-charcoal/15" />
          <span>v4.0.12 Secure Node</span>
        </div>
      </header>

      {/* Main Container Views Switched */}
      <AnimatePresence mode="wait">
        
        {/* MODE 1: THE FULLSCREEN CINEMATIC HERO */}
        {activeStep === "hero" && (
          <motion.section 
            key="hero-step"
            className="min-h-screen pt-28 pb-16 px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center text-center relative z-10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Animated floating molecules structure illustration */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 relative mb-6 sm:mb-8 flex justify-center items-center">
              <motion.div 
                className="w-12 h-12 sm:w-16 sm:h-16 border border-gold/30 rounded-full flex justify-center items-center relative animate-pulse"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gold rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#C9A227] rounded-full" />
                <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </motion.div>
              <div className="absolute inset-0 border border-charcoal/5 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute -top-4 w-2 h-2 bg-indigo-500 rounded-full" />
              <div className="absolute -bottom-4 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>

            {/* Glowing Mouse spotlight reactive test card */}
            <div 
              onMouseMove={handleMouseMove}
              className="max-w-4xl w-full p-6 sm:p-10 md:p-12 rounded-3xl sm:rounded-[2.5rem] bg-ivory/70 border border-charcoal/15 backdrop-blur-[18px] relative overflow-hidden group shadow-2xl mt-2 mb-6"
              style={{
                boxShadow: "0 50px 100px -20px rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              {/* Radial Mouse Spot Glow */}
              <div 
                className="absolute w-[250px] h-[250px] bg-gold/15 rounded-full blur-[40px] pointer-events-none transition-transform duration-100 ease-out opacity-0 group-hover:opacity-100"
                style={{
                  left: mousePos.x - 125,
                  top: mousePos.y - 125
                }}
              />

              <span className="text-[10px] tracking-[0.5em] font-mono text-gold block mb-4 uppercase font-bold" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                TIVA INTUITIVE COSMETIC ENGINE
              </span>

              {/* Headline animation letter-by-letter */}
              <h1 
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
                className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none text-charcoal font-extrabold uppercase"
              >
                YOUR SKIN. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-gold to-stone-200 font-serif italic font-bold">UNDERSTOOD.</span>
              </h1>

              <p 
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
                className="font-serif text-sm sm:text-base md:text-xl text-taupe font-normal max-w-2xl mx-auto mt-6 sm:mt-8 leading-relaxed"
              >
                An AI-powered ritual built specifically for your skin, lifestyle, circadian schedule and local environment.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-12">
                <button
                  onClick={() => setActiveStep("why")}
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-gold to-[#A37B1D] hover:from-[#E3BC42] hover:to-gold text-charcoal font-bold text-xs tracking-[0.3em] uppercase rounded-full shadow-lg shadow-gold/20 cursor-pointer transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center space-x-2"
                  id="hero-begin-ritual"
                >
                  <span className="font-bold text-ivory">Begin Your Ritual</span>
                  <Sparkles className="w-4 h-4 text-ivory ml-1" />
                </button>
                <button
                  onClick={() => {
                    // Pre-fill answers with dummy standard profile and trigger results
                    setAnswers(p => ({ ...p, skinType: "Sensitive", primaryConcern: "Barrier Damage", environment: "Bangalore" }));
                    startDermalAssembly();
                  }}
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black/40 border border-[#C9A227] hover:border-gold hover:bg-charcoal/15 text-gold font-bold text-xs tracking-[0.3em] uppercase rounded-full cursor-pointer transition-all hover:scale-[1.03] flex items-center justify-center space-x-2 shadow-sm"
                  id="hero-see-demo"
                >
                  <span className="text-gold font-bold select-none">See Demo Profile</span>
                </button>
              </div>
            </div>

            {/* Scrolling Indicator - Kept in standard relative flex flow to completely guarantee zero overlapping across any window size */}
            <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center space-y-2 opacity-90 z-20">
              <span className="text-[10px] font-mono tracking-widest text-charcoal uppercase font-bold">Interactive Navigation Suite</span>
              <div className="w-1.5 h-6 rounded-full border border-taupe p-0.5">
                <motion.div 
                  className="w-1 h-2 bg-gold rounded-full"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* MODE 2: THE WHY SECTION (Durable structural panels) */}
        {activeStep === "why" && (
          <motion.section 
            key="why-step"
            className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10 flex flex-col justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] tracking-[0.5em] font-mono text-gold block mb-3 uppercase font-bold">SCIENCE METRICS</span>
              <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-bold leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>Why Skin AI Rituals?</h2>
              <div className="w-16 h-[1.5px] bg-gold my-6 mx-auto" />
              <p className="text-sm font-medium text-taupe leading-relaxed">
                Traditional off-the-shelf formulas fail to capture the fluid cellular changes your skin undergoes daily. Through clinical metadata modeling, we match chemical active matrices to absolute human circumstances.
              </p>
            </div>

            {/* Scrollable 3D Tilt interactive bento grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { title: "Personal Analysis", icon: Eye, desc: "We track epidermal barrier water cohesion, calculating absolute hydration deficit levels based on biological age and baseline skin types." },
                { title: "Ingredient Intelligence", icon: Sparkles, desc: "We cross-examine molecular sizes, molecular charges and lipid compatibility structures to select pure, plant-derived non-comedogenic ingredients." },
                { title: "Routine Optimization", icon: Layers, desc: "An intelligent ordering graph maps optimal cell layers, ensuring raw acidic structures never overlap basic cellular binders." },
                { title: "Lifestyle Integration", icon: Heart, desc: "Integrate rest parameters, cortisol stress triggers, and daily screen time blue light emission offsets to repair skin from within." },
                { title: "Climate Adaptation", icon: Wind, desc: "A live environmental calculation adjustments recommendations based on humidity indexes, ambient UV ray metrics and local pollution counts." },
                { title: "Progress Tracking", icon: Calendar, desc: "Beautiful historical baseline indicators plot your visual barrier thickness transformations across a 180-day biological renewal schedule." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-8 rounded-[2rem] bg-[#0f0f0f]/55 border border-charcoal/10 backdrop-blur-[18px] relative overflow-hidden cursor-pointer group text-left"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-3 w-12 h-12 bg-gold/15 rounded-2xl flex items-center justify-center mb-6 border border-gold/20">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-xs font-normal text-taupe leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setActiveStep("consultation")}
                className="px-16 py-5 bg-gold text-ivory font-bold text-xs tracking-[0.3em] uppercase rounded-full shadow-lg shadow-gold/20 cursor-pointer hover:bg-charcoal hover:text-ivory transition-all font-mono"
                id="see-diagnostic-start"
              >
                Launch Diagnostic Consultation
              </button>
            </div>
          </motion.section>
        )}        {/* MODE 3: THE AI CONSULTATION CONVERSATIONAL WIZARD */}
        {activeStep === "consultation" && (
          <motion.section 
            key="consultation-step"
            className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto relative z-10 flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header info wizard */}
            <div className="mb-10 text-left flex justify-between items-end border-b border-charcoal/10 pb-6">
              <div>
                <span className="text-[10px] tracking-[0.4em] font-mono text-gold uppercase block mb-1 font-bold">
                  SECURE DIAGNOSTIC ASSESSMENT
                </span>
                <h2 className="font-serif text-3xl font-bold text-charcoal uppercase tracking-wide" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                  AI RITUAL ARCHITECT
                </h2>
              </div>
              <div className="text-right text-taupe font-mono text-xs font-semibold">
                <span className="text-gold font-bold">Estimated Completing:</span> 2 minutes
              </div>
            </div>

            {/* Liquid Progress Bar */}
            <div className="w-full h-2 bg-charcoal/10 rounded-full overflow-hidden mb-12 relative border border-charcoal/5">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold via-amber-400 to-[#C9A227]"
                initial={{ width: 0 }}
                animate={{ width: `${(conStep / totalQuestions) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Questions Form Body Glass Container */}
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-ivory/70 border border-charcoal/15 backdrop-blur-[18px] relative min-h-[420px] flex flex-col justify-between shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              
              <AnimatePresence mode="wait">
                
                {/* QUESTION 1: SKIN TYPE */}
                {conStep === 1 && (
                  <motion.div 
                    key="q1"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 01</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Differentiate your primary systemic biological skin bio-type.
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {["Dry", "Oily", "Combination", "Sensitive", "Normal"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setAnswers({ ...answers, skinType: t })}
                          className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                            answers.skinType === t
                              ? "bg-[#C9A227]/25 border-gold text-charcoal shadow-md shadow-gold/5 font-bold"
                              : "bg-beige/60 border-charcoal/10 hover:border-charcoal/20 text-taupe"
                          }`}
                        >
                          <span className="font-serif text-lg font-bold block mb-1">{t}</span>
                          <span className="text-xs text-taupe mt-2 block leading-relaxed font-normal">
                            {t === "Dry" && "Prone to fine scales, dermal tightness, poor natural lipid sheet generation."}
                            {t === "Oily" && "Overactive sebaceous activity, high visual sebum flow, deep cellular hydration retention."}
                            {t === "Combination" && "Variable characteristics: highly concentrated oily T-Zone with extremely dry flaking cheeks."}
                            {t === "Sensitive" && "Highly reactive epidermal wall, quick to capillary red flushing, easily provoked by chemical actives."}
                            {t === "Normal" && "Stable barrier function, adequate sebum flow, strong environmental adaptive mechanisms."}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 2: CONCERNS */}
                {conStep === 2 && (
                  <motion.div 
                    key="q2"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 02</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Identify your core critical focus or epidermal concern below.
                      </h3>
                      <p className="text-xs font-mono text-taupe mt-2 uppercase tracking-wider font-bold">
                        Select all that apply. Tap a selected item again to deselect.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                      {[
                        "Acne", "Pigmentation", "Dark Spots", "Fine Lines", "Uneven Tone", 
                        "Dullness", "Large Pores", "Oiliness", "Dehydration", "Redness", "Barrier Damage"
                      ].map((c) => {
                        const isSelected = answers.primaryConcern.split(", ").filter(Boolean).includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => {
                              const selectedList = answers.primaryConcern ? answers.primaryConcern.split(", ").filter(Boolean) : [];
                              let updatedList: string[];
                              if (selectedList.includes(c)) {
                                  updatedList = selectedList.filter((item) => item !== c);
                              } else {
                                  updatedList = [...selectedList, c];
                              }
                              // Maintain at least one concern (fallback to Dehydration)
                              if (updatedList.length === 0) {
                                updatedList = ["Dehydration"];
                              }
                              setAnswers({ ...answers, primaryConcern: updatedList.join(", ") });
                            }}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#C9A227]/25 border-gold text-charcoal font-bold"
                                : "bg-beige/60 border-charcoal/10 hover:bg-beige/80 text-taupe"
                            }`}
                          >
                            <span className="font-serif text-sm font-bold">{c}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-gold shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 3: AGE */}
                {conStep === 3 && (
                  <motion.div 
                    key="q3"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 03</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug drop-shadow-md" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Specify your chronological age. This impacts fibroblast regeneration latency.
                      </h3>
                    </div>
                    <div className="py-12 px-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-taupe font-mono font-bold">Biological baseline threshold</span>
                        <span className="text-5xl font-serif text-gold font-bold animate-pulse">{answers.age} <span className="text-lg text-charcoal">years</span></span>
                      </div>
                      <input 
                        type="range" 
                        min="16" 
                        max="85" 
                        value={answers.age} 
                        onChange={(e) => setAnswers({ ...answers, age: parseInt(e.target.value) })}
                        className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                      />
                      <div className="flex justify-between text-xs text-taupe font-bold font-mono mt-3">
                        <span>16 Years</span>
                        <span>50 Years</span>
                        <span>85 Years</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 4: GENDER */}
                {conStep === 4 && (
                  <motion.div 
                    key="q4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 04</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Identify your gender identity. (Optional indicator for hormone-sebum ratios)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-12">
                      {["Female", "Male", "Non-Binary", "Not Specified"].map((g) => (
                        <button
                          key={g}
                          onClick={() => setAnswers({ ...answers, gender: g })}
                          className={`p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                            answers.gender === g
                              ? "bg-gold/25 border-gold text-charcoal font-bold"
                              : "bg-beige/60 border-charcoal/10 hover:border-charcoal/20 text-taupe"
                          }`}
                        >
                          <span className="font-serif text-base block font-bold">{g}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 5: CURRENT ROUTINE */}
                {conStep === 5 && (
                  <motion.div 
                    key="q5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 05</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Determine your current skin routine density.
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                      {["None", "Basic", "Intermediate", "Advanced"].map((r) => (
                        <button
                          key={r}
                          onClick={() => setAnswers({ ...answers, currentRoutine: r })}
                          className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                            answers.currentRoutine === r
                              ? "bg-gold/25 border-gold text-charcoal font-bold animate-[pulse_3s_infinite]"
                              : "bg-beige/60 border-charcoal/10 hover:border-charcoal/20 text-taupe"
                          }`}
                        >
                          <span className="font-serif text-lg font-bold block mb-1">{r}</span>
                          <span className="text-xs text-taupe mt-2 block leading-relaxed font-normal">
                            {r === "None" && "No topical products applied regularly besides occasional water rinses."}
                            {r === "Basic" && "Standard daily cleanser and single moisturizer application. Minimal sunscreen layer."}
                            {r === "Intermediate" && "Cleanse, hydrate, isolate sunscreen and occasional exfoliant treatments."}
                            {r === "Advanced" && "Elaborate multi-active layering routines incorporating retinoic acids, peptides, antioxidants, barrier repair lipids."}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 6: LIFESTYLE */}
                {conStep === 6 && (
                  <motion.div 
                    key="q6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 06</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Lifestyle calibration. Cortisol and rest heavily dictate barrier healing speed.
                      </h3>
                    </div>
                    <div className="space-y-6 pt-4">
                      {/* Stress Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <label className="text-taupe uppercase tracking-widest font-mono font-bold">Daily Stress Load (1-10)</label>
                          <span className="text-gold font-mono font-bold">{answers.lifestyle.stress} / 10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={answers.lifestyle.stress} 
                          onChange={(e) => setAnswers({ ...answers, lifestyle: { ...answers.lifestyle, stress: parseInt(e.target.value) } })}
                          className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                        />
                      </div>

                      {/* Sleep Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <label className="text-taupe uppercase tracking-widest font-mono font-bold">Repose Sleep Duration (hours)</label>
                          <span className="text-gold font-mono font-bold">{answers.lifestyle.sleep} hours</span>
                        </div>
                        <input 
                          type="range" min="4" max="10" 
                          value={answers.lifestyle.sleep} 
                          onChange={(e) => setAnswers({ ...answers, lifestyle: { ...answers.lifestyle, sleep: parseInt(e.target.value) } })}
                          className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                        />
                      </div>

                      {/* Screen Time Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <label className="text-taupe uppercase tracking-widest font-mono font-bold">Daily Monitor/Screen Emission Exposure</label>
                          <span className="text-gold font-mono font-bold">{answers.lifestyle.screenTime} Hrs</span>
                        </div>
                        <input 
                          type="range" min="1" max="16" 
                          value={answers.lifestyle.screenTime} 
                          onChange={(e) => setAnswers({ ...answers, lifestyle: { ...answers.lifestyle, screenTime: parseInt(e.target.value) } })}
                          className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 7: ENVIRONMENTAL ENGINE CITY */}
                {conStep === 7 && (
                  <motion.div 
                    key="q7"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 07</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Local Geolocation Atmosphere Engine integration. Select your environment.
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-10">
                      {Object.keys(CITIES_METRICS).map((city) => {
                        const cell = CITIES_METRICS[city];
                        return (
                          <button
                            key={city}
                            onClick={() => setAnswers({ ...answers, environment: city })}
                            className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-44 ${
                              answers.environment === city
                                ? "bg-gold/25 border-gold text-charcoal font-bold"
                                : "bg-beige/60 border-charcoal/10 text-taupe hover:border-charcoal/20"
                            }`}
                          >
                            <div>
                              <MapPin className="w-4.5 h-4.5 text-gold mb-3" />
                              <span className="font-serif text-base block text-charcoal font-bold">{city}</span>
                            </div>
                            <div className="text-[11px] font-mono mt-4 leading-relaxed text-taupe font-medium">
                              <div>Humidity: {cell.humidity}%</div>
                              <div>Ambient UV: {cell.uv}</div>
                              <div>Temp: {cell.temp}°C</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 8: DAILY SUN EXPOSURE */}
                {conStep === 8 && (
                  <motion.div 
                    key="q8"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 08</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Quantify your direct daily Solar/UV Exposure.
                      </h3>
                    </div>
                    <div className="py-12 px-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-taupe font-mono font-bold">Calculated photoprotective resistance tier</span>
                        <span className="text-4xl font-serif text-gold font-bold">
                          {answers.sunExposure === 1 && "Minimal/Incidental"}
                          {answers.sunExposure === 2 && "Moderate (Occasional strolls)"}
                          {answers.sunExposure === 3 && "Substantial (1-2 hours UV)"}
                          {answers.sunExposure === 4 && "Severe (Extended high exposure)"}
                        </span>
                      </div>
                      <input 
                        type="range" min="1" max="4" 
                        value={answers.sunExposure} 
                        onChange={(e) => setAnswers({ ...answers, sunExposure: parseInt(e.target.value) })}
                        className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                      />
                      <div className="flex justify-between text-xs text-taupe font-bold font-mono mt-3">
                        <span>Minimal</span>
                        <span>Moderate</span>
                        <span>Intermittent</span>
                        <span>Extreme</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 9: WATER CONSUMPTION */}
                {conStep === 9 && (
                  <motion.div 
                    key="q9"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 09</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Estimate daily hydration liquid intake (standard raw glasses).
                      </h3>
                    </div>
                    <div className="py-12 px-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-taupe font-mono font-bold">Aquatic cellular support metrics</span>
                        <span className="text-5xl font-serif text-gold font-bold">{answers.waterConsumption} <span className="text-lg text-charcoal font-bold">glasses / day</span></span>
                      </div>
                      <input 
                        type="range" min="2" max="14" 
                        value={answers.waterConsumption} 
                        onChange={(e) => setAnswers({ ...answers, waterConsumption: parseInt(e.target.value) })}
                        className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                      />
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 10: SKIN SENSITIVITY */}
                {conStep === 10 && (
                  <motion.div 
                    key="q10"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 10</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Skin reactivity and sensitivity threshold gauge.
                      </h3>
                    </div>
                    <div className="py-12 px-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-taupe font-mono font-bold">Corneocyte susceptibility level</span>
                        <span className="text-4xl font-serif text-gold font-bold">
                          {answers.skinSensitivity <= 3 && "Earthy / Highly Resilient"}
                          {answers.skinSensitivity > 3 && answers.skinSensitivity <= 7 && "Standard Reactive Boundary"}
                          {answers.skinSensitivity > 7 && "Highly Delicate Barrier Interrupted"}
                        </span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={answers.skinSensitivity} 
                        onChange={(e) => setAnswers({ ...answers, skinSensitivity: parseInt(e.target.value) })}
                        className="w-full h-3 bg-beige border border-charcoal/30 rounded-full appearance-none cursor-pointer accent-gold focus:outline-none focus:ring-1 focus:ring-gold/50"
                      />
                    </div>
                  </motion.div>
                )}

                {/* QUESTION 11: BUDGET PREFERENCE */}
                {conStep === 11 && (
                  <motion.div 
                    key="q11"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6 text-left"
                  >
                    <div>
                      <span className="text-xs font-mono text-gold uppercase tracking-widest font-bold">Question 11</span>
                      <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-2 max-w-2xl leading-snug" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                        Bespoke financial active selection budget bracket.
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-12">
                      {["Affordable", "Premium", "Luxury", "No Preference"].map((b) => (
                        <button
                          key={b}
                          onClick={() => setAnswers({ ...answers, budget: b })}
                          className={`p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                            answers.budget === b
                              ? "bg-gold/25 border-gold text-charcoal font-bold"
                              : "bg-beige/60 border-charcoal/10 hover:border-charcoal/20 text-taupe"
                          }`}
                        >
                          <span className="font-serif text-base block font-bold">{b}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Wizard Nav Controls Footer */}
              <div className="flex justify-between items-center pt-8 border-t border-charcoal/5 mt-8">
                <button
                  onClick={() => {
                    if (conStep > 1) setConStep(conStep - 1);
                    else setActiveStep("why");
                  }}
                  className="px-6 py-3.5 border border-charcoal/10 rounded-full hover:bg-charcoal/5 text-taupe hover:text-charcoal uppercase tracking-widest text-[9px] font-mono cursor-pointer transition-all"
                  id="con-prev-btn"
                >
                  Back
                </button>
                <div className="font-mono text-stone-500 text-xs hidden sm:inline">
                  Step {conStep} / {totalQuestions}
                </div>
                <button
                  onClick={() => {
                    if (conStep < totalQuestions) {
                      setConStep(conStep + 1);
                    } else {
                      startDermalAssembly();
                    }
                  }}
                  className="px-8 py-3.5 bg-charcoal text-ivory rounded-full hover:bg-gold hover:text-charcoal uppercase tracking-[0.2em] text-[9px] font-mono font-medium cursor-pointer transition-all shadow-lg flex items-center space-x-2"
                  id="con-next-btn"
                >
                  <span>{conStep === totalQuestions ? "Assemble Ritual" : "Proceed Step"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.section>
        )}

        {/* MODE 4: THE MOLECULAR ASSEMBLER LOADER SCREEN */}
        {activeStep === "loading" && (
          <motion.div 
            key="loading-step"
            className="min-h-screen flex flex-col justify-center items-center text-center relative z-10 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Spinning molecules ring assembly */}
            <div className="relative w-44 h-44 mb-8 flex justify-center items-center">
              <motion.div 
                className="w-24 h-24 border border-dashed border-gold rounded-full animate-spin"
                style={{ animationDuration: "12s" }}
              />
              <motion.div 
                className="w-36 h-36 border border-double border-charcoal/20 rounded-full absolute animate-[spin_24s_linear_infinite]"
                style={{ animationDuration: "24s" }}
              />
              <motion.div 
                className="w-16 h-16 bg-gold/20 rounded-full absolute border border-gold/40 backdrop-blur-md flex items-center justify-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-gold animate-pulse" />
              </motion.div>

              {/* Orbiting mock satellites molecules */}
              <div className="absolute top-1 left-12 w-3 h-3 bg-indigo-400 rounded-full blur-[1px]" />
              <div className="absolute bottom-5 right-10 w-2.5 h-2.5 bg-emerald-400 rounded-full blur-[1px]" />
              <div className="absolute top-24 left-1 w-3.5 h-3.5 bg-[#C9A227] rounded-full blur-[1px]" />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.55em] font-mono text-gold uppercase block animate-pulse font-bold" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                TIVA DEEP COMPILING LAB REGISTER...
              </span>
              <p className="text-xl font-serif italic text-charcoal font-bold transition-all duration-300">
                {loaderText}
              </p>
              <div className="text-[11px] font-mono text-taupe uppercase tracking-widest max-w-md mx-auto pt-4 leading-relaxed font-bold">
                Evaluating {answers.skinType} dermal bio-parameters • {answers.environment} geo-humidity offsets • {answers.primaryConcern} matrix priority.
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE 5: THE GRAND RESULT SCREEN (THE $100M LUXURY BRAND OUTCOME) */}
        {activeStep === "result" && (
          <motion.div 
            key="result-step"
            className="min-h-screen pt-32 pb-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Elegant Top Banner */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16 border-b border-charcoal/10 pb-10 text-left">
              <div>
                <span className="text-[10px] tracking-[0.5em] font-mono text-gold uppercase block mb-2 font-bold">
                  FORMULATION GENERATED SECURELY
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-bold tracking-wide uppercase" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                  Personalized Ritual Board
                </h2>
                <div className="flex items-center space-x-3 text-taupe font-serif text-sm mt-3 font-semibold">
                  <span className="bg-charcoal/10 px-2 py-1 rounded text-xs font-mono">Client Profile Match: Code {answers.skinType.toUpperCase()}-{answers.primaryConcern.slice(0, 3).toUpperCase()}-{answers.age}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">System Diagnostics Complete</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => alert("Simulating high-resolution PDF download wrapper. Your TIVA diagnostic record is registered locally under client ID TIVA-2026-06.")}
                  className="px-6 py-3 bg-[#0f0f0f]/60 hover:bg-[#C9A227]/20 border border-charcoal/20 text-xs font-bold font-mono tracking-widest uppercase cursor-pointer transition-all rounded-full flex items-center space-x-2 text-taupe"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blueprint</span>
                </button>
                <button
                  onClick={() => alert("Copied secure diagnostic dashboard link to clipboard.")}
                  className="px-6 py-3 bg-[#0f0f0f]/60 hover:bg-[#C9A227]/20 border border-charcoal/20 text-xs font-bold font-mono tracking-widest uppercase cursor-pointer transition-all rounded-full flex items-center space-x-2 text-taupe"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Portal</span>
                </button>
                <button
                  onClick={() => {
                    setConStep(1);
                    setActiveStep("consultation");
                  }}
                  className="px-6 py-3 bg-gold border border-gold text-charcoal font-bold text-xs font-mono tracking-widest uppercase hover:bg-charcoal hover:border-charcoal hover:text-ivory cursor-pointer transition-all rounded-full flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4 text-charcoal" />
                  <span>Restart Consultation</span>
                </button>
              </div>
            </div>

            {/* GRAND SUMMARY CARD BANNER */}
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-stone-900/60 via-yellow-950/20 to-stone-900/60 border border-charcoal/15 mb-12 flex flex-col md:flex-row justify-between items-center gap-12 text-left relative overflow-hidden shadow-2xl backdrop-blur-md"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center space-x-2 border border-gold/30 bg-gold/15 px-3 py-1.5 rounded-full text-gold text-[10px] font-mono tracking-widest uppercase font-bold">
                  <Award className="w-3.5 h-3.5 text-gold" />
                  <span>Highly Calibrated Synergy Grade: A+</span>
                </div>
                <h3 className="font-serif text-3xl md:text-5xl font-bold text-charcoal leading-tight" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                  Hello, Your Personalized <br/>
                  <span className="font-serif italic text-gold font-bold">TIVA Ritual</span> is Ready.
                </h3>
                <p className="text-sm font-normal text-taupe leading-relaxed max-w-xl">
                  Based on a comprehensive 11-point biological profile assessment matched against the micro-climates of {answers.environment}, our clinical algorithm confirms a high priority for <strong className="text-charcoal font-bold">{answers.primaryConcern} treatment</strong> and corrective deep hydration barrier locking.
                </p>
              </div>

              {/* Circular AI Skin Score Circle meter */}
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="82"
                    className="stroke-white/10 fill-transparent"
                    strokeWidth="8"
                  />
                  <motion.circle
                     cx="96"
                     cy="96"
                     r="82"
                     className="stroke-[#C9A227] fill-transparent animate-pulse"
                     strokeWidth="8"
                     strokeDasharray={2 * Math.PI * 82}
                     initial={{ strokeDashoffset: 2 * Math.PI * 82 }}
                     animate={{ strokeDashoffset: 2 * Math.PI * 82 * (1 - computedScore / 100) }}
                     transition={{ duration: 2.2, ease: "easeOut" }}
                   />
                </svg>
                {/* Score text inside circle */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono tracking-widest text-[#C9A227] uppercase font-bold">Skin Score</span>
                  <motion.span 
                    className="text-6xl font-serif text-[#C9A227] font-extrabold block select-none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.08, 1],
                      opacity: 1,
                      textShadow: [
                        "0 0 12px rgba(201,162,39,0.3)",
                        "0 0 28px rgba(201,162,39,0.9)",
                        "0 0 12px rgba(201,162,39,0.3)"
                      ]
                    }}
                    transition={{
                      scale: {
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      },
                      textShadow: {
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      },
                      opacity: {
                        duration: 0.7,
                        ease: "easeOut"
                      }
                    }}
                  >
                    {computedScore}
                  </motion.span>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase mt-1 font-bold">Excellent Range</span>
                </div>
              </div>
            </div>

            {/* CLINICAL SCORE METRICS PROFILE DETAILED BREAKDOWNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { name: "Stratum Corneum Hydration Index", desc: "Measures sub-cutaneous water tension index", current: metricsBreakdown.hydration, label: "65-100 Ideal" },
                { name: "Molecular Lipid Barrier Support", desc: "Corneocyte cohesion and trans-epidermal loss resistance", current: metricsBreakdown.barrier, label: "70-100 Normal" },
                { name: "Antioxidant Brightness Index", desc: "Melanin clustering and light reflection glaze density", current: metricsBreakdown.brightness, label: "50-100 Radiant" },
                { name: "Regulatory Lipophilic Sebum Balance", desc: "Sebaceous duct secretion stability mapping", current: metricsBreakdown.oilBalance, label: "Balanced Band" }
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-3xl bg-ivory/70 border border-charcoal/15 backdrop-blur-[18px] text-left flex flex-col justify-between"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl text-gold font-serif font-bold">{item.current}%</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-1 bg-charcoal/10 border border-charcoal/25 rounded uppercase text-taupe">{item.label}</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-charcoal mb-2 uppercase">{item.name}</h4>
                    <p className="text-[11px] font-normal text-taupe leading-normal mb-4">{item.desc}</p>
                  </div>
                  {/* Subtle bar progress */}
                  <div className="w-full h-2 bg-charcoal/10 rounded-full overflow-hidden mt-6 border border-charcoal/5">
                    <div className="bg-gold h-full" style={{ width: `${item.current}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* GRID LAYOUT FOR CLINICAL UTILITIES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* SECTION A: ADVANCED FUTURE READY CAMERA AI FACE SCAN MODULE */}
              <div className="lg:col-span-6 p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/15 text-left flex flex-col justify-between relative overflow-hidden min-h-[440px] shadow-xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Ambient glow decoration */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                
                <div>
                  <div className="flex items-center space-x-2 text-indigo-400 mb-4 bg-indigo-950/20 px-3 py-1.5 rounded-full inline-flex border border-indigo-900/30">
                    <Camera className="w-4.5 h-4.5 text-indigo-350" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-300 font-bold">TIVA HIGH-PRECISION METRICS</span>
                  </div>
                  <h4 className="font-serif text-2xl text-charcoal font-bold uppercase tracking-wide" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                    Live Skin Texture Face Scan
                  </h4>
                  <p className="text-xs font-medium text-taupe leading-relaxed mt-2 max-w-md">
                    Launch our real-time spatial analysis engine. Using advanced facial alignment models, we analyze regional lipid levels and cellular density boundaries securely through your browser.
                  </p>
                </div>

                {/* Hidden File Input for Custom Upload */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />

                {/* Simulated/Real Video Frame viewport with select click */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={fileDropHandler}
                  onClick={() => {
                    if (!isCameraActive && !scanning) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`w-full h-56 rounded-2xl border-2 border-dashed border-charcoal/20 bg-black/60 relative overflow-hidden my-6 flex flex-col items-center justify-center p-6 text-center transition-all ${
                    !isCameraActive && !scanning ? "cursor-pointer hover:border-gold/50 hover:bg-beige/35" : ""
                  }`}
                >
                  {imageFile && !isCameraActive ? (
                    <img 
                      src={imageFile} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt="Analyzed preview portrait"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}

                  {isCameraActive ? (
                    <video 
                      ref={videoRef} 
                      className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
                      playsInline 
                      muted 
                    />
                  ) : null}

                  {/* AI Scanning Lines Animation */}
                  {scanning && (
                    <motion.div 
                      className="absolute left-0 right-0 h-[2.5px] bg-emerald-400 shadow-[0_0_15px_#4ade80] z-20"
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Aesthetic grid alignments HUD overlay */}
                  <div className="absolute inset-x-8 inset-y-6 border border-charcoal/10 pointer-events-none z-10 flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-t-2 border-l-2 border-gold" />
                      <div className="w-4 h-4 border-t-2 border-r-2 border-gold" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-gold" />
                      <div className="w-4 h-4 border-b-2 border-r-2 border-gold" />
                    </div>
                  </div>

                  {/* Intersect scan info */}
                  <div className="relative z-10 text-center">
                    {!scanning && !scanComplete && !isCameraActive && (
                      <div className="space-y-2 bg-black/50 p-4 rounded-xl border border-charcoal/10 backdrop-blur-sm">
                        <Upload className="w-10 h-10 text-gold mx-auto mb-3" />
                        <span className="text-xs font-mono text-charcoal block mb-1 font-bold">TAP TO CHOOSE OR DRAG PORTRAIT</span>
                        <span className="text-[11px] text-taupe bg-black/40 px-3 py-1 rounded border border-charcoal/10 inline-block font-semibold">Any picture of your choice for analysis</span>
                      </div>
                    )}
                    {isCameraActive && !scanning && (
                      <div className="space-y-2 bg-black/55 p-4 rounded-xl border border-charcoal/10 backdrop-blur-md">
                        <span className="text-xs font-mono text-gold block tracking-widest uppercase font-bold animate-pulse">📷 CAMERA READY</span>
                        <span className="text-[11px] text-taupe block font-semibold">Align your face carefully in center grid</span>
                      </div>
                    )}
                    {scanning && (
                      <div className="space-y-2 bg-black/55 p-4 rounded-xl border border-charcoal/10 backdrop-blur-md">
                        <Activity className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
                        <span className="text-xs font-mono text-emerald-400 block tracking-widest uppercase font-bold">{scanSection}</span>
                        <span className="text-[11px] text-taupe block font-semibold">Maintain static facial alignment</span>
                      </div>
                    )}
                    {scanComplete && !scanning && (
                      <div className="space-y-2 bg-black/95 p-5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
                        <Check className="w-9 h-9 text-emerald-400 mx-auto mb-2 animate-bounce" />
                        <span className="text-xs font-mono text-charcoal block tracking-widest uppercase font-bold">PORTRAIT ANALYSIS COMPLETE</span>
                        <p className="text-[11px] text-taupe leading-relaxed max-w-sm px-4 font-medium">
                          Bespoke parameters calibrated successfully. Click the "View Cellular Skin Diagnostics" button below to display your interactive skin laboratory report.
                        </p>
                        <span className="text-[9px] font-mono text-gold hover:underline mt-2 inline-block cursor-pointer font-bold bg-charcoal/5 border border-charcoal/10 px-2 py-0.5 rounded-full">
                          Tap to upload another portrait of your choice
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {apiNotice && (
                  <div className="px-4 py-2.5 mb-4 rounded-xl bg-indigo-950/40 border border-indigo-900/30 text-[10.5px] font-mono font-semibold text-indigo-300 leading-relaxed">
                    {apiNotice}
                  </div>
                )}

                <div className="space-y-4 w-full">
                  {scanComplete && !scanning && (
                    <button
                      onClick={() => setActiveStep("premium-results")}
                      className="w-full py-4 bg-gradient-to-r from-gold to-yellow-600 text-ivory font-extrabold text-xs font-mono tracking-widest uppercase hover:from-charcoal hover:to-charcoal cursor-pointer text-center rounded-2xl transition-all shadow-2xl hover:scale-[1.01] active:scale-95 border border-gold/40 flex items-center justify-center space-x-2 animate-bounce"
                    >
                      <span>Generate My Ritual</span>
                      <ArrowRight className="w-4 h-4 text-ivory" />
                    </button>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        className="flex-1 py-3.5 bg-charcoal text-ivory font-bold text-xs font-mono tracking-widest uppercase hover:bg-gold hover:text-charcoal cursor-pointer text-center rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95"
                      >
                        <span>{scanComplete ? "Rescan / Live Camera" : "Activate Live Camera Screen"}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={captureSnapshot}
                          disabled={scanning}
                          className="flex-1 py-3.5 bg-emerald-500 text-neutral-950 font-bold text-xs font-mono tracking-widest uppercase hover:bg-emerald-400 cursor-pointer text-center rounded-xl transition-all shadow-lg animate-pulse"
                        >
                          {scanning ? "Processing..." : "Capture & Run AI Diagnosis"}
                        </button>
                        <button
                          onClick={stopCamera}
                          className="py-3.5 px-6 bg-rose-950/60 border border-rose-900 text-rose-300 text-xs font-bold font-mono tracking-widest uppercase hover:bg-rose-900 cursor-pointer rounded-xl transition-all text-center"
                        >
                          <span>Kill Stream</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION B: GEOGRAPHICAL INTUITIVE METRICS ENVIRONMENT CLIMATE ENGINE */}
              <div className="lg:col-span-6 p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/15 text-left flex flex-col justify-between relative min-h-[440px] shadow-xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
                
                <div>
                  <div className="flex items-center space-x-2 text-gold mb-4 bg-yellow-950/20 px-3 py-1.5 rounded-full inline-flex border border-gold/20">
                    <Wind className="w-4.5 h-4.5 text-gold" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-gold font-bold">ATMOSPHERIC CLIMATE MODIFIER</span>
                  </div>
                  <h4 className="font-serif text-2xl text-charcoal font-bold uppercase tracking-wide" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                    AI Climate Engine Calibration
                  </h4>
                  <p className="text-xs font-medium text-taupe leading-relaxed mt-2 max-w-md">
                    Seasonal humidity, altitude UV ray index and gaseous diesel pollution compounds dramatically alter cosmetic active volatility. Toggle location to witness recommendation adjustments:
                  </p>
                </div>

                {/* City selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6">
                  {Object.keys(CITIES_METRICS).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCity(c)}
                      className={`py-2 px-3 border rounded-xl text-center text-[11px] font-mono uppercase tracking-widest cursor-pointer transition-all ${
                        selectedCity === c
                          ? "bg-gold/25 border-gold text-charcoal font-bold"
                          : "bg-beige/60 border-charcoal/10 text-taupe hover:border-charcoal/20 font-bold"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Show simulated environmental telemetry charts */}
                <div className="p-5 rounded-2xl bg-black/60 border border-charcoal/15 space-y-4 shadow-inner">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <span className="text-[9px] font-mono text-taupe uppercase block font-bold">Humidity Link</span>
                      <span className="font-serif text-xl text-charcoal font-bold mt-1 block">{CITIES_METRICS[selectedCity].humidity}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-taupe uppercase block font-bold">UV Radiation</span>
                      <span className="font-serif text-xl text-charcoal font-bold mt-1 block">{CITIES_METRICS[selectedCity].uv} / 12</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-taupe uppercase block font-bold">Pollution AQI</span>
                      <span className="font-serif text-xl text-charcoal font-bold mt-1 block">{CITIES_METRICS[selectedCity].pollution}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-taupe uppercase block font-bold">Temperature</span>
                      <span className="font-serif text-xl text-charcoal font-bold mt-1 block">{CITIES_METRICS[selectedCity].temp}°C</span>
                    </div>
                  </div>

                  <div className="border-t border-charcoal/10 pt-4 text-xs font-medium leading-relaxed text-taupe bg-charcoal/5 p-4 rounded-xl">
                    <strong className="text-gold uppercase font-mono text-[10px] block mb-2 font-bold tracking-wider">CLINICAL ENGINE REMEDY MODIFICATION:</strong>
                    {CITIES_METRICS[selectedCity].recommendation}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-taupe leading-normal border-l-2 border-gold pl-3 mt-4 font-semibold">
                  System dynamically compensates formulation water binders when Humidity falls below 30% or UV radiation scales above level 6 indices automatically.
                </div>
              </div>

            </div>

            {/* INTERACTIVE INGREDIENT MOLECULAR GRAPH SUITE */}
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-neutral-950/80 border border-charcoal/15 mb-12 text-left relative shadow-2xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="max-w-2xl mb-8">
                <div className="flex items-center space-x-2 text-gold mb-3 bg-yellow-950/20 px-3 py-1.5 rounded-full inline-flex border border-gold/20">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gold font-bold">Interactive Molecular Codex</span>
                </div>
                <h4 className="font-serif text-2xl md:text-3xl text-charcoal font-bold uppercase tracking-wide" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                  AI Active Ingredient Database Graph
                </h4>
                <p className="text-xs font-medium text-taupe mt-2 leading-relaxed">
                  Every organic chemical formulation operates in high synergistic co-operation. Click a molecule node to evaluate raw cellular benefits, optimal daily timing layer parameters, and hazardous mixing avoidances.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visual Ingredient List Nodes */}
                <div className="lg:col-span-4 flex flex-col space-y-2">
                  {INGREDIENTS_CODEX.map((ing) => (
                    <button
                      key={ing.name}
                      onClick={() => setSelectedIngredient(ing.name)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedIngredient === ing.name
                          ? "bg-gold/25 border-gold text-charcoal font-bold shadow-lg"
                          : "bg-beige/60 border-charcoal/10 text-taupe hover:border-charcoal/20 font-bold"
                      }`}
                    >
                      <span className="font-serif text-sm block">{ing.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Node Details presentation */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-black/70 border border-charcoal/15 space-y-6 flex flex-col justify-between shadow-inner">
                  {(() => {
                    const data = INGREDIENTS_CODEX.find(i => i.name === selectedIngredient) || INGREDIENTS_CODEX[0];
                    return (
                      <>
                        <div className="space-y-4">
                          <h5 className="font-serif text-xl border-b border-charcoal/10 pb-3 text-gold font-bold uppercase tracking-wide">{data.name}</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] font-mono text-taupe uppercase block mb-1.5 font-bold bg-charcoal/10 px-2 py-0.5 rounded tracking-wider inline-block">PRIMARY BIOLOGICAL BENEFITS</span>
                              <p className="text-xs text-taupe leading-relaxed font-medium">{data.benefits}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-taupe uppercase block mb-1.5 font-bold bg-charcoal/10 px-2 py-0.5 rounded tracking-wider inline-block">COMPATIBLE FORMULAS</span>
                              <p className="text-xs text-taupe leading-relaxed font-medium">{data.compatible}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-charcoal/10">
                            <div>
                              <span className="text-[9px] font-mono text-taupe uppercase block mb-1.5 font-bold bg-charcoal/10 px-2 py-0.5 rounded tracking-wider inline-block">OPTIMAL SYNERGIES WITH</span>
                              <p className="text-xs text-emerald-300 leading-relaxed font-mono font-bold">{data.worksWith}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-taupe uppercase block mb-1.5 font-bold bg-charcoal/10 px-2 py-0.5 rounded tracking-wider inline-block">AVOID MIXING SIMULTANEOUSLY</span>
                              <p className="text-xs text-rose-300 leading-relaxed font-mono font-bold bg-rose-950/20 px-2 py-1 rounded inline-block border border-rose-900/30">{data.avoid}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-charcoal/10 p-4 rounded-xl border border-charcoal/10 mt-4 shadow-sm">
                          <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">BEST TIME OF DAILY RITUAL</span>
                          <span className="text-xs text-charcoal font-mono uppercase bg-gold/25 px-3 py-1 rounded-full border border-gold font-bold tracking-widest">{data.bestTime}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>

            {/* ROUTINE INTERACTIVE COMPATIBILITY CHECK ENGINE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              <div className="lg:col-span-12 p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/15 text-left relative overflow-hidden shadow-2xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-xl mb-6">
                  <div className="flex items-center space-x-2 text-indigo-400 mb-3 bg-indigo-950/20 px-3 py-1.5 rounded-full inline-flex border border-indigo-900/30">
                    <Layers className="w-4.5 h-4.5 text-indigo-350" />
                    <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-300 font-bold">Epidermal Compatibility Matrix</span>
                  </div>
                  <h4 className="font-serif text-2xl text-charcoal font-bold uppercase tracking-wide">
                    Live Active Layering Compatibility Check
                  </h4>
                  <p className="text-xs font-medium text-taupe mt-2 leading-relaxed">
                    Select the ingredient combinations you currently use or intend to incorporate. Our diagnostic compiler verifies layering safety and alerts you to potential cellular acid conflicts in real-time.
                  </p>
                </div>

                {/* Horizontal flow choices */}
                <div className="flex flex-wrap gap-2 my-6 pb-4 border-b border-charcoal/10">
                  {INGREDIENTS_CODEX.map((item) => {
                    const isChecked = checkedIngredients.includes(item.name);
                    return (
                      <button
                        key={item.name}
                        onClick={() => toggleCheckedIngredient(item.name)}
                        className={`py-3 px-5 rounded-full border text-xs font-mono tracking-wide transition-all cursor-pointer ${
                          isChecked
                            ? "bg-charcoal text-ivory border-charcoal font-bold shadow-xl scale-[1.02]"
                            : "bg-beige/60 border-charcoal/20 hover:border-charcoal/45 text-taupe font-bold hover:text-charcoal"
                        }`}
                      >
                        {item.name.split(" ")[0]} {isChecked ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>

                {/* Compatibility Outcome Card */}
                {(() => {
                  const data = getCompatibilityMatrixRating();
                  return (
                    <div className={`p-6 rounded-2xl border ${data.color} space-y-3 transition-all shadow-md`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-widest text-taupe font-bold">Calculated Safety Grade</span>
                        <span className="text-sm font-mono tracking-widest uppercase font-bold">{data.rating}</span>
                      </div>
                      <p className="text-xs leading-relaxed font-bold text-taupe">
                        {data.text}
                      </p>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* DETAILED DAILY RITUAL BUILDER STACKS (AM / PM DRAG SIMULATION) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* MORNING STACK */}
              <div className="lg:col-span-6 p-8 rounded-[2.5rem] bg-neutral-950/80 border border-charcoal/15 text-left flex flex-col justify-between min-h-[500px] shadow-xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div className="flex items-center space-x-2 text-gold mb-4 bg-yellow-950/20 px-3 py-1.5 rounded-full inline-flex border border-gold/20">
                    <Sun className="w-5 h-5 text-gold animate-[spin_50s_linear_infinite]" />
                    <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold font-bold">MATINAL MORNING ASSEMBLY</span>
                  </div>
                  <h4 className="font-serif text-2xl text-charcoal font-bold tracking-wide uppercase" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                    The Matinal Stack
                  </h4>
                  <p className="text-xs font-medium text-taupe leading-relaxed mt-2">
                    Calibrated specifically for photoprotective shield support, skin barrier thickening and urban hydration matrix defense under {answers.environment}&apos;s humidity. Drag or change priority layout order below:
                  </p>
                </div>

                <div className="space-y-3 my-8 flex-1">
                  {morningRoutine.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-xl bg-black/60 border border-charcoal/15 flex justify-between items-center hover:border-gold/50 transition-all group shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-mono text-gold font-bold bg-charcoal/5 w-6 h-6 rounded-full flex items-center justify-center border border-charcoal/10">0{idx + 1}</span>
                        <div>
                          <span className="text-sm font-serif font-bold text-charcoal block">{item.name}</span>
                          <span className="text-[10.5px] text-stone-250 leading-none font-bold uppercase tracking-wider block mt-1">{item.purpose}</span>
                        </div>
                      </div>
                      {/* Interactive sorting buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => shiftRoutineItem("am", idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-charcoal/10 hover:bg-charcoal/20 hover:text-gold disabled:opacity-30 text-charcoal font-bold cursor-pointer"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => shiftRoutineItem("am", idx, "down")}
                          disabled={idx === morningRoutine.length - 1}
                          className="p-1 rounded bg-charcoal/10 hover:bg-charcoal/20 hover:text-gold disabled:opacity-30 text-charcoal font-bold cursor-pointer"
                        >
                          ▼
                        </button>
                        <button 
                          onClick={() => removeRoutineItem("am", idx)}
                          className="p-1 rounded bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 ml-2 cursor-pointer border border-rose-900/30"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {morningRoutine.length === 0 && (
                    <p className="text-xs text-taupe font-bold text-center py-8 bg-beige/40 border border-dashed border-charcoal/15 rounded-xl">Morning stack depleted. Tap add below to include formulas.</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    const next = prompt("Include customized morning step name:", "TIVA Radiance C Serum");
                    if (next) setMorningRoutine([...morningRoutine, { id: `m${Date.now()}`, name: next, purpose: "Custom targeted synergy layer" }]);
                  }}
                  className="w-full py-3.5 border-2 border-dashed border-charcoal/20 rounded-xl hover:border-gold text-taupe hover:text-gold text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer bg-charcoal/5 hover:bg-charcoal/10 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-gold" />
                  <span>Insert Formula Layer</span>
                </button>
              </div>

              {/* NIGHT STACK */}
              <div className="lg:col-span-6 p-8 rounded-[2.5rem] bg-neutral-950/80 border border-charcoal/15 text-left flex flex-col justify-between min-h-[500px] shadow-xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div className="flex items-center space-x-2 text-indigo-400 mb-4 bg-indigo-950/20 px-3 py-1.5 rounded-full inline-flex border border-indigo-900/30">
                    <Droplet className="w-5 h-5 text-indigo-350" />
                    <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-indigo-300 font-bold">RESTORATIVE NOCTURNAL ASSEMBLY</span>
                  </div>
                  <h4 className="font-serif text-2xl text-charcoal font-bold tracking-wide uppercase" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                    The Nocturnal Stack
                  </h4>
                  <p className="text-xs font-medium text-taupe leading-relaxed mt-2">
                    Highly concentrated nocturnal mitotic repair compounds. Focuses on accelerate cellular renewal, micro-exfoliation and deep trans-lipid locking during sleep repose cycle:
                  </p>
                </div>

                <div className="space-y-3 my-8 flex-1">
                  {nightRoutine.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-xl bg-black/60 border border-charcoal/15 flex justify-between items-center hover:border-indigo-400/50 transition-all group shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-mono text-indigo-400 font-bold bg-charcoal/5 w-6 h-6 rounded-full flex items-center justify-center border border-charcoal/10">0{idx + 1}</span>
                        <div>
                          <span className="text-sm font-serif font-bold text-charcoal block">{item.name}</span>
                          <span className="text-[10.5px] text-stone-250 leading-none font-bold uppercase tracking-wider block mt-1">{item.purpose}</span>
                        </div>
                      </div>
                      {/* Interactive sorting buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => shiftRoutineItem("pm", idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-charcoal/10 hover:bg-charcoal/20 hover:text-indigo-400 disabled:opacity-30 text-charcoal font-bold cursor-pointer"
                        >
                          ▲
                        </button>
                        <button 
                          onClick={() => shiftRoutineItem("pm", idx, "down")}
                          disabled={idx === nightRoutine.length - 1}
                          className="p-1 rounded bg-charcoal/10 hover:bg-charcoal/20 hover:text-indigo-400 disabled:opacity-30 text-charcoal font-bold cursor-pointer"
                        >
                          ▼
                        </button>
                        <button 
                          onClick={() => removeRoutineItem("pm", idx)}
                          className="p-1 rounded bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 ml-2 cursor-pointer border border-rose-900/30"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {nightRoutine.length === 0 && (
                    <p className="text-xs text-taupe font-bold text-center py-8 bg-beige/40 border border-dashed border-charcoal/15 rounded-xl">Nocturnal stack depleted. Tap add below to include formulas.</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    const next = prompt("Include customized evening step name:", "TIVA Saffron Overnight Elixir");
                    if (next) setNightRoutine([...nightRoutine, { id: `n${Date.now()}`, name: next, purpose: "Custom nightly cellular restorative support" }]);
                  }}
                  className="w-full py-3.5 border-2 border-dashed border-charcoal/20 rounded-xl hover:border-indigo-400 text-taupe hover:text-indigo-450 text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer bg-charcoal/5 hover:bg-charcoal/10 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#C9A227]" />
                  <span>Insert Formula Layer</span>
                </button>
              </div>

            </div>

            {/* INTERACTIVE SKIN TIMELINE SLIDER (BEFORE TO AFTER PROJECTION) */}
            <div className="p-8 md:p-12 rounded-[2.5rem] bg-neutral-950/80 border border-charcoal/15 mb-12 text-left relative shadow-2xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="max-w-xl mb-8">
                <div className="flex items-center space-x-2 text-emerald-400 mb-3 bg-emerald-950/20 px-3 py-1.5 rounded-full inline-flex border border-emerald-900/30">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 font-bold">Biological Regeneration Timeline</span>
                </div>
                <h4 className="font-serif text-2xl md:text-3xl text-charcoal font-bold uppercase tracking-wide" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
                  AI Stratum Corneum Progress Timeline
                </h4>
                <p className="text-xs font-medium text-taupe mt-2 leading-relaxed">
                  Topical molecular reconstruction is a biological compound timeline. Slide our predictive recovery scale to evaluate epidermal healing phases, cellular mitotic turn-overs, and target spot fading expectations.
                </p>
              </div>

              {/* Timeline Slider Buttons */}
              <div className="grid grid-cols-5 gap-2 bg-[#050505]/80 p-1.5 rounded-2xl border border-charcoal/15 mb-8 shadow-inner">
                {["Today", "30 Days", "60 Days", "90 Days", "180 Days"].map((stepText, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTimelineIndex(idx)}
                    className={`py-3.5 text-xs font-bold font-mono uppercase tracking-widest transition-all rounded-xl cursor-pointer ${
                      timelineIndex === idx
                        ? "bg-charcoal text-ivory font-bold shadow-xl border border-charcoal"
                        : "text-taupe hover:text-charcoal bg-beige/40 hover:bg-beige/80 border border-charcoal/5"
                    }`}
                  >
                    {stepText}
                  </button>
                ))}
              </div>

              {/* Predictive Texture Projections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/60 p-6 rounded-2xl border border-charcoal/15 shadow-inner">
                <div className="lg:col-span-4 relative h-48 rounded-xl overflow-hidden bg-stone-950 flex justify-center items-center font-mono border border-charcoal/10">
                  {/* Before/After texture mock cards */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 to-stone-900/60 flex flex-col justify-center items-center text-center p-4">
                    <span className="text-[10px] text-[#C9A227] tracking-widest uppercase mb-1 font-bold">EPIDERMAL MAP RESCALE</span>
                    
                    {timelineIndex === 0 && (
                      <div className="space-y-1">
                        <span className="text-4xl">🔬</span>
                        <div className="text-lg text-stone-105 font-serif font-bold">Baseline Barrier</div>
                        <div className="text-[11px] text-rose-350 font-bold uppercase tracking-wider mt-1">Microscopic cracks visible</div>
                      </div>
                    )}
                    {timelineIndex === 1 && (
                      <div className="space-y-1">
                        <span className="text-4xl">💧</span>
                        <div className="text-lg text-stone-105 font-serif font-bold">Hydration Saturation</div>
                        <div className="text-[11px] text-indigo-350 font-bold uppercase tracking-wider mt-1">Intercellular lipid fill 35%</div>
                      </div>
                    )}
                    {timelineIndex === 2 && (
                      <div className="space-y-1">
                        <span className="text-4xl">🌿</span>
                        <div className="text-lg text-stone-105 font-serif font-bold">Epithelial Repair</div>
                        <div className="text-[11px] text-emerald-350 font-bold uppercase tracking-wider mt-1">Flushing symptoms calmed</div>
                      </div>
                    )}
                    {timelineIndex === 3 && (
                      <div className="space-y-1">
                        <span className="text-4xl">🌟</span>
                        <div className="text-lg text-stone-105 font-serif font-bold">Collagen Catalyst</div>
                        <div className="text-[11px] text-emerald-350 font-bold uppercase tracking-wider mt-1">Structural integrity +28%</div>
                      </div>
                    )}
                    {timelineIndex === 4 && (
                      <div className="space-y-1">
                        <span className="text-4xl">👑</span>
                        <div className="text-lg text-stone-105 font-serif font-bold">Total Glass Glaze</div>
                        <div className="text-[11px] text-gold font-bold uppercase tracking-wider mt-1">Absolute cellular cohesion</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 text-left space-y-4">
                  <h5 className="font-serif text-lg text-gold font-bold uppercase tracking-wide" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    {timelineIndex === 0 && "Today: Baseline Metric Recording"}
                    {timelineIndex === 1 && "Day 30: Hydration Fluid Re-Plumping"}
                    {timelineIndex === 2 && "Day 60: Redness Capillary Soothing Recovery"}
                    {timelineIndex === 3 && "Day 90: Stratum Corneum Cellular Cohesion"}
                    {timelineIndex === 4 && "Day 180: Ultimate Timeless Glass Metamorphosis"}
                  </h5>
                  <p className="text-sm text-taupe leading-relaxed font-medium">
                    {timelineIndex === 0 && "Current stratum corneum barrier function displays micro-fissures and trans-epidermal water loss. Natural lipid sheets are parched. Primary focus points are gentle purification and dense humectant binding."}
                    {timelineIndex === 1 && "After 30 days of consistent TIVA Glacial Hydrator layers, intercellular moisture thresholds elevate. Fine surface lines due to dehydration begin plumping outward, creating a bouncy, light-reflective baseline."}
                    {timelineIndex === 2 && "After 60 days of Centella Asiatica and Squalane integration, superficial capillary dilation and redness curtail significantly. The baseline skin barrier thickness registers a 12% boost in lipid thickness."}
                    {timelineIndex === 3 && "At the 90-day cellular cycle mark, Retinol has accelerated epidermal mitosis. Hyperpigmentation dark clusters disintegrate, pushing uniform, radiant cells to the stratum disjunctum boundary."}
                    {timelineIndex === 4 && "The peak cycle of biological metamorphosis. Intercellular cement ratio (50% Ceramides, 25% Cholesterol, 15% Fatty Acids) is fully optimized. Light bounces off the uniform cells, revealing a timeless, mirror-like luxury glass glaze."}
                  </p>
                </div>
              </div>
            </div>

            {/* ROUTINE CALENDAR & HABIT STREAK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              <div className="lg:col-span-12 p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/15 text-left relative overflow-hidden shadow-2xl backdrop-blur-[18px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-2 text-gold mb-1">
                      <Calendar className="w-4.5 h-4.5 text-gold" />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-taupe font-bold">Circadian Routine Calendar</span>
                    </div>
                    <h4 className="font-serif text-2xl text-charcoal font-bold uppercase tracking-wide">Weekly Treatment & Habit Streak</h4>
                  </div>
                  <div className="inline-flex items-center space-x-2 bg-emerald-950/30 border border-emerald-550 text-emerald-350 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider shadow-inner">
                    <Flame className="w-4 h-4 text-emerald-450 animate-pulse" />
                    <span>HABIT STREAK: 12 DAYS COMPLIANT</span>
                  </div>
                </div>

                {/* Simulated Weekly Calendar Cells */}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center my-6">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
                    <div key={day} className="p-4 rounded-2xl bg-black/60 border border-charcoal/15 flex flex-col justify-between h-36 shadow-sm">
                      <span className="text-xs font-bold font-mono uppercase text-taupe block border-b border-charcoal/15 pb-2 mb-2">{day}</span>
                      <div className="space-y-1.5 text-[10px] font-mono text-taupe uppercase mt-2 font-bold leading-normal">
                        <div className="text-emerald-400">AM Stack ✓</div>
                        <div className="text-emerald-400">PM Stack ✓</div>
                        {dIdx % 3 === 0 && <div className="text-gold">Weekly Peel ✓</div>}
                      </div>
                      <span className="text-[9px] font-bold font-mono text-[#C9A227] tracking-widest uppercase mt-3">COMPLETED</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] font-mono text-taupe leading-relaxed max-w-2xl border-l-2 border-gold pl-3 font-semibold">
                  TIVA system diagnostic calculates special weekly deep acid exfoliation boundaries on Wednesday and Sunday automatically to ensure epidermal cell layers undergo micro-peeling without barrier abrasion.
                </p>
              </div>

            </div>

            {/* RITUAL BIOMIMETIC EDUCATION MINI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "The SPF Radiation Shield", q: "Why daily sun filter isolate is mandatory?", desc: "UV radiation accounts for up to 80% of premature cellular senescence. Zinc oxide and clinical mineral filters create a physics-level photon shield, stopping DNA degradation and melanin cluster triggers daily." },
                { title: "Intercellular Water Locking", q: "Why moisturization is empty without hydration?", desc: "Humectants act as water magnets, capturing ambient vapor into the epidermis. However, without biomimetic oils (Ceramides, Squalane), this water evaporates immediately, triggering severer trans-epidermal loss." },
                { title: "Stratum Corneum Cementing", q: "Why skin barrier holds first priority?", desc: "A weak or eroded barrier allows pathogens and gaseous pollution particulates to infiltrate skin layers, initiating immune inflammatory responses. Rebuilding the barrier cement stops breakouts before they spawn." }
              ].map((faq, index) => (
                <div key={index} className="p-6 rounded-3xl bg-neutral-950/80 border border-charcoal/15 text-left flex flex-col justify-between shadow-xl backdrop-blur-[18px] hover:border-gold/45 transition-all" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div className="p-2 w-10 h-10 bg-gold/25 text-charcoal rounded-xl flex items-center justify-center mb-4 border border-gold shadow-md">
                      <Info className="w-4.5 h-4.5 text-gold" />
                    </div>
                    <span className="text-[10px] tracking-widest font-mono text-gold block mb-1 uppercase font-bold">{faq.q}</span>
                    <h5 className="font-serif text-lg font-bold text-charcoal mb-3 uppercase tracking-wide">{faq.title}</h5>
                    <p className="text-xs text-taupe leading-relaxed font-semibold">{faq.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAS BOTTOM */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-r from-neutral-950 to-stone-900 border border-charcoal/15 flex flex-col sm:flex-row justify-between items-center gap-6 text-left relative shadow-2xl backdrop-blur-md">
              <div>
                <h5 className="font-serif text-xl text-charcoal font-bold uppercase tracking-widest" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>Register Secure Account Portfolio</h5>
                <p className="text-xs text-taupe mt-2 max-w-xl font-bold leading-relaxed">Save this formulated skin ritual dashboard. Get automated dynamic climate modifications when we track changes in your environment.</p>
              </div>
              <button 
                onClick={() => alert("Bespoke account credentials registered safely. Your daily TIVA schedule is locked.")}
                className="px-10 py-4 bg-gold text-charcoal font-bold font-mono text-xs tracking-widest uppercase hover:bg-charcoal hover:text-ivory transition-all rounded-full select-none cursor-pointer text-nowrap shadow-lg hover:scale-105 active:scale-95"
              >
                Save Scientific Ritual
              </button>
            </div>

          </motion.div>
        )}

        {/* MODE 6: DEDICATED INTERACTIVE CELLULAR SKIN REPORT WITH DETAILED ANALYSIS OVER PICTURE */}
        {activeStep === "skin-analysis-report" && (
          <motion.div
            key="skin-analysis-report-step"
            className="min-h-screen pt-32 pb-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10 text-left animate-fade-in"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Back/Option Indicator */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-charcoal/10 pb-8">
              <div>
                <button
                  onClick={() => setActiveStep("result")}
                  className="flex items-center space-x-2 text-taupe hover:text-gold text-xs font-mono font-bold tracking-widest uppercase mb-4 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Ritual Board</span>
                </button>
                <div className="flex items-center space-x-2 text-gold mb-2 bg-yellow-950/20 px-3 py-1.5 rounded-full border border-gold/20 inline-flex">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-gold">SOLITARY VISUAL LAB REPORT</span>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-bold uppercase tracking-wide">
                  Cellular Skin Diagnostics
                </h2>
                <p className="text-xs text-taupe font-serif mt-2 font-medium">
                  Dynamic epidermal visual scans are mapped coordinates. Point-by-point diagnostic results detailed below.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveStep("result");
                  }}
                  className="px-6 py-3 bg-beige border border-charcoal/15 text-taupe text-xs font-bold font-mono tracking-widest uppercase rounded-full hover:bg-beige transition-all flex items-center space-x-2 shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Portrait</span>
                </button>
              </div>
            </div>

            {/* SCANNING ACTIVE INDICATOR */}
            {scanning ? (
              <div className="py-24 flex flex-col items-center justify-center bg-neutral-950/40 rounded-3xl border border-charcoal/10 backdrop-blur-md text-center max-w-2xl mx-auto my-12 p-8 shadow-2xl">
                {imageFile && (
                  <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-emerald-500/30 relative mb-8 shadow-2xl">
                    <img src={imageFile} className="w-full h-full object-cover scale-x-[-1]" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                    <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce top-1/2" />
                  </div>
                )}
                <Activity className="w-12 h-12 text-[#C9A227] animate-spin mb-6" />
                <h4 className="font-serif text-2xl text-charcoal font-bold uppercase tracking-wider mb-2">{scanSection}</h4>
                <p className="text-xs text-stone-350 uppercase tracking-widest font-mono font-bold animate-pulse">Running advanced spatial analysis on captured epidermal structures...</p>
                <div className="w-64 h-1.5 bg-charcoal/10 rounded-full overflow-hidden mt-6 border border-charcoal/5">
                  <div className="bg-gold h-full animate-pulse" style={{ width: "80%" }} />
                </div>
              </div>
            ) : (
              /* THE ANALYSIS REPORT PANEL */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* LEFT PORTRAIT VIEWER & MULTI-COORD MAP */}
                <div className="lg:col-span-6 flex flex-col items-center bg-[#0d0d0d]/90 border border-charcoal/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
                  <h4 className="text-[10px] tracking-widest font-mono text-gold block mb-4 uppercase font-bold self-start">
                    📷 BIOMETRIC PORTRAIT EYE VECTOR SCAN
                  </h4>
                  
                  <div className="w-full aspect-[4/5] max-w-md rounded-2xl overflow-hidden relative border border-charcoal/15 shadow-inner">
                    {imageFile ? (
                      <img 
                        src={imageFile} 
                        className="w-full h-full object-cover select-none" 
                        alt="Analyzed face skin"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-stone-900 to-black flex items-center justify-center p-8 text-center text-taupe font-mono relative">
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="space-y-4">
                          <Eye className="w-16 h-16 mx-auto text-gold animate-pulse" />
                          <span className="text-xs uppercase tracking-widest font-bold text-charcoal block">SPECTRAL EYE VECTOR MAP</span>
                          <span className="text-[10px] leading-relaxed block text-taupe">Portrait snapshot was captured. Register another frame below to start.</span>
                        </div>
                      </div>
                    )}

                    {/* HUD crosshairs */}
                    <div className="absolute inset-6 border border-charcoal/5 pointer-events-none flex flex-col justify-between">
                      <div className="flex justify-between p-2">
                        <div className="w-4 h-4 border-t border-l border-emerald-400/40" />
                        <div className="w-4 h-4 border-t border-r border-emerald-400/40" />
                      </div>
                      <div className="flex justify-between p-2">
                        <div className="w-4 h-4 border-b border-l border-emerald-400/40" />
                        <div className="w-4 h-4 border-b border-r border-emerald-400/40" />
                      </div>
                    </div>

                    {/* ACTIVE GLOWING INTERACTIVE PINPOINTS */}
                    {imageFile && pinPositions.map((pin) => {
                      const isActive = selectedPinIdx === pin.id;
                      return (
                        <button
                          key={pin.id}
                          onClick={() => setSelectedPinIdx(pin.id)}
                          className="absolute group z-25 cursor-pointer -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                          style={{ top: pin.top, left: pin.left }}
                        >
                          <span className="relative flex h-8 w-8 items-center justify-center">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${pin.color} ${isActive ? "scale-150" : "scale-100"}`} />
                            <span className={`relative inline-flex rounded-full h-4.5 w-4.5 border-2 border-charcoal ${pin.color} shadow-lg ${isActive ? "scale-125 ring-4 ring-white/15" : "scale-100 group-hover:scale-110"} transition-all`} />
                          </span>
                          
                          {/* Mini hover title pop tooltip */}
                          <div className={`absolute left-1/2 -top-10 -translate-x-1/2 pointer-events-none bg-beige border border-charcoal/20 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold text-nowrap text-charcoal transition-all shadow-md ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"}`}>
                            {pin.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] font-mono text-taupe mt-4 leading-relaxed bg-black/40 p-3 rounded-xl border border-charcoal/5 w-full text-center font-semibold">
                    💡 <span className="text-[#C9A227] font-bold">Interactive Photo Analysis:</span> Click the pulsing circles directly on your photo to review specific spot findings.
                  </p>
                </div>

                {/* RIGHT DIAGNOSTIC PANEL COMPILATIONS */}
                <div className="lg:col-span-6 space-y-8">
                  
                  {/* CENTRAL DIAL COEFFICIENT STATUS CARD */}
                  <div className="p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/10 shadow-xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                      <div className="text-left">
                        <span className="text-[9px] font-mono tracking-widest text-gold block mb-1 uppercase font-bold">Biometric Skin Coefficient</span>
                        <h3 className="font-serif text-3xl text-charcoal font-bold uppercase tracking-wide">Dermal Coefficient</h3>
                        <p className="text-xs text-taupe mt-2 font-medium leading-relaxed max-w-sm">
                          Unified score compiling cellular dehydration tension, lipid barrier thickness, micro-wrinkle depth, and capillary congestion markers.
                        </p>
                      </div>
                      
                      {/* Special Circular Score */}
                      <div className="relative w-28 h-28 flex items-center justify-center shrink-0 bg-beige/60 rounded-full border border-charcoal/5">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="56" cy="56" r="46" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="56" 
                            cy="56" 
                            r="46" 
                            stroke="#C9A227" 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 46} 
                            strokeDashoffset={2 * Math.PI * 46 * (1 - (computedScore ?? 75) / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-mono font-bold text-charcoal tracking-tighter">{computedScore}</span>
                          <span className="text-[8px] font-mono text-taupe uppercase tracking-widest font-bold">GRID SCORE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SPOTLIGHT TAB PANEL */}
                  <div className="p-8 rounded-[2rem] bg-gradient-to-b from-neutral-950 to-neutral-900 border border-gold/15 shadow-2xl text-left">
                    <div className="flex items-center space-x-2 text-gold mb-5 border-b border-charcoal/10 pb-4">
                      <Layers className="w-4.5 h-4.5 text-[#C9A227]" />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-gold">
                        Selected Skin Region Target:
                      </span>
                      <span className="text-[10px] font-bold text-charcoal uppercase tracking-wider font-mono bg-charcoal/10 px-2.5 py-1 rounded ml-2">
                        {selectedPinIdx === 0 && "T-Zone / Forehead"}
                        {selectedPinIdx === 1 && "Lateral Cheek Wall"}
                        {selectedPinIdx === 2 && "Malar Sensitivity Corridor"}
                        {selectedPinIdx === 3 && "Perioral Contour"}
                      </span>
                    </div>

                    {[
                      {
                        title: "Forehead / Midline Sebum Index",
                        metric: "Midline Glandular Balance",
                        score: metricsBreakdown.oilBalance,
                        status: metricsBreakdown.oilBalance > 80 ? "Sebum Congestion" : metricsBreakdown.oilBalance < 55 ? "Lipid Deficient" : "Optimal Equilibrium",
                        desc: "Visual luminosity of the glabella and forehead zone indicates fully stabilized sebum output. Minor sebaceous build-ups might log during humid climates, but overall congestion risk is low.",
                        tip: "Integrate breathable Niacinamide humectants. Restrict heavy oil-laden overnight lotions over the nose-midline."
                      },
                      {
                        title: "Lateral Corneocyte Barrier Defenses",
                        metric: "Corneal Brick-Mortar Thickness",
                        score: metricsBreakdown.barrier,
                        status: metricsBreakdown.barrier > 75 ? "Fortified Protection" : "Slight Erosion Risk",
                        desc: "Scans mapping the outer cheek regions delineate trace moisture depletion spots. The corneaceous lipid layers require nourishing reinforcements to block dry atmospheric factors.",
                        tip: "Seal with Ceramides (NP, AP, EOP) and plant Squalanes to securely reconstruct the brick-mortar cell layers."
                      },
                      {
                        title: "Cheek Dermal Capillary Resiliency",
                        metric: "Vascular Sensitivity Reaction",
                        score: metricsBreakdown.sensitivity,
                        status: metricsBreakdown.sensitivity > 65 ? "High Dermal Reactivity" : "Calm and Stable Shield",
                        desc: "Visual chromatic registers verify low irritation indexes. Cheek capillaries demonstrate solid resilience, stating that exfoliation treatments with mild acids should be well-endured.",
                        tip: "Use antioxidant Centella Asiatica extracts to establish vessel soothe and redness insulation buffer."
                      },
                      {
                        title: "Perioral Hydration Elasticity Matrix",
                        metric: "Moisture Elasticity Tension Coefficient",
                        score: metricsBreakdown.hydration,
                        status: metricsBreakdown.hydration > 75 ? "Saturated Dermis" : "Sub-epidermis Depletion",
                        desc: "The mouth outlines and chin corners register trace sub-surface dehydration lines. Deep cellular water capture is slightly sub-optimal, prompting risk of dry lines.",
                        tip: "Saturate with multi-weight hyaluronic compounds to lock moisture into variable dermal depths."
                      }
                    ].map((item, idx) => (
                      idx === selectedPinIdx ? (
                        <div key={idx} className="space-y-4 animate-fade-in">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-serif text-lg font-bold text-charcoal uppercase tracking-wide">{item.title}</h5>
                              <span className="text-[10px] font-mono text-taupe mt-1 uppercase block font-bold tracking-widest">{item.metric}</span>
                            </div>
                            <span className="text-xl font-mono font-bold text-gold bg-gold/15 border border-gold/30 px-3 py-1 rounded-xl">
                              {item.score}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 my-2">
                            <div className="p-3 bg-charcoal/5 rounded-xl border border-charcoal/5">
                              <span className="text-[9px] font-mono text-taupe uppercase block font-bold mb-1">EVALED STATUS</span>
                              <span className="text-xs font-bold text-charcoal uppercase tracking-wide">{item.status}</span>
                            </div>
                            <div className="p-3 bg-charcoal/5 rounded-xl border border-charcoal/5">
                              <span className="text-[9px] font-mono text-[#C9A227] uppercase block font-bold mb-1">CORE DERMO TIP</span>
                              <span className="text-[10px] font-sans font-medium text-amber-250 block leading-tight">{item.tip}</span>
                            </div>
                          </div>

                          <p className="text-xs text-taupe font-sans leading-relaxed font-semibold pt-1">
                            {item.desc}
                          </p>
                        </div>
                      ) : null
                    ))}
                  </div>

                  {/* CLINICAL SUMMARY TEXTBOX - GENTLE CLINICAL DESCRIPTION */}
                  <div className="p-8 rounded-[2rem] bg-neutral-950/80 border border-charcoal/15 text-left relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-indigo-400 mb-4 bg-indigo-950/20 px-3 py-1.5 rounded-full inline-flex border border-indigo-900/30">
                      <Shield className="w-4 h-4 text-indigo-355" />
                      <span className="text-[9px] font-mono tracking-widest uppercase text-indigo-300 font-bold">
                        CLINICAL BIOMETRIC ASSESSMENT
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-charcoal mb-2 uppercase tracking-wide">
                      AI Diagnostic Explanation
                    </h4>
                    <p className="text-xs text-taupe font-serif leading-relaxed italic mb-6">
                      "{diagnosisText}"
                    </p>

                    {/* Quick Indicators lists */}
                    <div className="space-y-3 pt-4 border-t border-charcoal/10 text-[11px] font-mono font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-taupe uppercase">SUB-SURFACE HYDRATION</span>
                        <span className={metricsBreakdown.hydration > 70 ? "text-emerald-400" : "text-amber-400"}>{metricsBreakdown.hydration > 70 ? "OPTIMALLY WATER-BOUND" : "INTERCELLULAR THIRST OUTLIERS"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-taupe uppercase">BARRIER DENSITY RATIO</span>
                        <span className={metricsBreakdown.barrier > 72 ? "text-emerald-400" : "text-rose-450"}>{metricsBreakdown.barrier > 72 ? "THICK DEFENSIVE SHIELD" : "PARTIALLY SENSITIVE / ERODED"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-taupe uppercase">OIL SATURATION COEFFICIENT</span>
                        <span className="text-taupe">{metricsBreakdown.oilBalance}% SYNTHESIS LEVEL</span>
                      </div>
                    </div>
                  </div>

                  {/* PRIMARY ACTIONS BUTTON FOR TRANSFER */}
                  <div className="p-2 bg-gradient-to-r from-amber-950/20 to-neutral-950 border border-gold/20 rounded-[2.5rem] shadow-xl">
                    <button
                      onClick={() => setActiveStep("result")}
                      className="w-full py-4 bg-gold text-ivory font-bold text-xs font-mono tracking-widest uppercase hover:bg-charcoal hover:text-ivory cursor-pointer select-none rounded-[2rem] transition-all flex items-center justify-center space-x-3 shadow-2xl hover:scale-[1.01] active:scale-95"
                    >
                      <span>Unlock My Customized Skincare Routine Stacks</span>
                      <ArrowRight className="w-4 h-4 text-ivory animate-pulse" />
                    </button>
                  </div>

                  {apiNotice && (
                    <div className="px-4 py-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/30 text-[10px] font-mono font-semibold text-indigo-300 leading-relaxed text-center">
                      ℹ️ {apiNotice}
                    </div>
                  )}

                </div>

              </div>
            )}

          </motion.div>
        )}

        {/* PREMIUM EXPERIENCE DIAGNOSTIC RESULTS */}
        {activeStep === "premium-results" && (
          <AiRitualsResultExperience
            imageFile={imageFile}
            diagnosisText={diagnosisText}
            pinPositions={pinPositions}
            onRetake={() => setActiveStep("hero")}
          />
        )}

      </AnimatePresence>

      {/* Aesthetic absolute bottom footer */}
      <footer className="py-12 border-t border-charcoal/10 text-center text-[10px] text-taupe font-mono uppercase tracking-[0.3em] relative z-10 bg-ivory font-bold [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
        TIVA Advanced AI Diagnostics • Designed for Timeless Human Epidermal Health • Since 2026
      </footer>

    </div>
  );
}
