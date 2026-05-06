export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  original_price?: number
  fabric?: string
  category?: string
  stock?: number
  sizes?: string[]
  colors?: string[]
  images?: string[]
  image?: string
  average_rating?: number
  rating?: number
  review_count?: number
  length?: string
  wash_care?: string
  shipping_fee_inside_dhaka?: number
  shipping_fee_outside_dhaka?: number
  is_active?: boolean
  created_at?: string
}

export interface PaginatedProductsResponse {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}
