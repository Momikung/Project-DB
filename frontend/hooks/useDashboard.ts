import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [trendsYear, setTrendsYear] = useState<any[]>([]);
  const [trendsMonth, setTrendsMonth] = useState<any[]>([]);
  const [trendsDay, setTrendsDay] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [fulfilment, setFulfilment] = useState<any[]>([]);
  const [levelData, setLevelData] = useState<any[]>([]);
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
      const yearData = reportData.trends_year || [];
      const monthData = reportData.trends_month || [];
      const dayData = reportData.trends_day || [];
      setTrendsYear(yearData);
      setTrendsMonth(monthData);
      setTrendsDay(dayData);
      setInventory(reportData.inventory || []);
      setTopProducts(reportData.top_products || []);
      setFulfilment(reportData.fulfilment || []);
      setLevelData(reportData.level || []);

      // Initialize zoom range based on monthly data (default granularity)
      // Default to entire available data range (startIdx = 0)
      if (monthData.length > 0) {
        const endIdx = monthData.length - 1;
        const startIdx = 0; 
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
    () => {
      if (granularity === 'year') return trendsYear;
      if (granularity === 'day') return trendsDay;
      return trendsMonth;
    },
    [granularity, trendsYear, trendsMonth, trendsDay]
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

  const applyQuickRange = useCallback((rangeValue: number, type: 'year' | 'month' | 'day') => {
    let sourceData = trendsMonth;
    if (type === 'year') sourceData = trendsYear;
    else if (type === 'day') sourceData = trendsDay;
    
    if (!sourceData.length) return;
    setGranularity(type);
    
    const endIdx = sourceData.length - 1;
    // If rangeValue is 0, it means "All Time"
    const startIdx = rangeValue > 0 ? Math.max(0, endIdx - rangeValue + 1) : 0;
    
    setZoomRange({ start: startIdx, end: endIdx });
    setStartDate(sourceData[startIdx]?.full_date || "");
    setEndDate(sourceData[endIdx]?.full_date || "");
  }, [trendsYear, trendsMonth, trendsDay]);

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
    trendsYear,
    trendsMonth,
    trendsDay,
    inventory,
    topProducts,
    fulfilment,
    levelData,
    handleApplyFilter,
    applyQuickRange,
    config,
    refresh: fetchData
  };
};
