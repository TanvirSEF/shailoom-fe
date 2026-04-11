export interface ApiError {
  detail: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
