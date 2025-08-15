import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import AdminTable from "../component/AdminTable";
import { Role } from "../context/UserContext";
import { getAllstores } from "../service/storeService";
import { getUserById, updatePassword } from "../service/userService";
import { getRatingsByStoreID } from "../service/ratingService";
import { useNavigate } from "react-router-dom";

interface StoreData {
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
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface StoreRatingRow {
  userId: number;
  name: string;
  email: string;
  rating: number;
}

export default function StoreDashBoard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<PasswordUpdateData>
  >({});
  const [storeSortColumn, setStoreSortColumn] = useState<string>("");
  const [storeSortDirection, setStoreSortDirection] = useState<"asc" | "desc">(
    "asc"
  );
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [storeRatings, setStoreRatings] = useState<StoreRatingRow[]>([]);
  const [ratingSortColumn, setRatingSortColumn] = useState<string>("");
  const [ratingSortDirection, setRatingSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  // Mock store data for development
  const mockStoreData: StoreData[] = [
    {
      storeId: 1,
      storeName: "Tech Store",
      address: "123 Main St, City",
      overallRating: 4.5,
      owner: {
        userId: 1,
        name: "John Doe",
        email: "john@example.com",
        role: Role.STORE_OWNER,
      },
    },
    {
      storeId: 2,
      storeName: "Book Store",
      address: "456 Oak Ave, Town",
      overallRating: 4.2,
      owner: {
        userId: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: Role.STORE_OWNER,
      },
    },
    {
      storeId: 3,
      storeName: "Food Store",
      address: "789 Pine Rd, Village",
      overallRating: 4.8,
      owner: {
        userId: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: Role.STORE_OWNER,
      },
    },
  ];

  // Fetch stores data
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const stores = await getAllstores();
        console.log(stores.data);
        setStoreData(stores.data);

        // setStoreData(mockStoreData);

        // Pick the current owner's store if available, else first
        // console.log(storeData)
        // console.log(user)
        const current =
          stores.data.find((s) => s?.ownerId === user.userId) ||
          mockStoreData[0] ||
          null;
        // console.log(current)
        setSelectedStore(current);

        const storeRating = await getRatingsByStoreID(current.storeId);
        const storeRatingWithUser = await Promise.all(
          storeRating.data?.map(async (rating) => {
            const user = await getUserById(rating?.userId);
            return {
              ...rating,
              ...user.data[0],
            };
          }) ?? []
        );
        console.log("data", storeRatingWithUser);
        setStoreRatings(storeRatingWithUser);
        // Mock ratings for the selected store
        // if (current) {
        //   const mockRatings: StoreRatingRow[] = [
        //     { userId: 101, name: 'Alice Johnson', email: 'alice@example.com', rating: 5 },
        //     { userId: 102, name: 'Brian Lee', email: 'brian@example.com', rating: 4 },
        //     { userId: 103, name: 'Cathy Zhang', email: 'cathy@example.com', rating: 3 },
        //     { userId: 104, name: 'David Park', email: 'david@example.com', rating: 5 },
        //     { userId: 105, name: 'Elena Rossi', email: 'elena@example.com', rating: 4 }
        //   ];
        //   setStoreRatings(mockRatings);
        // }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch stores";
        setError(errorMessage);
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Handle store sorting
  const handleStoreSort = (column: string) => {
    if (storeSortColumn === column) {
      setStoreSortDirection(storeSortDirection === "asc" ? "desc" : "asc");
    } else {
      setStoreSortColumn(column);
      setStoreSortDirection("asc");
    }
  };

  // Sort store data
  const processedStoreData = useMemo(() => {
    let data = storeData;
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

  // Sort store ratings
  const processedRatings = useMemo(() => {
    let data = storeRatings;
    if (ratingSortColumn) {
      data = [...data].sort((a, b) => {
        const aValue = a[ratingSortColumn as keyof typeof a];
        const bValue = b[ratingSortColumn as keyof typeof b];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return ratingSortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return ratingSortDirection === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
    }
    return data;
  }, [storeRatings, ratingSortColumn, ratingSortDirection]);

  const handleRatingSort = (column: string) => {
    if (ratingSortColumn === column) {
      setRatingSortDirection(ratingSortDirection === "asc" ? "desc" : "asc");
    } else {
      setRatingSortColumn(column);
      setRatingSortDirection("asc");
    }
  };

  const renderStars = (value: number) => {
    const full = Math.round(value);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <svg
            key={idx}
            className={`w-4 h-4 ${
              idx < full ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.801 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.801-2.034a1 1 0 00-1.175 0l-2.801 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Password update validation
  const validatePasswordForm = (): boolean => {
    const newErrors: Partial<PasswordUpdateData> = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      try {
        const data = {
          userId: user.userId,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        };
        const res = await updatePassword(data);
        // console.log('Password update data:', passwordData);

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
        setIsPasswordModalOpen(false);

        // Show success message (you can add a toast notification here)
        alert("Password updated successfully!");
      } catch (err) {
        console.error("Error updating password:", err);
        alert("Failed to update password. Please try again.");
      }
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (passwordErrors[name as keyof PasswordUpdateData]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Ratings table columns configuration
  const ratingColumns = [
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => renderStars(value),
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Please log in to access the store dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Store Info Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Store Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setUser(null);
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Store Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <p className="text-gray-900">
                    {selectedStore?.storeName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {selectedStore?.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Overall Rating
                  </label>
                  <div className="flex items-center justify-center gap-2 ms-6">
                    {selectedStore
                      ? renderStars(selectedStore.overAllRating)
                      : "N/A"}
                    <span className="text-sm text-gray-600">
                      {selectedStore?.overAllRating?.toFixed(1) ?? ""}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Owner
                  </label>
                  <p className="text-gray-900">
                    {selectedStore
                      ? `${selectedStore.owner.name} (${selectedStore.owner.email})`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {processedRatings.length}
                  </div>
                  <div className="text-sm text-blue-600">Total Ratings</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {processedRatings.length > 0
                      ? (
                          processedRatings.reduce(
                            (sum, r) => sum + r.rating,
                            0
                          ) / processedRatings.length
                        ).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="text-sm text-green-600">Avg. User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Ratings Given By Users
          </h2>
          <p className="text-gray-600 mt-1">
            List of users who rated this store
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stores...</p>
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

        {/* Ratings Table */}
        {!loading && !error && (
          <AdminTable
            columns={ratingColumns}
            data={processedRatings}
            title=""
            sortColumn={ratingSortColumn}
            sortDirection={ratingSortDirection}
            onSort={handleRatingSort}
          />
        )}
      </div>

      {/* Password Update Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Password
              </h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-  6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password *
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.newPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
