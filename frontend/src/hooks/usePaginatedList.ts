import { useEffect, useState } from "react";
import type { ListQuery } from "../types/ListQuery";


interface PaginatedResult<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export function usePaginatedList<T>(
  fetchFn: (query: ListQuery) => Promise<PaginatedResult<T>>,
  initialLimit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetchFn({ page, limit });

      setData(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return {
    data,
    page,
    setPage,
    totalPages,
    total,
    loading,
    refresh: fetchData,
  };
}