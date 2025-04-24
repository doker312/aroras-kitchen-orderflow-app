
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, PlusCircle, MinusCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { placeOrder } from "@/services/data";
import { toast } from "@/components/ui/use-toast";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  
  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const order = await placeOrder(user.id, items, subtotal);
      
      // Clear the cart after successful order
      clearCart();
      
      // Show success toast
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been received.`,
      });
      
      // Navigate to orders page
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Start adding some delicious dishes!</p>
        <Button onClick={() => navigate("/")} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Browse Menu
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <div className="w-24 h-24 bg-muted rounded-md overflow-hidden hidden sm:block">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-medium">₹{item.price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your order before checkout
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full" 
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
