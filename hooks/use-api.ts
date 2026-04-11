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
 * Generic POST/PUT/PATCH/DELETE mutation hook
 */
export function useApiMutation<TData, TVariables>(
  mutationFnOrMethod: ((variables: TVariables) => Promise<TData>) | "post" | "put" | "patch" | "delete",
  urlOrOptions?: string | UseMutationOptions<TData, Error, TVariables>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  // Overload handling
  const isFunction = typeof mutationFnOrMethod === "function";
  const url = isFunction ? undefined : (urlOrOptions as string);
  const mutationOptions = isFunction ? (urlOrOptions as UseMutationOptions<TData, Error, TVariables>) : options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      if (isFunction) {
        return mutationFnOrMethod(variables);
      }
      const { data } = await apiClient[mutationFnOrMethod]<TData>(url!, variables);
      return data;
    },
    ...mutationOptions,
  });
}
