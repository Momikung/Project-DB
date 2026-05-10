export interface StatusResponse {
  status: string;
  message: string;
  database_version?: string;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  products: number;
  users: number;
}

export interface Order {
  order_id: number;
  shipping_name: string;
  total_price: number;
  order_status: string;
  order_date: string;
}
