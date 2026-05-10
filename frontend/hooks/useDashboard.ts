import { useState, useEffect } from 'react';
import { api } from '../init/api';
import { DashboardStats, Order } from '../types';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          api.getStats(),
          api.getRecentOrders()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, recentOrders, loading, error };
};
