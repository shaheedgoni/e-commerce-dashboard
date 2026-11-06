import { badgeVariant } from "@/components/ui/badge";

type statusInfo = {
  label: string;
  variant: badgeVariant;
};

export const orderStateMap: Record<string, statusInfo> = {
  open: {
    label: "open",
    variant: "neutral",
  },
  pending_payment: {
    label: "Pending payment",
    variant: "warning",
  },
  paid: {
    label: "Paid",
    variant: "info",
  },
  shipped: {
    label: "Shipped",
    variant: "purple",
  },
  delivered: {
    label: "Delivered",
    variant: "success",
  },
  cancelled: {
    label: "Cancelled",
    variant: "neutral",
  },
};

export const channelMap: Record<string, statusInfo> = {
  web: {
    label: "Web",
    variant: "outline",
  },
  pos: {
    label: "POS",
    variant: "outline",
  },
};
