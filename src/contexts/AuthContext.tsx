
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user data
const mockUsers: Record<string, { password: string; user: User }> = {
  "customer@example.com": {
    password: "password",
    user: {
      id: "1",
      name: "Customer User",
      email: "customer@example.com",
      role: "customer",
    },
  },
  "admin@example.com": {
    password: "admin123",
    user: {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("arora_kitchen_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
    setLoading(false);
  }, []);

  // Login function - in a real app this would call an API
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const userRecord = mockUsers[email.toLowerCase()];
    if (!userRecord || userRecord.password !== password) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid email or password");
    }

    setUser(userRecord.user);
    localStorage.setItem("arora_kitchen_user", JSON.stringify(userRecord.user));
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userRecord.user.name}!`,
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("arora_kitchen_user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  // Register function - in a real app this would call an API
  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers[email.toLowerCase()]) {
      toast({
        title: "Registration Failed",
        description: "User already exists with this email",
        variant: "destructive",
      });
      throw new Error("User already exists");
    }

    // In a real app, we would add the user to the database
    // For this mock, we'll just create a new user object and add it to our mockUsers
    const newUser: User = {
      id: `customer-${Date.now()}`,
      name,
      email,
      role: "customer", // New users are always customers
    };

    // Add to mock users (this wouldn't persist after page reload)
    mockUsers[email.toLowerCase()] = {
      password,
      user: newUser,
    };

    // Auto login after registration
    setUser(newUser);
    localStorage.setItem("arora_kitchen_user", JSON.stringify(newUser));
    
    toast({
      title: "Registration Successful",
      description: `Welcome, ${name}!`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
