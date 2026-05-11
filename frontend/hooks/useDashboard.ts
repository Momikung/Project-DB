import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [trendsMonth, setTrendsMonth] = useState<any[]>([]);
  const [trendsDay, setTrendsDay] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [granularity, setGranularity] = useState('month');
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [zoomRange, setZoomRange] = useState({ start: 0, end: 0 });
  const [comparisonPoints, setComparisonPoints] = useState<any[]>([]);

  // Bug #4 Fix: Removed 'granularity' from fetchData's dependency array.
  // Previously, switching granularity would re-trigger the API call AND reset
  // the zoom range based on the *new* granularity's data, causing race conditions.
  // Now: fetch once, derive views from cached state.
  const fetchData = useCallback(async () => {
    try {
      const reportData = await api.getReports();
      setStats(reportData.stats);
      const monthData = reportData.trends_month || [];
      const dayData = reportData.trends_day || [];
      setTrendsMonth(monthData);
      setTrendsDay(dayData);

      // Initialize zoom range based on monthly data (default granularity)
      if (monthData.length > 0) {
        const endIdx = monthData.length - 1;
        const startIdx = Math.max(0, endIdx - 11);
        setZoomRange({ start: startIdx, end: endIdx });
        setStartDate(monthData[startIdx]?.full_date || "");
        setEndDate(monthData[endIdx]?.full_date || "");
      }
      
      const ordersData = await api.getRecentOrders();
      setRecentOrders(ordersData || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  }, []); // No more 'granularity' dependency — stable reference

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentTrends = useMemo(
    () => (granularity === 'month' ? trendsMonth : trendsDay),
    [granularity, trendsMonth, trendsDay]
  );

  const filteredTrends = useMemo(() => {
    if (!currentTrends.length) return [];
    return currentTrends.slice(zoomRange.start, zoomRange.end + 1);
  }, [currentTrends, zoomRange]);

  const handleApplyFilter = useCallback(() => {
    if (!startDate || !endDate) return;
    const startIdx = currentTrends.findIndex(t => t.full_date >= startDate);
    const endIdx = currentTrends.findLastIndex(t => t.full_date <= endDate);
    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
      setZoomRange({ start: startIdx, end: endIdx });
    }
  }, [currentTrends, startDate, endDate]);

  const applyQuickRange = useCallback((months: number, days: number = 0) => {
    const sourceData = days > 0 ? trendsDay : trendsMonth;
    if (!sourceData.length) return;
    if (days > 0) setGranularity('day');
    else setGranularity('month');
    const range = days > 0 ? days : months;
    const endIdx = sourceData.length - 1;
    const startIdx = Math.max(0, endIdx - range + 1);
    setZoomRange({ start: startIdx, end: endIdx });
    setStartDate(sourceData[startIdx]?.full_date || "");
    setEndDate(sourceData[endIdx]?.full_date || "");
  }, [trendsDay, trendsMonth]);

  const config = useMemo(() => {
    switch(activeMetric) {
      case 'orders': return { color: '#10B981', label: 'Order Stream', key: 'orders' };
      case 'users': return { color: '#F59E0B', label: 'User Nodes', key: 'users' };
      default: return { color: '#6366F1', label: 'Revenue Yield', key: 'revenue' };
    }
  }, [activeMetric]);

  return {
    stats,
    recentOrders,
    activeMetric,
    setActiveMetric,
    granularity,
    setGranularity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    zoomRange,
    comparisonPoints,
    setComparisonPoints,
    filteredTrends,
    handleApplyFilter,
    applyQuickRange,
    config,
    refresh: fetchData
  };
};
