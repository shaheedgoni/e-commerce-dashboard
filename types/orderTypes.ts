export type ordersResponseProps = {
  data: orderProps[];
  meta: { total: number };
};

export type orderProps = {
  id: string;
  number: string;
  state: string;
  channel: string;
  itemCount: number;
  totalMinor: number;
  placedAt: string;
  paidAt: string | null;
  customer: {
    name: string;
    email: string;
  } | null;
};

export type orderDetailProps = {
  id: string;
  number: string;
  state: string;
  channel: string;
  placedAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  lines: orderLineProps[];
  subtotalMinor: number;
  vatMinor: number;
  shippingMinor: number;
  totalMinor: number;
  customer: { name: string; email: string } | null;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    phone: string;
  } | null;
  payment: {
    reference: string;
    provider: string;
    status: string;
    amountMinor: number;
    createdAt: string;
  } | null;
};

export type orderLineProps = {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
};
