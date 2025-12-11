import { default as Axios } from "axios";
import { removeTokenChecked } from "@utils";
import { getSession, signOut } from "./signOut";
import { toast } from "react-toastify";

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL || "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axios.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session) {
    if (config.headers) {
      if (session.rutoken) {
        const { certId, expiryDate } = session.rutoken;
        config.headers.CertId = certId.toString();
        config.headers.CertExpiry = expiryDate.toString();
      }
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      removeTokenChecked();
      signOut();
    }

    if (error.response?.data?.Message) {
      toast.error(error.response.data.Message);
    }

    return Promise.reject(error);
  }
);
