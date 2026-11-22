import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({ baseURL: "http://localhost:4000/api" });

type retryConfigProps = InternalAxiosRequestConfig & { retried?: boolean };

let refreshing: Promise<string> | null = null;

async function GetNewToken() {
  const response = await api.post(
    "/admin/auth/refresh",
    {},
    { withCredentials: true },
  );
  return response.data.accessToken as string;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const original = error.config as retryConfigProps;
    const isAuthCall = original.url?.includes("/admin/auth/");

    if (error.response?.status === 401 && !original.retried && !isAuthCall) {
      original.retried = true;

      if (!refreshing) {
        refreshing = GetNewToken().finally(() => {
          refreshing = null;
        });
      }

      try {
        const token = await refreshing;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
