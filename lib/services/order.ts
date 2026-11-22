import { orderDetailProps, ordersResponseProps } from "@/types/orderTypes";
import { api } from "../api";

export async function GetOrders(
  page: number,
  limit: number,
  q: string,
  state: string,
  channel: string,
  from: string,
  to: string,
) {
  const response = await api.get<ordersResponseProps>("/admin/orders", {
    params: {
      page: page,
      limit: limit,
      q: q || undefined,
      state: state || undefined,
      channel: channel || undefined,
      from: from || undefined,
      to: to || undefined,
    },
  });

  return response.data;
}

export async function GetOrder(id: string) {
  const response = await api.get<orderDetailProps>(`/admin/orders/${id}`);
  return response.data;
}

export async function ChangeOrderState(id: string, to: string) {
  const response = await api.post(`/admin/orders/${id}/transition`, {
    to: to,
  });

  return response.data;
}
