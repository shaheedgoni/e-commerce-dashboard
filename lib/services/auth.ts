import { api } from "../api";

export async function Login(email: string, password: string) {
  const response = await api.post(
    "admin/auth/login",
    { email, password },
    { withCredentials: true },
  );

  api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

  return response.data;
}

export async function Refresh() {
  const response = await api.post(
    "/admin/auth/refresh",
    {},
    { withCredentials: true },
  );

  api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

  return response.data;
}
