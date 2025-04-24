
import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "@/services/data";
import { Order, OrderStatus } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow, parseISO } from "date-fns";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await getAllOrders();
        // Sort orders by date (newest first)
        const sortedOrders = ordersData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Manage and update the status of customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No orders found.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Collapsible
                  key={order.id}
                  open={expandedOrderId === order.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="p-4 flex justify-between items-center bg-muted/30">
                    <div>
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" onClick={() => toggleOrderDetails(order.id)}>
                          {expandedOrderId === order.id ? "Hide" : "View"}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="p-4 border-t">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={`${order.id}-${item.id}`}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">₹{item.price}</TableCell>
                              <TableCell className="text-center">{item.quantity}</TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{item.price * item.quantity}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium">
                              Order Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              ₹{order.total}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6 flex items-center gap-3">
                        <p className="text-sm font-medium">Update Status:</p>
                        <div className="flex-1">
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => 
                              handleStatusChange(order.id, value)
                            }
                            disabled={updating[order.id]}
                          >
                            <SelectTrigger className="w-40">
                              {updating[order.id] ? (
                                <div className="flex items-center">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                <SelectValue placeholder="Select status" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Order Received</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
