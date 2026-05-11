import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

export const useProducts = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      setProductsData(data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categories = useMemo(() => {
    const cats = new Set(productsData.map(p => p.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [productsData, searchTerm, categoryFilter]);

  const lowStockCount = useMemo(() => {
    return productsData.filter(p => p.stock < 10).length;
  }, [productsData]);

  return {
    productsData,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredProducts,
    lowStockCount,
    refresh: fetchData
  };
};
