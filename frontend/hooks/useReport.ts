import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

interface ReportTrend {
  revenue: number;
  orders: number;
  full_date: string;
}

interface ReportInventory {
  name: string;
  total: number;
  short: number;
  low: number;
}

interface ReportProduct {
  name: string;
  category: string;
  revenue_formatted: string;
}

export interface ReportData {
  trends_month: ReportTrend[];
  inventory: ReportInventory[];
  top_products: ReportProduct[];
  stats: {
    low_stock: number;
  };
}

export const useReport = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomRange, setZoomRange] = useState({ start: 0, end: 0 });
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getReports();
      setReportData(data);
      if (data?.trends_month && data.trends_month.length > 0) {
        let lastActiveIdx = data.trends_month.findLastIndex((t) => (t.revenue || 0) > 0 || (t.orders || 0) > 0);
        if (lastActiveIdx === -1) lastActiveIdx = data.trends_month.length - 1;
        const startIdx = Math.max(0, lastActiveIdx - 11);
        setZoomRange({ start: startIdx, end: lastActiveIdx });
        setCustomStart(data.trends_month[startIdx]?.full_date || "");
        setCustomEnd(data.trends_month[lastActiveIdx]?.full_date || "");
      }
    } catch (error) {
      console.error("Failed to fetch report data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    void load();
  }, [fetchData]);

  const filteredTrends = useMemo(() => reportData?.trends_month || [], [reportData]);

  const applyCustomDates = useCallback(() => {
    if (!reportData?.trends_month || reportData.trends_month.length === 0) return;
    const startIdx = reportData.trends_month.findIndex((t) => t.full_date >= customStart);
    let endIdx = reportData.trends_month.findLastIndex((t) => t.full_date <= customEnd);
    if (startIdx === -1) return;
    if (endIdx === -1) endIdx = reportData.trends_month.length - 1;
    if (startIdx <= endIdx) setZoomRange({ start: startIdx, end: endIdx });
  }, [customStart, customEnd, reportData]);

  const applyQuickRange = useCallback((months: number) => {
    if (!reportData?.trends_month || reportData.trends_month.length === 0) return;
    let lastActiveIdx = reportData.trends_month.findLastIndex((t) => (t.revenue || 0) > 0 || (t.orders || 0) > 0);
    if (lastActiveIdx === -1) lastActiveIdx = reportData.trends_month.length - 1;
    const startIdx = Math.max(0, lastActiveIdx - months + 1);
    setZoomRange({ start: startIdx, end: lastActiveIdx });
    setCustomStart(reportData.trends_month[startIdx]?.full_date || "");
    setCustomEnd(reportData.trends_month[lastActiveIdx]?.full_date || "");
  }, [reportData]);

  const distributionData = useMemo(() => {
    if (!reportData?.inventory) return [];
    return reportData.inventory.map((item) => ({
      name: item.name || "Unknown",
      value: Math.max(1, (item.total || 0)),
      alerts: (item.short || 0) + (item.low || 0)
    })).filter((i) => i.value > 0);
  }, [reportData]);

  return {
    reportData,
    isLoading,
    zoomRange,
    setZoomRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    filteredTrends,
    applyCustomDates,
    applyQuickRange,
    distributionData,
    refresh: fetchData
  };
};
