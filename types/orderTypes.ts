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
