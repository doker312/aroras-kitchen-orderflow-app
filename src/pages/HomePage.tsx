
import React, { useState, useEffect } from "react";
import { getCategories, getMenuItems } from "@/services/data";
import { Category, MenuItem } from "@/types";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Loader2 } from "lucide-react";

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        const menuItemsData = await getMenuItems(selectedCategory || undefined);
        setMenuItems(menuItemsData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Welcome to Arora's Kitchen</h1>
        <p className="text-center text-muted-foreground mt-2">
          Authentic Indian cuisine with traditional flavors
        </p>
      </div>
      
      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      {/* Menu items */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading menu...</span>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">{error}</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No menu items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
