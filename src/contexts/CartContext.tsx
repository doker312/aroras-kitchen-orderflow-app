import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem, MenuItem } from "../types";
import { toast } from "@/components/ui/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("arora_kitchen_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse saved cart:", err);
      }
    }
  }, []);
  
  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("arora_kitchen_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: MenuItem, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        // If item exists, update quantity
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // Otherwise, add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
    
    toast({
      title: "Item Added",
      description: `${quantity} × ${item.name} added to cart.`,
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item) {
        toast({
          description: `${item.name} removed from cart.`,
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      description: "Cart cleared.",
    });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
