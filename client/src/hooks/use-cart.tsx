import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  pricePerUnit: number;
  unit: string;
  quantity: number;
  supplierId: string;
  supplierName: string;
  imageUrl?: string;
  stockQuantity?: number;
  minOrderQuantity?: number;
}

interface CartData {
  id: string;
  vendorId: string;
  supplierId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartContextType {
  carts: CartData[];
  totalItemsCount: number;
  totalAmount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number, supplierId: string) => Promise<void>;
  updateCartItem: (cartId: string, itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartId: string, itemId: string) => Promise<void>;
  clearCart: (cartId: string) => Promise<void>;
  getCartBySupplier: (supplierId: string) => CartData | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: carts = [], isLoading } = useQuery({
    queryKey: ["/api/carts", user?.id],
    enabled: !!user,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity, supplierId }: { productId: string; quantity: number; supplierId: string }) => {
      return apiRequest("POST", "/api/carts/add", { productId, quantity, supplierId, vendorId: user?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carts"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ cartId, itemId, quantity }: { cartId: string; itemId: string; quantity: number }) => {
      return apiRequest("PUT", `/api/carts/${cartId}/items/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({ cartId, itemId }: { cartId: string; itemId: string }) => {
      return apiRequest("DELETE", `/api/carts/${cartId}/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carts"] });
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async (cartId: string) => {
      return apiRequest("DELETE", `/api/carts/${cartId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carts"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const totalItemsCount = Array.isArray(carts) ? carts.reduce((total, cart) => total + cart.totalItems, 0) : 0;
  const totalAmount = Array.isArray(carts) ? carts.reduce((total, cart) => total + cart.totalAmount, 0) : 0;

  const addToCart = async (productId: string, quantity: number, supplierId: string) => {
    await addToCartMutation.mutateAsync({ productId, quantity, supplierId });
  };

  const updateCartItem = async (cartId: string, itemId: string, quantity: number) => {
    await updateCartMutation.mutateAsync({ cartId, itemId, quantity });
  };

  const removeFromCart = async (cartId: string, itemId: string) => {
    await removeFromCartMutation.mutateAsync({ cartId, itemId });
  };

  const clearCart = async (cartId: string) => {
    await clearCartMutation.mutateAsync(cartId);
  };

  const getCartBySupplier = (supplierId: string): CartData | undefined => {
    return Array.isArray(carts) ? carts.find(cart => cart.supplierId === supplierId) : undefined;
  };

  return (
    <CartContext.Provider
      value={{
        carts: Array.isArray(carts) ? carts : [],
        totalItemsCount,
        totalAmount,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartBySupplier,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}