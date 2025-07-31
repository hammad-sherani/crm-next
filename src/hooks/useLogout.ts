import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { logoutApi } from "@/services/auth/logout";

export const useLogout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      localStorage.removeItem("auth-storage");

      queryClient.clear(); 

      const isSuperAdmin = pathname.startsWith("/super-admin");
      const redirectTo = isSuperAdmin ? "/super-admin/login" : "/login";

      setTimeout(() => {
        router.replace(redirectTo);
      }, 100);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
