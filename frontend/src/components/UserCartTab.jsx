import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from '../lib/utils';
import { 
  Trash2, Plus, Minus, ShoppingBag, 
  CreditCard, ShieldCheck, ArrowRight,
  Truck, Tag, Info
} from "lucide-react";

export function UserCartTab() {
  const [step, setStep] = useState("cart"); // 'cart' | 'checkout' | 'success'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const fetchCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!userInfo.token) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      if (response.data.success) {
        // Robust mapping that handles both old (populated) and new (embedded) cart data
        const cartItems = response.data.data.items.map(item => {
          const product = item.product || {};
          return {
            ...item,
            id: product._id || product || item.product,
            title: item.name || product.title || "Unknown Item",
            price: item.price || product.price || 0,
            imageUrl: item.imageUrl || product.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop",
            category: item.category || product.category || "General",
            condition: item.condition || product.condition || "New"
          };
        });
        setItems(cartItems);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load your cart.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, delta) => {
    const item = items.find(i => i.id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.post("/api/cart", 
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      
      setItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.delete(`/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      
      setItems(prev => prev.filter(item => item.id !== productId));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item.");
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const response = await axios.post("/api/orders", 
        { 
          paymentMethod, 
          shippingAddress: "SLIIT Main Campus - Student Lounge" // Default for now
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (response.data.success) {
        setOrderData(response.data.data);
        setStep("success");
        setItems([]); // Clear local cart
      }
      setLoading(false);
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.message || "Failed to process checkout.");
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const platformFee = Math.round(subtotal * 0.05); // 5% fee
  const total = subtotal + platformFee;

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-bold text-primary animate-pulse">Checking your campus bag...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <Info size={40} />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-2xl font-black text-red-500">Cart Issue</h3>
          <p className="text-muted-foreground font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground/40">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-2xl font-black text-primary">Your cart is empty</h3>
          <p className="text-muted-foreground font-medium">Looks like you haven't added anything to your cart yet. Explore the marketplace to find great deals!</p>
        </div>
        <button className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          Browse Marketplace
        </button>
      </div>
    );
  }

  // --- CART STEP --- //
  if (step === "cart") {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Items List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-primary tracking-tight">Shopping Cart</h2>
            <span className="text-sm font-bold text-muted-foreground">{items.length} Items</span>
          </div>

          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="group bg-card border rounded-3xl p-4 md:p-6 transition-all hover:border-primary/20 hover:shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1 block">{item.category}</span>
                      <h3 className="font-bold text-lg text-primary leading-tight line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">Condition: {item.condition}</p>
                    </div>
                    <p className="font-black text-xl text-primary whitespace-nowrap">LKR {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-primary transition-all text-muted-foreground"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-primary transition-all text-muted-foreground"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note/Promo */}
          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Tag size={20} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-primary text-sm">Have a promo code?</h4>
              <p className="text-xs text-muted-foreground">Apply student discounts or campus seasonal codes.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="text" 
                placeholder="Enter code" 
                className="px-4 py-2 rounded-xl bg-white border-transparent focus:border-primary/30 border focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold w-full md:w-32"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">Apply</button>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#001f5c] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <h3 className="text-xl font-black mb-6 relative">Order Summary</h3>
            
            <div className="space-y-4 relative">
              <div className="flex justify-between text-sm font-medium text-white/70">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-white/70">
                <div className="flex items-center gap-1.5">
                  <span>Platform Fee</span>
                  <Info size={12} className="opacity-50" />
                </div>
                <span>LKR {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-white/70">
                <span>Delivery</span>
                <span className="text-secondary font-bold">FREE (On-Campus)</span>
              </div>
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount</p>
                    <p className="text-3xl font-black text-white">LKR {total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep("checkout")}
              className="w-full mt-8 py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-secondary" />
                Secure Campus Payment
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                <Truck size={14} className="text-secondary" />
                 Instant Handover or Delivery
              </div>
            </div>
          </div>

          {/* Help box */}
          <div className="bg-card border rounded-3xl p-6 shadow-xl shadow-black/5">
             <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
               <CreditCard size={16} /> Payment Methods
             </h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               We support SLIIT student cards, bank transfers, and secure cash-on-handover for all campus trades.
             </p>
          </div>
        </div>
      </div>
    );
  }

  // --- SUCCESS STEP --- //
  if (step === "success") return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200">
        <ShieldCheck size={48} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-primary">Order Placed!</h2>
        <p className="text-muted-foreground font-medium">
          Your order <span className="text-primary font-bold">#{orderData?._id.slice(-8).toUpperCase()}</span> has been successfully placed.
        </p>
      </div>

      <div className="bg-card border rounded-[2.5rem] p-8 shadow-xl shadow-black/5 text-left space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
           <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Paid</span>
           <span className="text-2xl font-black text-primary font-mono">LKR {orderData?.totalAmount.toLocaleString()}</span>
        </div>
        
        <div className="space-y-4">
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                 <Truck size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-sm text-primary">Next Steps</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   {paymentMethod === 'cash' 
                     ? "Meet the seller at the Student Lounge for the handover and payment."
                     : "Your payment is confirmed. Reach out to the seller to arrange the handover."}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
      >
        Back to Marketplace
      </button>
    </div>
  );

  // --- CHECKOUT STEP --- //
  if (step === "checkout") return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setStep("cart")}
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight size={16} className="rotate-180" />
          </div>
          Back to Cart
        </button>
        <h2 className="text-2xl font-black text-primary tracking-tight text-center">Checkout</h2>
        <div className="w-24" /> {/* Spacer */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <CreditCard size={20} /> Select Payment Method
          </h3>
          
          <div className="space-y-4">
            <div 
              onClick={() => setPaymentMethod("online")}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                paymentMethod === 'online' ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-muted hover:border-primary/20 bg-card"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  paymentMethod === 'online' ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Online Payment</h4>
                  <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
                </div>
                <div className={cn(
                  "ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  paymentMethod === 'online' ? "border-primary bg-primary" : "border-muted"
                )}>
                  {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod("cash")}
              className={cn(
                "p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                paymentMethod === 'cash' ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-muted hover:border-primary/20 bg-card"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  paymentMethod === 'cash' ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Cash on Handover</h4>
                  <p className="text-xs text-muted-foreground">Pay when you receive the item</p>
                </div>
                <div className={cn(
                  "ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  paymentMethod === 'cash' ? "border-primary bg-primary" : "border-muted"
                )}>
                  {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Preview & Action */}
        <div className="bg-[#001f5c] rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-black">Final Review</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-white/60">
                <span>Items Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Platform Fee</span>
                <span>LKR {platformFee.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Grand Total</p>
                  <p className="text-4xl font-black">LKR {total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
             <button 
               onClick={handleCheckout}
               disabled={loading}
               className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
               {paymentMethod === 'online' ? "Pay with Stripe" : "Confirm Order"}
               {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={18} />}
             </button>
             <p className="text-center text-[10px] text-white/40 font-bold px-4 leading-relaxed">
               By clicking the button, you agree to the SLIIT Campus Marketplace terms and buyer protection policies.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
