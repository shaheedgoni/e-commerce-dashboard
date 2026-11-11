import { stockResponseProps } from "@/types/stockTypes";
import { api } from "../api";

export async function GetStock(page: number, q: string, lowStock: boolean) {
  const response = await api.get<stockResponseProps>("/admin/stock", {
    params: {
      page: page,
      q: q || undefined,
      lowStock: lowStock || undefined,
    },
  });
  return response.data;
}

export async function ChangeStock(
  variantId: string,
  mode: string,
  quantity: number,
) {
  const response = await api.post(`/admin/variants/${variantId}/stock`, {
    mode,
    quantity,
  });
  return response.data;
}
