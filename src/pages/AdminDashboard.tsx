
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminMenu from "@/components/admin/AdminMenu";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("orders");
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        <TabsContent value="menu">
          <AdminMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
