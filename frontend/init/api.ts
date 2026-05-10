import { StatusResponse, DashboardStats, Order } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  getDbStatus: async (): Promise<StatusResponse> => {
    const res = await fetch(`${BASE_URL}/db-test`);
    if (!res.ok) throw new Error('Backend not reachable');
    return res.json();
  },
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },
  getRecentOrders: async (): Promise<Order[]> => {
    const res = await fetch(`${BASE_URL}/dashboard/recent-orders`);
    if (!res.ok) throw new Error('Failed to fetch recent orders');
    return res.json();
  },
};
