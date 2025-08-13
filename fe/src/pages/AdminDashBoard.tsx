import React, { useState, useMemo, useEffect } from "react";
import AdminCard from "../component/AdminCard";
import AdminTable from "../component/AdminTable";
import StoreTable from "../component/StoreTable";
import UserForm from "../component/UserForm";
// import StoreForm from "../component/StoreForm";
import { addStores, getAllstores } from "../service/storeService";
import { getAllUsers, register } from "../service/userService";
import { Role, useUser } from "../context/UserContext";
import getAllRatings from "../service/ratingService";
import { useNavigate } from "react-router-dom";
import StoreForm from "../component/StoreForm"
// import { getAllstores } from '../service/storeService'; // Commented out for development
// import getAllRatings from '../service/ratingService'; // Commented out for development
// import { getAllUsers } from '../service/userService'; // Commented out for development

export default function AdminDashBoard() {
  const [selectedRole, setSelectedRole] = useState<string | Role>("all");
  const [userSortColumn, setUserSortColumn] = useState<string>("");
  const [userSortDirection, setUserSortDirection] = useState<"asc" | "desc">(
    "asc"
  );
  const [storeSortColumn, setStoreSortColumn] = useState<string>("");
  const [storeSortDirection, setStoreSortDirection] = useState<"asc" | "desc">(
    "asc"
  );
  const [tableData, setTableData] = useState<
    Array<{
      userId: number | null;
      name: string;
      email: string;
      role: Role;
    }>
  >([]);
  const [storeData, setStoreData] = useState<
    Array<{
      storeId: number | null;
      storeName: string;
      address: string;
      overallRating: number;
      owner: {
        userId: number | null;
        name: string;
        email: string;
        role: Role;
      };
    }>
  >([]);
  const [ratingData, setRatingData] = useState<
    Array<{ id: number; rating: number; comment: string }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);
  const [isStoreFormOpen, setIsStoreFormOpen] = useState<boolean>(false);
   const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Table columns configuration for users
  const tableColumns = [
    { key: "userId", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  // Table columns configuration for stores
  const storeColumns = [
    { key: "storeId", label: "Store ID" },
    { key: "storeName", label: "Store Name" },
    { key: "address", label: "Address" },
    { key: "overAllRating", label: "Rating" },
    {
      key: "owner",
      label: "Owner",
      render: (value: { name: string; email: string }) => (
        <div>
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-gray-500">{value.email}</div>
        </div>
      ),
    },
  ];
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const users = await getAllUsers(); // API call commented out
        const stores = await getAllstores();
        setStoreData(stores.data);
        const ratings = await getAllRatings();
        setRatingData(ratings.data);
        setTableData(users.data);
        // console.log(stores.data)
        // console.log(users.data)
        // console.log(ratings.data)
        // console.log("hii")
        // setStoreData(mockStoreData);
        // setTableData(mockUsers); // Using mock data instead
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Get unique roles for filter options
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(tableData.map((item) => item.role))];
    return roles;
  }, [tableData]);

  // Handle user sorting
  const handleUserSort = (column: string) => {
    if (userSortColumn === column) {
      setUserSortDirection(userSortDirection === "asc" ? "desc" : "asc");
    } else {
      setUserSortColumn(column);
      setUserSortDirection("asc");
    }
  };

  // Handle store sorting
  const handleStoreSort = (column: string) => {
    if (storeSortColumn === column) {
      setStoreSortDirection(storeSortDirection === "asc" ? "desc" : "asc");
    } else {
      setStoreSortColumn(column);
      setStoreSortDirection("asc");
    }
  };

  // Sort and filter user data
  const processedUserData = useMemo(() => {
    let data = tableData;

    // Apply role filter
    if (selectedRole !== "all") {
      data = data.filter((item) => item.role === selectedRole);
    }

    // Apply sorting
    if (userSortColumn) {
      data = [...data].sort((a, b) => {
        const aValue = a[userSortColumn as keyof typeof a];
        const bValue = b[userSortColumn as keyof typeof b];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return userSortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return userSortDirection === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return data;
  }, [tableData, selectedRole, userSortColumn, userSortDirection]);

  // Sort store data
  const processedStoreData = useMemo(() => {
    let data = storeData;

    // Apply sorting
    if (storeSortColumn) {
      data = [...data].sort((a, b) => {
        const aValue = a[storeSortColumn as keyof typeof a];
        const bValue = b[storeSortColumn as keyof typeof b];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return storeSortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return storeSortDirection === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return data;
  }, [storeData, storeSortColumn, storeSortDirection]);

  // Handle form submissions
  const handleAddUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => {
    try {
      const newUser = {
        ...userData,
      };
      const data = await register(newUser);
      console.log(data);
      setTableData((prev) => [...prev, data.data[0]]);
      console.log("New user data to send to API:", newUser);
    } catch (err: any) {
      console.error(err.message);
      window.alert(err.message);
    }
  };

  const handleAddStore = async (storeData: {
    storeName: string;
    address: string;
    owner: { name: string; email: string; password: string; role: Role };
  }) => {
    try {
      const newStore = {
        storeName: storeData.storeName,
        address: storeData.address,
        overallRating: 0,
        user: {
          ...storeData.owner,
          role: Role.STORE_OWNER,
          address: storeData.address,
        },
      };
      const data = await addStores(newStore);
      const users = await getAllUsers(); // API call commented out
      const stores = await getAllstores();
      setStoreData(stores.data);
      const ratings = await getAllRatings();
      setRatingData(ratings.data);
      setTableData(users.data);
      console.log("New store data to send to API:", newStore);
    } catch (err: any) {
      console.error(err.message);
      window.alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Cards Section */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-6">
          <AdminCard
            title="Total Users"
            value={tableData.length.toString()}
            color="bg-blue-500"
          />
          <AdminCard
            title="Active Stores"
            value={storeData?.length.toString()}
            color="bg-green-500"
          />
          <AdminCard
            title="Total Rating"
            value={ratingData?.length.toString()}
            color="bg-purple-500"
          />
        </div>
        <button
        onClick={() => {
          setUser(null);
          navigate("/");
        }}
        className="px-4 py-2 bg-red-500 h-10 ms-36 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
      </div>
      

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsUserFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New User
            </button>
            <label
              htmlFor="role-filter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Role:
            </label>
            <select
              id="role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role === Role.USER
                    ? "User"
                    : role === Role.SYSTEM_ADMINISTRATOR
                    ? "System Administrator"
                    : role === Role.STORE_OWNER
                    ? "Store Owner"
                    : role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* User Table */}
        {!loading && !error && (
          <>
            <AdminTable
              columns={tableColumns}
              data={processedUserData}
              title="User Management"
              sortColumn={userSortColumn}
              sortDirection={userSortDirection}
              onSort={handleUserSort}
            />

            {/* Store Table */}
            <div className="mt-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Store Management
                </h2>
                <button
                  onClick={() => setIsStoreFormOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add New Store
                </button>
              </div>
              <StoreTable
                columns={storeColumns}
                data={processedStoreData}
                title=""
                sortColumn={storeSortColumn}
                sortDirection={storeSortDirection}
                onSort={handleStoreSort}
              />
            </div>
          </>
        )}
      </div>

      {/* User Form Modal */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Store Form Modal */}
      <StoreForm
        isOpen={isStoreFormOpen}
        onClose={() => setIsStoreFormOpen(false)}
        onSubmit={handleAddStore}
      />
    </div>
  );
}
