import { customersResponseProps } from "@/types/customerTypes";
import { api } from "../api";

export async function GetCustomers(page: number, q: string, limit: number) {
  const response = await api.get<customersResponseProps>("/admin/customers", {
    params: {
      page: page,
      limit: limit,
      q: q || undefined,
    },
  });

  return response.data;
}
