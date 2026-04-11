import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

/**
 * Generic GET hook
 */
export function useApiQuery<T>(
  key: string[],
  url: string,
  params?: object,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, { params });
      return data;
    },
    ...options,
  });
}

/**
 * Generic POST/PUT/DELETE mutation hook
 */
export function useApiMutation<TData, TVariables>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient[method]<TData>(url, variables);
      return data;
    },
    ...options,
  });
}
