import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { ShoppingCart, Minus, Plus, Trash2, Store, CreditCard, Truck, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { carts, totalItemsCount, totalAmount, updateCartItem, removeFromCart, clearCart, isLoading: cartLoading } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  const handleQuantityChange = async (cartId: string, itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(cartId, itemId, newQuantity);
  };

  const handleRemoveItem = async (cartId: string, itemId: string) => {
    await removeFromCart(cartId, itemId);
  };

  const handleClearCart = async (cartId: string) => {
    await clearCart(cartId);
  };

  const handleCheckout = async (cartId: string) => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    try {
      // Create checkout session with Stripe
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          deliveryAddress,
          notes,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout process");
    }
  };

  if (isLoading || cartLoading) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  if (!user) {
    return null;
  }

  if (!carts || carts.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Your cart is empty</h2>
            <p className="text-neutral-500 mb-8">Start adding products to see them here</p>
            <Button 
              onClick={() => setLocation("/products")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Browse Products
            </Button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/products")}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">Shopping Cart</h1>
            <p className="text-neutral-500">{totalItemsCount} items • ₹{totalAmount.toFixed(2)} total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {carts.map((cart) => (
              <Card key={cart.id} className="border border-neutral-200">
                <CardHeader className="border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Store className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {cart.items[0]?.supplierName || "Supplier"}
                        </CardTitle>
                        <p className="text-sm text-neutral-500">
                          {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} • ₹{cart.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleClearCart(cart.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-neutral-100 last:border-b-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {item.imageUrl || "📦"}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-neutral-800 truncate">{item.productName}</h4>
                          <p className="text-sm text-neutral-500">₹{item.pricePerUnit}/{item.unit}</p>
                          {item.stockQuantity && item.stockQuantity <= 10 && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs mt-1">
                              Low Stock: {item.stockQuantity} left
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(cart.id, item.id, item.quantity - 1)}
                              disabled={item.quantity <= (item.minOrderQuantity || 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                handleQuantityChange(cart.id, item.id, newQuantity);
                              }}
                              className="w-16 h-8 text-center border-0 bg-transparent"
                              min={item.minOrderQuantity || 1}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(cart.id, item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">₹{(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(cart.id, item.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-200">
                    <Button 
                      onClick={() => handleCheckout(cart.id)}
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Checkout ₹{cart.totalAmount.toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border border-neutral-200">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal ({totalItemsCount} items)</span>
                  <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">GST (18%)</span>
                  <span className="font-medium">₹{(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{(totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200">
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Truck className="inline h-4 w-4 mr-1" />
                    Delivery Address *
                  </label>
                  <Textarea
                    placeholder="Enter your complete delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Special Instructions
                  </label>
                  <Textarea
                    placeholder="Any special delivery instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="stripe"
                        checked={selectedPaymentMethod === "stripe"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <span>Online Payment (Cards, UPI, Net Banking)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="cod"
                        checked={selectedPaymentMethod === "cod"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}