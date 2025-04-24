
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "received":
        return { label: "Order Received", variant: "outline" as const };
      case "preparing":
        return { label: "Preparing", variant: "secondary" as const };
      case "out-for-delivery":
        return { label: "Out for Delivery", variant: "default" as const };
      case "completed":
        return { label: "Delivered", variant: "success" as const };
      default:
        return { label: status, variant: "outline" as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  // Custom styling for "success" variant which doesn't exist in shadcn by default
  const isSuccess = variant === "success";
  const baseClasses = isSuccess 
    ? "bg-green-100 text-green-800 hover:bg-green-100/80"
    : "";

  return (
    <Badge variant={isSuccess ? "outline" : variant} className={baseClasses}>
      {label}
    </Badge>
  );
};

export default OrderStatusBadge;
