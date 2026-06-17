import { useState } from "react";
import { Sparkles, Brain, ArrowRight, RotateCcw, AlertCircle, RefreshCw, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function RitualConsultant() {
  const [step, setStep] = useState<number>(1);
  const [skinType, setSkinType] = useState<string>("");
  const [concern, setConcern] = useState<string>("");
  const [climate, setClimate] = useState<string>("");
  const [additions, setAdditions] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const skinTypes = [
    { id: "dry", label: "Dry & Dehydrated", desc: "Easily flaking, tightness, lacks natural lipids" },
    { id: "oily", label: "Oily & Congested", desc: "Excessive sebum production, shiny, visible pore outline" },
    { id: "sensitive", label: "Sensitive & Compromised", desc: "Prone to flush flares, heat stinging, easily reactive" },
    { id: "combination", label: "Mixed / Combination", desc: "Oily T-zone, dry parched cheeks" }
  ];

  const concerns = [
    { id: "luminosity", label: "Lackluster / Skin Dullness", desc: "Seeking uniform tone, inner radiant glaze" },
    { id: "redness", label: "Redness & Warm Irritation", desc: "Seeking botanical calm, deep capillary cool" },
    { id: "barrier", label: "Weakened Barrier", desc: "Seeking rapid cellular cement, lipid healing" },
    { id: "pores", label: "Micro-Texture & Pores", desc: "Seeking enzymatic refining, physical bounce" }
  ];

  const climates = [
    { id: "humid", label: "Hot & Highly Humid", desc: "Promotes excess sebum, environmental stickiness" },
    { id: "dry_cold", label: "Extreme Dry & Windy", desc: "Sucks cellular moisture outward, cold winter scales" },
    { id: "urban", label: "High Pollution & Urban", desc: "Diesel particulates, oxidative stress triggers" },
    { id: "moderate", label: "Moderate & Temperate", desc: "Balanced moisture, stable temperatures" }
  ];

  const loadingPhrases = [
    "Analyzing lipid profile parameters...",
    "Aligning cellular active coefficients...",
    "Selecting hand-harvested botanical synergisms...",
    "Diffusing Saffron & Centella ratios...",
    "Steeping scientific diagnostic notes...",
    "Prepping your bespoke TIVA formulation..."
  ];

  const cycleLoadingPhrases = (index = 0) => {
    if (!loading) return;
    setLoadingText(loadingPhrases[index % loadingPhrases.length]);
    setTimeout(() => {
      cycleLoadingPhrases(index + 1);
    }, 2800);
  };

  const handleConsultSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    setResult("");
    cycleLoadingPhrases(0);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          skinType,
          concern,
          climate,
          additions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_MISSING") {
          throw new Error("MISSING_KEY");
        }
        throw new Error(data.message || "Failed to compile the skincare analysis.");
      }

      setResult(data.text);
      setStep(4); // Move to result card

    } catch (err: any) {
      console.error(err);
      if (err.message === "MISSING_KEY") {
        setErrorMessage("API_KEY_NOT_CONFIGURED");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred during synthesis.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetConsult = () => {
    setStep(1);
    setSkinType("");
    setConcern("");
    setClimate("");
    setAdditions("");
    setResult("");
    setErrorMessage("");
  };

  return (
    <section className="bg-white py-24 md:py-32 border-b border-beige/40 scroll-mt-20" id="consultant-section">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-gold block mb-3">
            Molecular diagnostics
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal font-light leading-snug">
            AI Skin Consultation
          </h2>
          <div className="w-16 h-[1px] bg-gold my-5" />
          <p className="text-sm md:text-base text-taupe leading-relaxed font-light">
            Analyze your skin biometrics through TIVA&apos;s intelligent diagnostic engine. Powered by Gemini, the system maps your biological environment to calculate exact ingredient synergisms.
          </p>
        </div>

        {/* Main Consultation Card Frame */}
        <div className="bg-ivory border border-beige/40 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xs min-h-[480px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

          {/* Stepper Header Progress */}
          {step <= 3 && !loading && !errorMessage && (
            <div className="flex items-center justify-between border-b border-beige/30 pb-6 mb-8 text-left">
              <div>
                <span className="text-[8px] font-mono tracking-widest text-gold uppercase block">
                  STEP {step} OF 3
                </span>
                <span className="text-xs font-serif text-charcoal tracking-wide mt-1 block font-medium">
                  {step === 1 && "Differentiate your Biological Bio-Type"}
                  {step === 2 && "Configure Target Epidermal Concern"}
                  {step === 3 && "Environment & Sourcing Variables"}
                </span>
              </div>
              
              {/* Radial dots progress */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? "w-8 bg-gold" : "w-1.5 bg-beige/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error and loading displays */}
          <AnimatePresence mode="wait">
            {/* 1. Loading active state */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-6 flex-1"
                key="loader-element"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t border-gold animate-spin" />
                  <Sparkles className="w-5 h-5 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-gold uppercase tracking-[0.25em]">
                    GENERATING BESPOKE RITUAL SHEET
                  </span>
                  <p className="text-sm font-serif italic text-charcoal transition-all h-6">
                    {loadingText}
                  </p>
                </div>
              </motion.div>
            )}

            {/* 2. Error missing key dialog */}
            {errorMessage === "API_KEY_NOT_CONFIGURED" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center p-6 space-y-6 flex-1 text-left"
                key="error-key-element"
              >
                <div className="p-4 rounded-full bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-8 h-8 text-amber-600 stroke-[1.5]" />
                </div>
                <div className="max-w-md space-y-3">
                  <h3 className="font-serif text-xl font-medium text-charcoal">Gemini Secure API Configuration Needed</h3>
                  <p className="text-xs text-taupe leading-relaxed">
                    Personalized AI formulations require a Gemini API Key to communicate with Google&apos;s models. To verify this yourself:
                  </p>
                  <ol className="text-left text-[11px] text-taupe list-decimal list-inside space-y-2.5 bg-white/50 p-4 rounded-xl border border-beige/40">
                    <li>Locate <strong>Settings</strong> menu in the upper-right corner of AI Studio.</li>
                    <li>Click <strong>Secrets</strong> panel item.</li>
                    <li>Create/Provide a secret variable called <strong>{`GEMINI_API_KEY`}</strong> with your Google Gemini credential.</li>
                    <li>The key is safely queried server-side in <code>server.ts</code> and is never exposed to the client page.</li>
                  </ol>
                </div>
                
                <button
                  onClick={resetConsult}
                  className="px-6 py-2.5 bg-charcoal text-white hover:bg-gold transition-colors text-[10px] uppercase font-mono tracking-widest cursor-pointer"
                  id="reset-consult-error"
                >
                  Return to Consultation
                </button>
              </motion.div>
            )}

            {/* 3. General other error state */}
            {errorMessage && errorMessage !== "API_KEY_NOT_CONFIGURED" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-12 space-y-6 flex-1"
                key="error-generic-element"
              >
                <div className="p-3 rounded-full bg-red-50 border border-red-200">
                  <AlertCircle className="w-6 h-6 text-red-600 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] font-mono text-red-600 tracking-wider">SYNTHESIS TIMEOUT</span>
                  <h3 className="font-serif text-xl font-light text-charcoal">Synthesis Interrupted</h3>
                  <p className="text-xs text-taupe max-w-sm">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={resetConsult}
                  className="px-5 py-2 rounded-full border border-charcoal/30 hover:bg-charcoal hover:text-white transition-colors text-[10px] tracking-wider uppercase font-mono cursor-pointer"
                  id="reset-general-error"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Step 1: Skin Type */}
            {!loading && !errorMessage && step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 flex-1 text-left"
                key="step-1-element"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skinTypes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSkinType(item.id)}
                      className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                        skinType === item.id
                          ? "bg-white border-gold shadow-sm"
                          : "bg-white/40 border-beige/40 hover:bg-white/80"
                      }`}
                      id={`skin-${item.id}`}
                    >
                      <span className="font-serif text-[17px] font-medium text-charcoal block mb-1">
                        {item.label}
                      </span>
                      <p className="text-xs text-taupe leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-beige/25">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!skinType}
                    className={`px-8 py-4 uppercase text-[10px] tracking-widest font-mono flex items-center space-x-2 transition-all ${
                      skinType
                        ? "bg-charcoal text-white hover:bg-gold cursor-pointer"
                        : "bg-beige/40 text-taupe/40 cursor-not-allowed"
                    }`}
                    id="step1-next"
                  >
                    <span>Proceed Concern</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goal Concerns */}
            {!loading && !errorMessage && step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 flex-1 text-left"
                key="step-2-element"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {concerns.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setConcern(item.id)}
                      className={`p-6 rounded-2xl border text-left cursor-pointer transition-all ${
                        concern === item.id
                          ? "bg-white border-gold shadow-sm"
                          : "bg-white/40 border-beige/40 hover:bg-white/80"
                      }`}
                      id={`concern-${item.id}`}
                    >
                      <span className="font-serif text-[17px] font-medium text-charcoal block mb-1">
                        {item.label}
                      </span>
                      <p className="text-xs text-taupe leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-beige/25">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 uppercase text-[10px] tracking-widest font-mono text-taupe hover:text-charcoal cursor-pointer"
                    id="step2-back"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!concern}
                    className={`px-8 py-4 uppercase text-[10px] tracking-widest font-mono flex items-center space-x-2 transition-all ${
                      concern
                        ? "bg-charcoal text-white hover:bg-gold cursor-pointer"
                        : "bg-beige/40 text-taupe/40 cursor-not-allowed"
                    }`}
                    id="step2-next"
                  >
                    <span>Proceed Variable</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Atmosphere and Notes */}
            {!loading && !errorMessage && step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 flex-1 text-left"
                key="step-3-element"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Climate Choice */}
                  <div className="space-y-3">
                    <span className="block text-[8px] font-mono tracking-widest text-gold uppercase">
                      Atmospheric Climate
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {climates.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setClimate(item.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            climate === item.id
                              ? "bg-white border-gold shadow-xs"
                              : "bg-white/40 border-beige/30 hover:bg-white"
                          }`}
                          id={`climate-${item.id}`}
                        >
                          <span className="font-serif text-sm font-medium text-charcoal block">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-taupe block mt-0.5 font-light">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Textarea additions */}
                  <div className="space-y-3">
                    <label className="block text-[8px] font-mono tracking-widest text-gold uppercase">
                      Unique Skin Preferences (Optional)
                    </label>
                    <textarea
                      value={additions}
                      onChange={(e) => setAdditions(e.target.value)}
                      placeholder="e.g. Sensitive to citrus oils, breastfeeding, vegan active preference, high hyperpigmentation history..."
                      className="w-full h-44 p-4 rounded-xl border border-beige/40 bg-white/40 focus:bg-white focus:outline-none text-xs text-charcoal placeholder-taupe/60 leading-relaxed font-sans resize-none focus:ring-1 focus:ring-gold"
                      id="consultant-additions"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-beige/25">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-4 uppercase text-[10px] tracking-widest font-mono text-taupe hover:text-charcoal cursor-pointer"
                    id="step3-back"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConsultSubmit}
                    disabled={!climate}
                    className={`px-8 py-4 uppercase text-[10px] tracking-widest font-mono flex items-center space-x-2 transition-all ${
                      climate
                        ? "bg-charcoal text-white hover:bg-gold cursor-pointer"
                        : "bg-beige/40 text-taupe/40 cursor-not-allowed"
                    }`}
                    id="step3-submit"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                    <span>Generate Bespoke Ritual</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Display Recipe Result */}
            {!loading && !errorMessage && step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 text-left"
                key="step-4-element"
              >
                {/* Scrollable prescription parchment text */}
                <div
                  className="bg-ivory/80 border border-beige/30 p-8 md:p-10 rounded-2xl overflow-y-auto max-h-[500px] shadow-inner relative leading-loose"
                  style={{
                    boxShadow: "inset 0 20px 40px -15px rgba(139, 120, 103, 0.05)"
                  }}
                  id="ritual-consultant-result"
                >
                  <div className="absolute top-4 right-4 font-mono text-[8px] text-taupe/40 tracking-widest">
                    TIVA LABS RECP. #{Math.floor(Math.random() * 89999 + 10000)}
                  </div>
                  
                  <div className="prose prose-stone prose-sm max-w-none text-xs md:text-sm text-charcoal font-sans space-y-4 prose-headings:font-serif prose-headings:text-charcoal prose-headings:tracking-wider prose-headings:font-light">
                    {/* Rendered line by line to keep formatting perfectly clear */}
                    {result.split("\n").map((line, idx) => {
                      if (line.startsWith("###")) {
                        return <h4 key={idx} className="font-serif text-lg text-gold font-medium mt-6 mb-2 tracking-wide border-b border-beige/20 pb-1.5">{line.replace("###", "").trim()}</h4>;
                      }
                      if (line.startsWith("##")) {
                        return <h3 key={idx} className="font-serif text-xl text-charcoal/90 font-medium mt-8 mb-4 border-l-2 border-gold pl-3">{line.replace("##", "").trim()}</h3>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <p key={idx} className="pl-4 font-normal text-charcoal/90 leading-relaxed my-2">{line}</p>;
                      }
                      if (line.trim() === "") {
                        return <div key={idx} className="h-2" />;
                      }
                      return <p key={idx} className="text-taupe leading-relaxed font-light my-1">{line}</p>;
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-beige/25 gap-4">
                  <div className="flex items-center space-x-2 text-[10px] text-taupe uppercase tracking-widest font-mono">
                    <Check className="w-4.5 h-4.5 text-teal-600" />
                    <span>Diagnostics Complete & Verified</span>
                  </div>

                  <button
                    onClick={resetConsult}
                    className="w-full sm:w-auto px-6 py-3.5 bg-charcoal text-white hover:bg-gold transition-colors text-[10px] uppercase font-mono tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
                    id="new-diagnostic-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run New Consultation</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
