
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="text-white font-bold text-xl md:text-2xl">
            Arora's Kitchen
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === "customer" && (
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-6 w-6 text-white" />
                    {totalItems > 0 && (
                      <Badge variant="secondary" className="absolute -top-2 -right-2">{totalItems}</Badge>
                    )}
                  </Link>
                )}
                
                <div className="hidden md:block text-white">
                  <span className="text-sm mr-2 opacity-80">Hi, {user.name}</span>
                </div>
                
                <div className="flex gap-2">
                  {user.role === "customer" ? (
                    <Link to="/orders">
                      <Button variant="outline" size="sm" className="text-white border-white">
                        My Orders
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="text-white border-white">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-primary/90">
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="text-white border-white">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Arora's Kitchen. All rights reserved.</p>
            <p className="mt-1">The best authentic Indian cuisine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
