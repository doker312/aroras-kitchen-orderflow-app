
import React, { useState, useEffect } from "react";
import {
  getCategories,
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/services/data";
import { Category, MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MenuCard from "@/components/MenuCard";
import MenuItemForm from "@/components/MenuItemForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import CategoryFilter from "@/components/CategoryFilter";
import { toast } from "@/components/ui/use-toast";

const AdminMenu: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Load menu data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        const items = await getMenuItems(selectedCategory || undefined);
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to load menu data:", err);
        toast({
          title: "Error",
          description: "Failed to load menu data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedCategory]);
  
  // Filter menu items by search term
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form submissions
  const handleAddItem = async (data: Omit<MenuItem, "id">) => {
    setFormLoading(true);
    try {
      const newItem = await addMenuItem(data);
      setMenuItems((prev) => [...prev, newItem]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} has been added to the menu.`,
      });
    } catch (err) {
      console.error("Failed to add menu item:", err);
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleEditItem = async (data: Omit<MenuItem, "id">) => {
    if (!currentItem) return;
    
    setFormLoading(true);
    try {
      const updatedItem = await updateMenuItem(currentItem.id, data);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === currentItem.id ? updatedItem : item))
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: `${data.name} has been updated.`,
      });
    } catch (err) {
      console.error("Failed to update menu item:", err);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    
    setFormLoading(true);
    try {
      await deleteMenuItem(currentItem.id);
      setMenuItems((prev) => prev.filter((item) => item.id !== currentItem.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `${currentItem.name} has been deleted from the menu.`,
      });
    } catch (err) {
      console.error("Failed to delete menu item:", err);
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>
                Add a new item to your restaurant menu.
              </DialogDescription>
            </DialogHeader>
            <MenuItemForm
              onSubmit={handleAddItem}
              categories={categories}
              isLoading={formLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 w-full">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading menu items...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No menu items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              isAdmin={true}
              onEdit={() => {
                setCurrentItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => {
                setCurrentItem(item);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details of this menu item.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <MenuItemForm
              onSubmit={handleEditItem}
              categories={categories}
              initialData={currentItem}
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{currentItem?.name}</span> from the
              menu. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              disabled={formLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {formLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMenu;
