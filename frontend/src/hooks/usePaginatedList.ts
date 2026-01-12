// import { useEffect, useState } from "react";
// import type { ListQuery } from "../types/ListQuery";



// interface PaginatedResponse<T> {
//     data: T[];
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
// }

// interface UsePaginatedListOptions {
//     pageSize?: number;
//     initialFilters?: ListQuery["filters"];
//     initialSort?: {
//         sortBy: string;
//         sortOrder: "asc" | "desc";
//     };
// }

// export function usePaginatedList<T>(
//     fetchFn: (query: ListQuery) => Promise<PaginatedResponse<T>>,
//     options?: UsePaginatedListOptions
// ) {
//     // state
//     const [data, setData] = useState<T[]>([]);
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const [search, setSearch] = useState("");
//     const [filters, setFilters] = useState<ListQuery["filters"]>(
//         options?.initialFilters
//     );
//     const [sort, setSort] = useState(options?.initialSort);

//     const limit = options?.pageSize ?? 10;

//     //fetch
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const result = await fetchFn({
//                     page,
//                     limit,
//                     ...(search && { search }),
//                     ...(filters && { filters }),
//                     ...(sort && {
//                         sortBy: sort.sortBy,
//                         sortOrder: sort.sortOrder,
//                     }),
//                 });

//                 setData(result.data);
//                 setTotalPages(result.totalPages);
//             } catch (err) {
//                 setError("Failed to load data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [page, search, filters, sort, limit, fetchFn]);
    

//     //helpers
//     const resetPage = () => setPage(1);

//     const updateSearch = (value: string) => {
//         resetPage();
//         setSearch(value);
//     };

//     const updateFilters = (value?: ListQuery["filters"]) => {
//         resetPage();
//         setFilters(value);
//     };

//     const updateSort = (sortBy: string, sortOrder: "asc" | "desc") => {
//         resetPage();
//         setSort({ sortBy, sortOrder });
//     };

//     return {
//         // data
//         data,

//         // pagination
//         page,
//         totalPages,
//         setPage,

//         // controls
//         search,
//         setSearch: updateSearch,
//         filters,
//         setFilters: updateFilters,
//         sort,
//         setSort: updateSort,

//         // status
//         loading,
//         error,
//     };
// }
