import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface WaitlistRitualProps {
  onBack: () => void;
}

export default function WaitlistRitual({ onBack }: WaitlistRitualProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-gold/20 scroll-smooth px-4 py-20">
      {/* Background Ambience Lines/Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[180px]" 
        />
      </div>

      <header className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-center">
        <button 
          onClick={onBack} 
          className="text-[10px] font-mono uppercase tracking-widest text-[#d5d0c5]/50 hover:text-gold transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Return</span>
        </button>
        <span className="font-serif text-xl tracking-[0.25em] text-gold opacity-90">TIVA</span>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98, y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(12px)", scale: 0.95, y: -20 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Story Copy */}
              <div className="text-center mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-6"
                >
                  THE TIVA WAITLIST
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-serif text-4xl md:text-5xl text-[#FAF9F6]/90 font-light mb-8"
                >
                  Intentionally<br />Small Batches.
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-[#9e978e] font-light leading-relaxed text-sm md:text-base max-w-md mx-auto mb-6"
                >
                  We are an independent Indian skincare house. Because we refuse to compromise on the purity and potency of our formulations, we craft our products in extremely limited micro-batches. They sell out quickly, but the wait is always worth it.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-[#9e978e] font-light text-sm max-w-md mx-auto"
                >
                  Enter your details below to be granted priority access before our next public release.
                </motion.p>
              </div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="w-full bg-white/5 backdrop-blur-md border border-gold/10 p-8 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 text-sm peer border border-beige/40 bg-white/5 rounded-lg text-white placeholder:text-taupe/60 focus:border-gold focus:ring-1 focus:ring-gold/50 focus:bg-white/10 focus:outline-none transition-all duration-300 ease-in-out placeholder-transparent"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="name" 
                      className="absolute left-4 -top-2.5 text-[10px] bg-[#121212] px-1 text-[#9e978e] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-gold peer-focus:bg-[#121212] pointer-events-none"
                    >
                      Full Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 text-sm peer border border-beige/40 bg-white/5 rounded-lg text-white placeholder:text-taupe/60 focus:border-gold focus:ring-1 focus:ring-gold/50 focus:bg-white/10 focus:outline-none transition-all duration-300 ease-in-out placeholder-transparent"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-4 -top-2.5 text-[10px] bg-[#121212] px-1 text-[#9e978e] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-gold peer-focus:bg-[#121212] pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 text-sm peer border border-beige/40 bg-white/5 rounded-lg text-white placeholder:text-taupe/60 focus:border-gold focus:ring-1 focus:ring-gold/50 focus:bg-white/10 focus:outline-none transition-all duration-300 ease-in-out placeholder-transparent"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="phone" 
                      className="absolute left-4 -top-2.5 text-[10px] bg-[#121212] px-1 text-[#9e978e] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-gold peer-focus:bg-[#121212] pointer-events-none"
                    >
                      Phone Number (Optional)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 h-14 bg-[#FAF9F6] text-[#2C2B29] rounded-xl text-xs uppercase font-mono tracking-[0.2em] font-medium hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center justify-center disabled:opacity-90 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loader"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Loader2 className="w-5 h-5 animate-spin text-[#c29f65]" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          Request Priority Access
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98, y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center text-center mt-20 relative"
            >
              {/* Very slow, ambient gold glow behind text */}
              <div className="absolute inset-0 bg-gold/10 blur-[100px] -z-10 rounded-full w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-20 h-20 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(194,159,101,0.2)]"
              >
                <Sparkles className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-3xl md:text-5xl text-[#FAF9F6]/90 font-light mb-6"
              >
                Your Place is Secured.
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#9e978e] leading-relaxed max-w-md mx-auto mb-12 text-sm md:text-base font-light"
              >
                Your name has been sealed in our private ledger. We have just dispatched a priority invitation to your inbox. Please check your phone to confirm your details and prepare for the ritual.
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={onBack}
                className="flex items-center space-x-2 px-8 py-3.5 border border-[#FAF9F6]/20 bg-transparent text-[#FAF9F6]/70 hover:text-[#FAF9F6] hover:bg-white/5 hover:border-white/40 transition-all uppercase font-mono text-[10px] tracking-widest rounded-full group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Homepage</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
