import { StatusResponse, DashboardStats, Order } from '../types';

// ใช้ /api นำหน้าเพราะเราทำ rewrites ใน next.config.ts แล้ว
const BASE_URL = '/api';

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
  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products/`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  getOrders: async () => {
    const res = await fetch(`${BASE_URL}/orders/`);
    if (!res.ok) throw new Error('Failed to fetch all orders');
    return res.json();
  },
  getUsers: async () => {
    const res = await fetch(`${BASE_URL}/users/`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  getReports: async () => {
    const res = await fetch(`${BASE_URL}/reports/data`);
    if (!res.ok) throw new Error('Failed to fetch report data');
    return res.json();
  },
};

