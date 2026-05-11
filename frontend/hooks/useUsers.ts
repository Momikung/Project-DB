import { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../init/api';

export const useUsers = () => {
  const [usersData, setUsersData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsersData(data.users || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Bug #3 Fix: Wrapped in useMemo (prevents re-computation on every render)
  // and added null-safety checks on u.name / u.email to prevent crash
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return usersData;
    const lowerSearch = searchTerm.toLowerCase();
    return usersData.filter(u =>
      (u.name ?? '').toLowerCase().includes(lowerSearch) ||
      (u.email ?? '').toLowerCase().includes(lowerSearch)
    );
  }, [usersData, searchTerm]);

  return {
    usersData,
    stats,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    refresh: fetchData
  };
};
