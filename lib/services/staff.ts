import { staffResponseProps } from "@/types/staffTypes";
import { api } from "../api";

export async function GetStaff(
  page: number,
  limit: number,
  q: string,
  role: string,
) {
  const response = await api.get<staffResponseProps>("/admin/users", {
    params: {
      page: page,
      limit: limit,
      q: q || undefined,
      role: role || undefined,
    },
  });

  return response.data;
}
