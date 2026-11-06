import { ordersResponseProps } from "@/types/orderTypes";
import { api } from "../api";

export async function GetOrders(page: number) {
  const response = await api.get<ordersResponseProps>(
    `/admin/orders?page=${page}`,
  );

  return response.data;
}
