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
