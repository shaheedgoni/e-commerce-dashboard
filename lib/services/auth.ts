import { adminUserProps } from "@/types/sidebar";
import { api } from "../api";

let currentUser: adminUserProps = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: null,
  role: "staff",
  isActive: false,
  createdAt: "",
};

export function GetUser() {
  return currentUser;
}

export async function Login(email: string, password: string) {
  const response = await api.post(
    "admin/auth/login",
    { email, password },
    { withCredentials: true },
  );

  api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
  currentUser = response.data.user;

  return response.data;
}

export async function Logout() {
  await api.post("/admin/auth/logout", {}, { withCredentials: true });
}

export async function Refresh() {
  const response = await api.post(
    "/admin/auth/refresh",
    {},
    { withCredentials: true },
  );

  api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

  currentUser = response.data.user;

  return response.data.user;
}
