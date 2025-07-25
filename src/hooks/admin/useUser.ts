/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await axiosInstance.delete(`/admin/users/${userId}/delete`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete user");
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] }); 
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while deleting the user");
    },
  });
};

export const useStatusChange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const res = await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User status updated successfully");
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update user status");
      console.error(error);
    },
  });
};