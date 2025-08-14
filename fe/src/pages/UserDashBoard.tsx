import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import StoreTable from "../component/StoreTable";
import { Role } from "../context/UserContext";
import { getAllstores } from "../service/storeService";
import { updatePassword } from "../service/userService";
import {getRatingsForUser } from "../service/ratingService"

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
  givenRating: number | null;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface RatingData {
  rating: number;
}

export default function UserDashBoard() {
  const { user } = {
    user: {
      userId: 1,
      name: "John Doe",
      email: "john@example.com",
      role: Role.STORE_OWNER,
      password: 12345678890,
    },
  }; //useUser();
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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [ratingData, setRatingData] = useState<RatingData>({
    rating: 5
  });
  const [ratingErrors, setRatingErrors] = useState<Partial<RatingData>>({});
  const [ratingUpdateCounter, setRatingUpdateCounter] = useState<number>(0);

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
      givenRating:null
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
      givenRating:null
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
      givenRating:null
    },
  ];

  // Fetch stores data
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        // const stores = await getAllstores();
        // const ratings=storeSortColumn?.map(async (st)=>{
        //     try{
        //         const abc=await getRatingsForUser(user.userId,st.storeId)
        //     return {
        //         ...st,
        //         givenRating:abc
        //     }
        //     }catch{
        //         return {
        //             ...st,
        //             givenRating:null
        //         }
        //     }
        // })
        setStoreData(mockStoreData);
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

  // Handle rating modal open
  const handleRatingModalOpen = (store: StoreData, isUpdate: boolean = false) => {
    setSelectedStore(store);
    if (isUpdate && store.givenRating) {
      setRatingData({
        rating: store.givenRating
      });
    } else {
      setRatingData({
        rating: 5
      });
    }
    setIsRatingModalOpen(true);
  };

  // Handle rating form changes
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'rating') {
      setRatingData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setRatingData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (ratingErrors[name as keyof RatingData]) {
      setRatingErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate rating form
  const validateRatingForm = (): boolean => {
    const newErrors: Partial<RatingData> = {};

    if (ratingData.rating < 1 || ratingData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setRatingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle rating submission
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateRatingForm() && selectedStore) {
      try {
        // TODO: Replace with actual API call
        // const response = await submitRating({
        //   userId: user.userId,
        //   storeId: selectedStore.storeId,
        //   rating: ratingData.rating,
        //   comment: ratingData.comment
        // });
        
        console.log('Rating submitted:', {
          userId: user.userId,
          storeId: selectedStore.storeId,
          rating: ratingData.rating
        });

        // Update local state
        setStoreData(prev => {
          const updatedData = prev.map(store => 
            store.storeId === selectedStore.storeId 
              ? { ...store, givenRating: ratingData.rating }
              : store
          );
          console.log('Updated store data:', updatedData);
          return updatedData;
        });

        // Reset form and close modal
        setRatingData({ rating: 5 });
        setRatingErrors({});
        setIsRatingModalOpen(false);
        setSelectedStore(null);
        
        // Force re-render of the table
        setRatingUpdateCounter(prev => prev + 1);

        alert('Rating submitted successfully!');
      } catch (err) {
        console.error('Error submitting rating:', err);
        alert('Failed to submit rating. Please try again.');
      }
    }
  };

  // Store table columns configuration
  const storeColumns = [
    { key: "storeId", label: "Store ID" },
    { key: "storeName", label: "Store Name" },
    { key: "address", label: "Address" },
    { key: "overallRating", label: "Rating" },
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
    {
        key: "givenRating",
        label: "Your Rating",
        render: (value: number | null, row: StoreData) => (
          <div>
            <div className="font-medium mb-2">
              {value ? `Rating: ${value}/5` : "No rating yet"}
            </div>
            {value ? (
              <button
                onClick={() => handleRatingModalOpen(row, true)}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
              >
                Update Rating
              </button>
            ) : (
              <button
                onClick={() => handleRatingModalOpen(row, false)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Add Rating
              </button>
            )}
          </div>
        ),
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
            Please log in to access the User dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Info Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                User Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">
                    {user.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <p className="text-gray-900">
                    {user.role === Role.USER
                      ? "User"
                      : user.role === Role.SYSTEM_ADMINISTRATOR
                      ? "System Administrator"
                      : user.role === Role.STORE_OWNER
                      ? "Store Owner"
                      : user.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>

      {/* Stores Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Stores</h2>
          <p className="text-gray-600 mt-1">Browse all stores in the system</p>
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

        {/* Stores Table */}
        {!loading && !error && (
          <StoreTable
            key={`stores-${ratingUpdateCounter}`}
            columns={storeColumns}
            data={processedStoreData}
            title=""
            sortColumn={storeSortColumn}
            sortDirection={storeSortDirection}
            onSort={handleStoreSort}
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
                  className="w-6 h-6"
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

      {/* Rating Modal */}
      {isRatingModalOpen && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedStore.givenRating ? 'Update Rating' : 'Add Rating'} - {selectedStore.storeName}
              </h2>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={ratingData.rating}
                  onChange={handleRatingChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    ratingErrors.rating ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
                {ratingErrors.rating && (
                  <p className="text-red-500 text-sm mt-1">{ratingErrors.rating}</p>
                )}
              </div>



              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {selectedStore.givenRating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
