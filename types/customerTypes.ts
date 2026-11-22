export type customersResponseProps = {
  data: customersProps[];
  meta: { total: number };
};

export type customersProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  orderCount: number;
  totalSpentMinor: number;
  createdAt: string;
};

export type customerDetailProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  orderCount: number;
  totalSpentMinor: number;
  createdAt: string;
  addresses: customerAddressProps[];
  recentOrders: customerOrderProps[];
};

export type customerAddressProps = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
};

export type customerOrderProps = {
  id: string;
  number: string | null;
  state: string;
  channel: string;
  placedAt: string | null;
  totalMinor: number;
  itemCount: number;
};
