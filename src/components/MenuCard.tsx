
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MenuItem } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface MenuCardProps {
  item: MenuItem;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onEdit, onDelete, isAdmin = false }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const handleAddToCart = () => {
    addItem(item);
  };
  
  return (
    <Card className="card-hover overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-accent/20">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <span className="font-medium text-primary">₹{item.price}</span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onDelete}>
              Delete
            </Button>
          </div>
        ) : (
          user?.role === "customer" && (
            <Button onClick={handleAddToCart} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
