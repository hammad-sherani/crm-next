// services/auth/logout.ts
import axiosInstance from "@/lib/axios";

export const logoutApi = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
