import { useQuery } from "@tanstack/react-query";

export function useAuth(skipAuth = false) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !skipAuth,
    throwOnError: false,
    retryOnMount: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isUnauthenticated: !user && !isLoading,
  };
}