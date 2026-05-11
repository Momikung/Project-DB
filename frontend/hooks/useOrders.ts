import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

export const useOrders = () => {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.getOrders();
      setOrdersData(data.orders || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      // Search filter
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        (order.display_id ?? '').toLowerCase().includes(lowerSearch) ||
        (order.customer ?? '').toLowerCase().includes(lowerSearch);

      // Status filter
      const matchesStatus = statusFilter === "all" ||
        (order.status ?? '').toLowerCase() === statusFilter.toLowerCase();

      // Bug #5 Fix: Guard against invalid/null order.date before creating Date object
      let matchesStart = true;
      let matchesEnd = true;
      if (startDate || endDate) {
        const rawDate = order.date;
        const orderDate = rawDate ? new Date(rawDate) : null;
        if (orderDate && !isNaN(orderDate.getTime())) {
          if (startDate) matchesStart = orderDate >= new Date(startDate);
          if (endDate) matchesEnd = orderDate <= new Date(endDate);
        } else {
          // If date is invalid and a date filter is active, exclude the record
          matchesStart = !startDate;
          matchesEnd = !endDate;
        }
      }

      // Bug #6 Fix: Guard against NaN from parseFloat on bad data
      let matchesMin = true;
      let matchesMax = true;
      if (minPrice || maxPrice) {
        const orderPrice = parseFloat(order.amount);
        if (!isNaN(orderPrice)) {
          if (minPrice) matchesMin = orderPrice >= parseFloat(minPrice);
          if (maxPrice) matchesMax = orderPrice <= parseFloat(maxPrice);
        }
        // If price is unparseable and a price filter is active, exclude the record
        else {
          matchesMin = !minPrice;
          matchesMax = !maxPrice;
        }
      }

      return matchesSearch && matchesStatus && matchesStart && matchesEnd && matchesMin && matchesMax;
    });
  }, [ordersData, searchTerm, statusFilter, startDate, endDate, minPrice, maxPrice]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
  }, []);

  return {
    ordersData,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    showAdvancedFilters,
    setShowAdvancedFilters,
    filteredOrders,
    clearAllFilters,
    refresh: fetchData
  };
};
