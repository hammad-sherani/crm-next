// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axiosInstance from "@/lib/axios";
// import { toast } from "sonner";

// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (userId: string) => {
//       const res = await axiosInstance.delete(`/admin/users/${userId}`);
//       if (!res.data.success) {
//         throw new Error(res.data.message || "Failed to delete user");
//       }
//       return res.data;
//     },
//     onSuccess: (data) => {
//       toast.success(data.message || "User deleted successfully");
//       queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate user list
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || "An error occurred while deleting the user");
//     },
//   });
// };
