import { Sparkles, Trash2, Plus, Minus, X, Check, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (prodId: string, delta: number) => void;
  onRemoveItem: (prodId: string) => void;
  onClearCart: () => void;
  onCheckout?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const [includeGiftWrap, setIncludeGiftWrap] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [checkingOut, setCheckingOut] = useState<boolean>(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity, 0);
  };

  const currentTotal = calculateSubtotal();

  const handleCheckoutSimulate = () => {
    if (onCheckout) {
      onCheckout();
      return;
    }
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckoutSuccess(true);
    }, 2200);
  };

  const handleSuccessClose = () => {
    setCheckoutSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop screen cover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 33 }}
              className="w-screen max-w-md bg-white border-l border-beige/40 flex flex-col justify-between shadow-2xl overflow-hidden text-left"
              id="cart-drawer-panel"
            >
              {/* Header */}
              <div className="p-6 border-b border-beige/40 flex items-center justify-between bg-ivory/50">
                <div className="space-y-1">
                  <span className="font-serif text-xl tracking-wide font-medium text-charcoal">
                    Ritual Bag
                  </span>
                  <span className="block font-mono text-[8px] text-taupe uppercase tracking-widest leading-none">
                    {cartItems.length} SELECTIONS COMMITTED
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-beige/20 text-taupe hover:text-charcoal cursor-pointer"
                  aria-label="Close Bag"
                  id="close-cart-drawer"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Scrollable selections list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                
                {/* Checkout Success screen */}
                {checkoutSuccess ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                    key="checkout-success"
                  >
                    <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
                      <Check className="w-8 h-8 text-teal-600 stroke-[1.5]" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-medium">
                        PLACEMENTS RESERVED
                      </span>
                      <h4 className="font-serif text-2xl text-charcoal font-light">
                        Ritual Completed
                      </h4>
                      <p className="text-xs text-taupe leading-relaxed font-sans max-w-xs">
                        Your bespoke minimal formulas are now logged for formulation batching. A clinical dispatch note with tracking parameters will arrive in your inbox.
                      </p>
                    </div>

                    <button
                      onClick={handleSuccessClose}
                      className="px-8 py-3.5 bg-charcoal text-white hover:bg-gold transition-colors text-[10px] uppercase font-mono tracking-widest cursor-pointer shadow-md inline-block"
                      id="close-success-btn"
                    >
                      Return to Journal
                    </button>
                  </motion.div>
                ) : checkingOut ? (
                  /* Loading active spinner */
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6" key="checkout-loader">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-t border-gold animate-spin" />
                      <Sparkles className="w-4.5 h-4.5 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] font-mono text-gold uppercase tracking-[0.2em]">
                        SECURING COHESION LINK
                      </span>
                      <p className="text-xs font-serif italic text-charcoal">
                        Verifying safe laboratory batch quantities...
                      </p>
                    </div>
                  </div>
                ) : cartItems.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4" key="empty-cart flex">
                    <span className="text-4xl select-none opacity-45">✨</span>
                    <div>
                      <h4 className="font-serif text-lg text-charcoal font-medium">Bag is Empty</h4>
                      <p className="text-xs text-taupe tracking-wider leading-relaxed mt-1 font-light">
                        Select elegant minimal formulations to begin your custom skin ritual.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-transparent border border-taupe/30 text-[10px] uppercase tracking-widest font-mono text-charcoal hover:bg-beige/25 mt-4 cursor-pointer"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  /* Selection lists */
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" key="cart-items-list-wrap">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-start space-x-4 border-b border-beige/20 pb-5"
                        id={`cart-row-${item.product.id}`}
                      >
                        {/* Image scale */}
                        <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden relative border border-beige/30 shrink-0 bg-beige/10">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Detail text */}
                        <div className="flex-1 min-w-0 space-y-1 text-left">
                          <span className="text-[7px] font-mono uppercase tracking-widest text-gold block">
                            {item.product.subtitle}
                          </span>
                          <h5 className="font-serif text-[15px] font-medium text-charcoal truncate">
                            {item.product.name}
                          </h5>
                          <span className="block text-[10px] text-taupe font-mono">
                            ₹{item.product.salePrice || item.product.price} VALUE | {item.product.volume}
                          </span>

                          {/* Control row */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2 border border-beige/50 rounded-sm bg-white p-0.5">
                              <button
                                onClick={() => onUpdateQty(item.product.id, -1)}
                                className="p-1 text-taupe hover:text-charcoal cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                              <span className="text-[10px] font-mono text-charcoal px-1.5 min-w-[12px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(item.product.id, 1)}
                                className="p-1 text-taupe hover:text-charcoal cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 stroke-[1.5]" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-taupe hover:text-red-700 p-1 cursor-pointer transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Premium gift package toggle checkbox */}
                    <div className="bg-ivory rounded-xl p-4 border border-beige/45 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-gold block">
                            LUXURY EXPERIENCE ADDON
                          </span>
                          <span className="text-xs font-serif text-charcoal font-medium">
                            Signature Presentation Packaging
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={includeGiftWrap}
                          onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                          className="w-4 h-4 text-gold border-beige bg-white rounded-md focus:ring-1 focus:ring-gold focus:outline-none cursor-pointer mt-1"
                          id="giftwrap-checkbox"
                        />
                      </div>
                      <p className="text-[10px] text-taupe leading-relaxed">
                        Receives elements encased in a heavy-milled warm linen sleeve with hand-tied satin straps and biological protective lavender nestings. Free of charge.
                      </p>
                    </div>

                    {/* Shipping info micro banner */}
                    <div className="flex items-center space-x-2.5 text-[10px] text-teal-700 font-mono tracking-wide">
                      <Truck className="w-4 h-4 shrink-0 stroke-[1.4]" />
                      <span>LOGISTICS: FREE DHL REGISTERED EXPRESS SHIPPING</span>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Subtotal & Action checkout drawer button */}
              {cartItems.length > 0 && !checkoutSuccess && !checkingOut && (
                <div className="p-6 border-t border-beige/40 bg-ivory/30 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-mono uppercase tracking-widest text-taupe">
                      RESERVE TOTAL
                    </span>
                    <span className="font-serif text-2xl font-light text-charcoal">
                      ₹{currentTotal}.00
                    </span>
                  </div>

                  <p className="text-[10px] text-center text-taupe italic">
                    Sales taxes calculated concurrently during checkout parameters.
                  </p>

                  <button
                    onClick={handleCheckoutSimulate}
                    className="w-full py-4 bg-charcoal text-white hover:bg-gold font-mono uppercase text-xs tracking-[0.25em] flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-md"
                    id="trigger-order-checkout"
                  >
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    <span>Reserve Placement</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
