
import { MenuItem, Order, OrderStatus, Category } from "../types";

// Mock menu categories
export const categories: Category[] = [
  { id: "starters", name: "Starters" },
  { id: "main-course", name: "Main Course" },
  { id: "biryani", name: "Biryani" },
  { id: "tandoori", name: "Tandoori" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
];

// Mock menu items
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Paneer Tikka",
    description: "Marinated cottage cheese cubes grilled in tandoor",
    price: 240,
    category: "starters",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 80,
    category: "starters",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Veg Pakora",
    description: "Mixed vegetable fritters",
    price: 120,
    category: "starters",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in rich tomato gravy",
    price: 260,
    category: "main-course",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Dal Makhani",
    description: "Black lentils slow-cooked with butter and cream",
    price: 180,
    category: "main-course",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Chicken Curry",
    description: "Traditional chicken curry with aromatic spices",
    price: 280,
    category: "main-course",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Veg Biryani",
    description: "Fragrant rice cooked with mixed vegetables and spices",
    price: 220,
    category: "biryani",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Chicken Biryani",
    description: "Aromatic rice dish with marinated chicken",
    price: 280,
    category: "biryani",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "9",
    name: "Tandoori Roti",
    description: "Whole wheat bread baked in tandoor",
    price: 30,
    category: "tandoori",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "10",
    name: "Butter Naan",
    description: "Leavened bread with butter",
    price: 50,
    category: "tandoori",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "11",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 120,
    category: "desserts",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "12",
    name: "Rasmalai",
    description: "Soft cheese patties soaked in sweetened milk",
    price: 150,
    category: "desserts",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "13",
    name: "Lassi",
    description: "Traditional yogurt-based sweet drink",
    price: 90,
    category: "beverages",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "14",
    name: "Masala Chai",
    description: "Spiced Indian tea with milk",
    price: 60,
    category: "beverages",
    imageUrl: "/placeholder.svg",
  },
];

// Mock orders data
let mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "1",
    items: [
      { ...menuItems[0], quantity: 1 },
      { ...menuItems[3], quantity: 2 },
    ],
    total: menuItems[0].price * 1 + menuItems[3].price * 2,
    status: "received",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "order-2",
    userId: "1",
    items: [
      { ...menuItems[7], quantity: 1 },
      { ...menuItems[9], quantity: 2 },
      { ...menuItems[11], quantity: 1 },
    ],
    total: menuItems[7].price * 1 + menuItems[9].price * 2 + menuItems[11].price * 1,
    status: "completed",
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60000).toISOString(),
  },
];

// Functions to interact with data (simulate API calls)

// Get menu items with optional category filter
export const getMenuItems = async (categoryId?: string): Promise<MenuItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  if (categoryId) {
    return menuItems.filter(item => item.category === categoryId);
  }
  
  return menuItems;
};

// Get menu item by ID
export const getMenuItemById = async (id: string): Promise<MenuItem | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return menuItems.find(item => item.id === id);
};

// Get categories
export const getCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return categories;
};

// Add a new menu item (admin only)
export const addMenuItem = async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const newItem: MenuItem = {
    ...item,
    id: `item-${Date.now()}`,
  };
  
  menuItems.push(newItem);
  return newItem;
};

// Update a menu item (admin only)
export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) throw new Error("Item not found");
  
  menuItems[index] = { ...menuItems[index], ...updates };
  return menuItems[index];
};

// Delete a menu item (admin only)
export const deleteMenuItem = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) throw new Error("Item not found");
  
  menuItems.splice(index, 1);
};

// Place a new order
export const placeOrder = async (userId: string, items: any[], total: number): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId,
    items,
    total,
    status: "received",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockOrders.push(newOrder);
  return newOrder;
};

// Get orders for a specific user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
  return mockOrders.filter(order => order.userId === userId);
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
  return mockOrders;
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay
  return mockOrders.find(order => order.id === id);
};

// Update order status (admin only)
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const index = mockOrders.findIndex(order => order.id === id);
  if (index === -1) throw new Error("Order not found");
  
  mockOrders[index] = {
    ...mockOrders[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  return mockOrders[index];
};
