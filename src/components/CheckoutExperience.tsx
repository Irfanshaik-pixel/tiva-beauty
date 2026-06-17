import { useState, useEffect } from "react";
import { 
  ArrowLeft, Lock, Check, CheckCircle2, ChevronRight, HelpCircle, 
  CreditCard, Smartphone, Wallet, Building2, MapPin, Gift, TruckIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type CartItem } from "../types";
import LazyImage from "./ui/LazyImage";

interface CheckoutExperienceProps {
  cart: CartItem[];
  onBack: () => void;
  onClearCart: () => void;
}

type CheckoutStep = "SHIPPING" | "DELIVERY" | "PAYMENT" | "REVIEW" | "CONFIRMATION";

export default function CheckoutExperience({ cart, onBack, onClearCart }: CheckoutExperienceProps) {
  const [step, setStep] = useState<CheckoutStep>("SHIPPING");
  
  // Form State
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    apartment: "",
    street: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Summary Math
  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const discount = 0;
  const shippingCost = deliveryMethod === "express" ? 250 : deliveryMethod === "priority" ? 500 : 0;
  const total = subtotal - discount + shippingCost;

  // Validation
  const isShippingValid = shippingDetails.firstName && shippingDetails.lastName && shippingDetails.phone.length >= 10 && shippingDetails.email.includes("@") && shippingDetails.pincode.length === 6 && shippingDetails.street;

  // Render Step Content
  const renderStepContent = () => {
    switch (step) {
      case "SHIPPING":
        return <ShippingForm details={shippingDetails} setDetails={setShippingDetails} onNext={() => setStep("DELIVERY")} isValid={!!isShippingValid} />;
      case "DELIVERY":
        return <DeliveryOptions selected={deliveryMethod} setSelected={setDeliveryMethod} onNext={() => setStep("PAYMENT")} onBack={() => setStep("SHIPPING")} />;
      case "PAYMENT":
        return <PaymentMethods selected={paymentMethod} setSelected={setPaymentMethod} onNext={() => setStep("REVIEW")} onBack={() => setStep("DELIVERY")} />;
      case "REVIEW":
        return <OrderReview cart={cart} shipping={shippingDetails} delivery={deliveryMethod} payment={paymentMethod} total={total} subtotal={subtotal} shippingCost={shippingCost} onNext={() => { setStep("CONFIRMATION"); setTimeout(onClearCart, 1000); }} onBack={() => setStep("PAYMENT")} />;
      case "CONFIRMATION":
        return <ConfirmationScreen />;
      default:
        return null;
    }
  };

  if (step === "CONFIRMATION") {
    return <ConfirmationScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans selection:bg-gold/20 scroll-smooth pb-24 relative overflow-x-hidden">
      {/* Background Ambience Lines/Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed">
        <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] bg-gold/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.015),rgba(0,255,0,0.01),rgba(0,0,255,0.015))] bg-[size:100%_4px,6px_100%]" />
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-[#070708]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
          <button onClick={onBack} className="text-sm font-medium text-stone-400 hover:text-gold transition-colors flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest">Return to Cart</span>
          </button>
          
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="font-serif text-2xl tracking-[0.25em] text-gold opacity-90 transition-all hover:opacity-100">TIVA</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-stone-300">
            <Lock className="w-3.5 h-3.5 text-gold/70" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Progress Bar */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 -z-10" />
            
            {["SHIPPING", "DELIVERY", "PAYMENT", "REVIEW"].map((s, i) => {
              const steps = ["SHIPPING", "DELIVERY", "PAYMENT", "REVIEW"];
              const currentIndex = steps.indexOf(step as any);
              const isCompleted = i < currentIndex;
              const isActive = i === currentIndex;
              
              return (
                <div key={s} className="flex flex-col items-center gap-3 bg-[#070708] px-4">
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-500
                    ${isActive ? 'text-white' : isCompleted ? 'text-gold' : 'text-white/30'}`}>
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto mb-24">
          {/* Main Flow Content */}
          <div className="flex-[0_0_60%] min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Summary */}
          <div className="flex-[0_0_40%] shrink-0">
            <div className="sticky top-32">
              <div className="bg-[#121212]/55 backdrop-blur-xl rounded-[28px] p-8 border border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <h3 className="font-serif text-2xl mb-8 font-light text-white/90">Order Summary</h3>
                
                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-5 group">
                      <div className="w-20 h-24 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                        <LazyImage src={item.product.image} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute top-0 right-0 bg-[#070708]/90 backdrop-blur-md text-white w-6 h-6 flex items-center justify-center text-[10px] rounded-bl-xl font-mono border-b border-l border-white/10">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 py-1 flex flex-col justify-between">
                        <div>
                          <p className="font-medium text-sm leading-relaxed text-white/90">{item.product.name}</p>
                          <p className="text-xs text-white/40 mt-1 font-light">{item.product.category}</p>
                        </div>
                        <p className="font-mono text-xs text-gold/80">₹{(item.product.salePrice || item.product.price) * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <div className="py-6 border-y border-white/10 mb-6">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Gift card or discount code" 
                      className="w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all focus:bg-white/10"
                    />
                    <button className="bg-transparent border border-gold/20 text-white px-6 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-gold/10 hover:border-gold/50 transition-colors block shrink-0">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-light">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className="font-mono">{shippingCost === 0 ? "Free" : `₹${shippingCost}.00`}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Estimated Tax</span>
                    <span className="text-xs">Calculated at next step</span>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="font-serif text-xl text-white/90">Total</span>
                    <div className="text-right flex items-baseline">
                      <span className="text-[10px] text-white/40 mr-2 uppercase tracking-widest">INR</span>
                      <span className="font-serif text-3xl font-light text-white">₹{total}.00</span>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-xs text-white/50 group">
                  <Lock className="w-4 h-4 shrink-0 text-gold/40 group-hover:text-gold transition-colors" />
                  <span className="font-light">Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 group">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-gold/40 group-hover:text-gold transition-colors" />
                  <span className="font-light">Authentic TIVA Formulations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="max-w-6xl mx-auto pt-24 border-t border-white/5">
          <h2 className="font-serif text-3xl mb-10 flex items-center justify-between font-light">
            <span className="text-white/90">Complete Your Ritual</span>
            <span className="text-gold/60 text-xs font-mono uppercase tracking-[0.2em] hidden sm:block">Recommended Additions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white/5 aspect-[4/5] rounded-2xl overflow-hidden relative mb-5 border border-white/5">
                  <LazyImage src={`https://images.unsplash.com/photo-1615397323215-626a575b223d?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                </div>
                <h4 className="text-sm font-medium mb-1 truncate text-white/90">Barrier Recovery Serum</h4>
                <p className="font-mono text-xs text-gold/70 mb-4">₹1250.00</p>
                <button className="w-full py-3 bg-transparent border border-white/10 hover:border-gold hover:bg-gold/5 text-white rounded-xl text-[10px] uppercase tracking-widest font-mono transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------ SUB COMPONENTS ------

function ShippingForm({ details, setDetails, onNext, isValid }: any) {
  const handleChange = (e: any) => {
    setDetails((p: any) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#121212]/55 backdrop-blur-xl p-8 sm:p-12 rounded-[28px] border border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group/form">
      <h2 className="font-serif text-3xl md:text-4xl mb-10 font-light text-white/90">Contact Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={details.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={details.lastName} onChange={handleChange} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Email Address" type="email" name="email" value={details.email} onChange={handleChange} />
          <Input label="Phone Number" type="tel" name="phone" value={details.phone} onChange={handleChange} />
        </div>

        <h2 className="font-serif text-3xl md:text-4xl pt-10 border-t border-white/10 mb-10 mt-12 font-light text-white/90">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-mono">Country / Region</label>
            <select name="country" value={details.country} onChange={handleChange} className="w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-4 text-sm outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 appearance-none transition-all text-white/90">
              <option value="India" className="bg-[#121212] text-white">India</option>
              <option value="United States" className="bg-[#121212] text-white">United States</option>
              <option value="United Kingdom" className="bg-[#121212] text-white">United Kingdom</option>
              <option value="France" className="bg-[#121212] text-white">France</option>
            </select>
            <ChevronRight className="w-4 h-4 absolute right-4 bottom-4 text-white/30 rotate-90 pointer-events-none" />
          </div>
          <Input label="PIN Code / Postal Code" name="pincode" value={details.pincode} onChange={handleChange} maxLength={6} />
        </div>

        <Input label="Flat, Housing no., Apartment" name="apartment" value={details.apartment} onChange={handleChange} />
        <Input label="Street Address" name="street" value={details.street} onChange={handleChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="City" name="city" value={details.city} onChange={handleChange} />
          <Input label="State" name="state" value={details.state} onChange={handleChange} />
        </div>
      </div>

      <div className="mt-14 flex justify-end">
        <button 
          onClick={onNext}
          disabled={!isValid}
          className="bg-ivory text-charcoal px-10 py-5 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold disabled:opacity-50 disabled:hover:bg-ivory transition-all flex items-center gap-3 overflow-hidden relative group/btn shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <span className="relative z-10">Continue to Delivery</span>
          <ArrowRightIcon className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="w-full relative group">
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-mono group-focus-within:text-gold transition-colors">{label}</label>
      <input 
        {...props}
        className="w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-transparent focus:bg-white/10 shadow-inner"
        placeholder={label}
      />
    </div>
  );
}

function DeliveryOptions({ selected, setSelected, onNext, onBack }: any) {
  const options = [
    { id: "standard", title: "Standard Delivery", desc: "3 - 5 Business Days", price: "Free", icon: TruckIcon },
    { id: "express", title: "Express Delivery", desc: "1 - 2 Business Days", price: "₹250.00", icon: TruckIcon },
    { id: "priority", title: "Priority Delivery", desc: "Same Day (Eligible Cities)", price: "₹500.00", icon: Gift },
  ];

  return (
    <div className="bg-[#121212]/55 backdrop-blur-xl p-8 sm:p-12 rounded-[28px] border border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
      <h2 className="font-serif text-3xl md:text-4xl mb-10 font-light text-white/90">Select Delivery Method</h2>
      
      <div className="space-y-5">
        {options.map((opt) => (
          <label 
            key={opt.id}
            className={`flex items-start gap-5 p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${selected === opt.id ? 'border-gold/50 bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.05)]' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === opt.id ? 'border-gold' : 'border-white/30'}`}>
              {selected === opt.id && <motion.div layoutId="delivery-dot" className="w-2 h-2 bg-gold rounded-full" />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white/90">{opt.title}</span>
                <span className="font-mono text-sm text-gold/80">{opt.price}</span>
              </div>
              <p className="text-sm font-light text-white/50">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-14 flex justify-between items-center border-t border-white/10 pt-8">
        <button onClick={onBack} className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-gold flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-ivory text-charcoal px-10 py-5 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

function PaymentMethods({ selected, setSelected, onNext, onBack }: any) {
  const methods = [
    { id: "upi", title: "UPI (Google Pay, PhonePe, Paytm)", icon: Smartphone },
    { id: "card", title: "Credit / Debit Card", icon: CreditCard },
    { id: "netbanking", title: "Net Banking", icon: Building2 },
    { id: "wallet", title: "Wallets", icon: Wallet },
  ];

  return (
    <div className="bg-[#121212]/55 backdrop-blur-xl p-8 sm:p-12 rounded-[28px] border border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
      <h2 className="font-serif text-3xl md:text-4xl mb-10 font-light text-white/90">Payment Method</h2>
      
      <div className="space-y-5">
        {methods.map((method) => (
          <div key={method.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${selected === method.id ? 'border-gold/50 bg-gold/5' : 'border-white/10 bg-white/5'}`}>
            <label 
              className="flex items-center gap-5 p-6 cursor-pointer hover:bg-white/5"
              onClick={() => setSelected(method.id)}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selected === method.id ? 'border-gold' : 'border-white/30'}`}>
                {selected === method.id && <motion.div layoutId="payment-dot" className="w-2 h-2 bg-gold rounded-full" />}
              </div>
              <method.icon className={`w-6 h-6 ${selected === method.id ? 'text-gold' : 'text-white/40'}`} strokeWidth={1.5} />
              <span className="font-medium text-white/90 flex-1">{method.title}</span>
            </label>
            
            {/* Expanded Content */}
            <AnimatePresence>
              {selected === method.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/20 border-t border-white/5"
                >
                  <div className="p-6 sm:p-8">
                    {method.id === "upi" ? (
                      <div className="space-y-4 text-center py-6">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl mx-auto border border-white/10 flex items-center justify-center">
                          <Smartphone className="w-8 h-8 text-gold/60" />
                        </div>
                        <p className="text-sm text-white/50 font-light max-w-xs mx-auto">You will be redirected to your UPI app or payment gateway securely.</p>
                      </div>
                    ) : method.id === "card" ? (
                      <div className="space-y-6">
                        <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                        <div className="grid grid-cols-2 gap-6">
                          <Input label="Expiry (MM/YY)" placeholder="MM/YY" />
                          <Input label="CVV" placeholder="123" />
                        </div>
                        <Input label="Cardholder Name" placeholder="Name on card" />
                      </div>
                    ) : (
                      <div className="py-10 text-center text-white/40 text-sm font-light">
                        Additional options will be loaded dynamically via premium gateway.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-14 flex justify-between items-center border-t border-white/10 pt-8">
        <button onClick={onBack} className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-gold flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-ivory text-charcoal px-10 py-5 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}

function OrderReview({ cart, shipping, delivery, payment, total, subtotal, shippingCost, onNext, onBack }: any) {
  return (
    <div className="bg-[#121212]/55 backdrop-blur-xl p-8 sm:p-12 rounded-[28px] border border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
      <h2 className="font-serif text-3xl md:text-4xl mb-10 font-light text-white/90">Review Your Ritual</h2>
      
      <div className="space-y-8">
        
        {/* Contact info grid */}
        <div className="grid sm:grid-cols-2 gap-8 bg-white/5 border border-white/5 p-8 rounded-[20px]">
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-gold/60 mb-4">Shipping to</h4>
            <p className="text-sm font-medium text-white/90">{shipping.firstName} {shipping.lastName}</p>
            <p className="text-sm text-white/60 mt-2 font-light leading-relaxed">{shipping.apartment ? `${shipping.apartment}, ` : ''}{shipping.street}</p>
            <p className="text-sm text-white/60 font-light leading-relaxed">{shipping.city}, {shipping.state} {shipping.pincode}</p>
            <p className="text-sm text-white/60 font-light leading-relaxed">{shipping.country}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-gold/60 mb-4">Method</h4>
            <p className="text-sm font-medium text-white/90">{delivery === 'standard' ? 'Standard Delivery' : delivery === 'express' ? 'Express Delivery' : 'Priority Delivery'}</p>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-gold/60 mb-4 mt-8">Payment</h4>
            <p className="text-sm font-medium text-white/90 uppercase">{payment}</p>
          </div>
        </div>

      </div>

      <div className="mt-14 flex justify-between items-center border-t border-white/10 pt-8">
        <button onClick={onBack} className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-gold flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        <button 
          onClick={onNext}
          className="bg-ivory text-charcoal px-10 py-5 rounded-xl font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold transition-all flex items-center gap-3 overflow-hidden group/btn shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] relative"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 opacity-60" />
            Pay ₹{total}
          </span>
          <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </div>
  );
}

function ConfirmationScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#070708] text-white flex items-center justify-center relative overflow-hidden"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.15)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.015),rgba(0,255,0,0.01),rgba(0,0,255,0.015))] bg-[size:100%_4px,6px_100%]" />
      
      <div className="max-w-3xl text-center px-6 relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-28 h-28 rounded-full bg-gold/10 border border-gold/30 mx-auto flex items-center justify-center mb-10 relative backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.6 }}
          >
            <Check className="w-12 h-12 text-gold" />
          </motion.div>
          <div className="absolute inset-0 rounded-full border border-gold/50 animate-ping opacity-20 duration-[3000ms]" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl mb-6 font-light uppercase tracking-wide text-white/90"
        >
          Your Ritual<br/>Has Begun
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 font-light mb-14 max-w-lg mx-auto text-lg leading-relaxed"
        >
          Every order is thoughtfully prepared to deliver the TIVA experience.
        </motion.p>
        
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.6 }}
           className="p-10 border border-gold/10 rounded-[28px] bg-white/5 backdrop-blur-xl max-w-sm mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-gold/70 mb-4">Order Number</p>
          <p className="font-mono text-2xl tracking-widest text-gold/90">#TVA-{Math.floor(Math.random() * 89999 + 10000)}</p>
        </motion.div>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button 
             onClick={() => window.location.reload()}
             className="w-full md:w-auto px-10 py-5 bg-ivory text-charcoal border border-transparent rounded-full font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Track Order
          </button>
          <button 
             onClick={() => window.location.reload()}
             className="w-full md:w-auto px-10 py-5 border border-white/20 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-colors text-white/50 hover:text-white hover:border-white/50"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
