import { useEffect, useState } from "react";
import { getUsersApi, updateUserStatusApi } from "../../../api/adminApi";
import type { UserStatus, AdminUser } from "../../../api/adminApi";

import { useDebounce } from "../../../hooks/useDebounce";
import ConfirmModal from "../../../components/modals/ConfirmModal";




const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");


  const debouncedSearch = useDebounce(search, 400);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    status: UserStatus;
    username: string;
  } | null>(null);



  //
  const fetchUsers = async () => {
    try {

      const data = await getUsersApi({
        page,
        limit,
        // ...(search && { search }), 
        ...(debouncedSearch && { search: debouncedSearch }),
        // ...(status && { filters: { status } }),
        ...(status && { status }),
      });

      setUsers(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // refetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, status]);


  //actions
  // const toggleStatus = async (id: string, currentStatus: UserStatus) => {
  //   const newStatus: UserStatus =
  //     currentStatus === "active" ? "blocked" : "active";

  //   try {
  //     await updateUserStatusApi(id, newStatus);

  //     // optimistic update
  //     setUsers((prev) =>
  //       prev.map((u) =>
  //         u.id === id ? { ...u, status: newStatus } : u
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Failed to update user status", err);
  //   }
  // };

  const requestToggleStatus = (user: AdminUser) => {
    setSelectedUser({
      id: user.id,
      status: user.status,
      username: user.username,
    });
    setConfirmOpen(true);
  };



  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    const newStatus: UserStatus =
      selectedUser.status === "active" ? "blocked" : "active";

    try {
      await updateUserStatusApi(selectedUser.id, newStatus);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: newStatus }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to update user status", err);
    } finally {
      setConfirmOpen(false);
      setSelectedUser(null);
    }
  };





  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          User Management
        </h1>
        <p className="text-slate-400 text-sm">
          Manage platform users and control access
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by username"
          className="px-3 py-2 rounded bg-slate-800 text-white text-sm"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as UserStatus | "");
          }}
          className="px-3 py-2 rounded bg-slate-800 text-white text-sm"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700">
              <th className="pb-3">User</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-800 hover:bg-slate-800 transition"
              >
                <td className="py-4 text-white font-medium">
                  {u.username}
                </td>

                <td className="py-4 text-slate-300">
                  {u.email}
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${u.status === "active"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                      }
                    `}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="py-4 text-right">
                  <button
                    // onClick={() => toggleStatus(u.id, u.status)}
                    onClick={() => requestToggleStatus(u)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition
                      ${u.status === "active"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    `}
                  >
                    {u.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-slate-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-slate-400 text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-slate-800 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>




      <ConfirmModal
        open={confirmOpen}
        title={
          selectedUser?.status === "active"
            ? "Block User"
            : "Unblock User"
        }
        message={
          selectedUser?.status === "active"
            ? `Are you sure you want to block ${selectedUser?.username}?`
            : `Are you sure you want to unblock ${selectedUser?.username}?`
        }
        confirmText={
          selectedUser?.status === "active" ? "Block" : "Unblock"
        }
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmToggleStatus}
      />


    </div>
  );
};

export default UserManagement;













// import { useEffect, useState } from "react";
// import { getUsersApi, updateUserStatusApi } from "../../api/adminApi";



// type UserStatus = "active" | "blocked";

// interface AdminUser {
//   id: string;
//   username: string;
//   email: string;
//   status: UserStatus;
// }

// const UserManagement = () => {
//   const [users, setUsers] = useState<AdminUser[]>([]);


//   //
//   const fetchUsers = async () => {
//     try {
//       // const res = await getUsersApi({ page: 1, limit: 20 });
//       // setUsers(res.data.data.users);
//       const data = await getUsersApi({ page: 1, limit: 20 });
//       setUsers(data.users);

//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     }
//   };


//   //
//   const toggleStatus = async (id: string, status: UserStatus) => {
//     const newStatus = status === "active" ? "blocked" : "active";

//     try {
//       await updateUserStatusApi(id, newStatus);

//       // optimistic update
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === id ? { ...u, status: newStatus } : u
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update user status", err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-white">
//           User Management
//         </h1>
//         <p className="text-slate-400 text-sm">
//           Manage platform users and control access
//         </p>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="text-left text-slate-400 border-b border-slate-700">
//               <th className="pb-3">User</th>
//               <th className="pb-3">Email</th>
//               <th className="pb-3">Status</th>
//               <th className="pb-3 text-right">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//               <tr
//                 key={u.id}
//                 className="border-b border-slate-800 hover:bg-slate-800 transition"
//               >
//                 <td className="py-4 text-white font-medium">
//                   {u.username}
//                 </td>

//                 <td className="py-4 text-slate-300">
//                   {u.email}
//                 </td>

//                 <td className="py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium
//                       ${u.status === "active"
//                         ? "bg-green-600/20 text-green-400"
//                         : "bg-red-600/20 text-red-400"
//                       }
//                     `}
//                   >
//                     {u.status}
//                   </span>
//                 </td>

//                 <td className="py-4 text-right">
//                   <button
//                     onClick={() => toggleStatus(u.id, u.status)}
//                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition
//                       ${u.status === "active"
//                         ? "bg-red-600 hover:bg-red-700 text-white"
//                         : "bg-green-600 hover:bg-green-700 text-white"
//                       }
//                     `}
//                   >
//                     {u.status === "active" ? "Block" : "Unblock"}
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {users.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="text-center py-6 text-slate-400"
//                 >
//                   No users found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
