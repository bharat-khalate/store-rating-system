import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { Role } from "../context/UserContext";
import { getAllstores } from "../service/storeService";
import { updatePassword } from "../service/userService";
import {
  getRatingsForUser,
  submitRating,
  updateRating,
} from "../service/ratingService";
import { useNavigate } from "react-router-dom";
import UserInfoCard from "../component/UserInfoCard";
import StoresSection from "../component/StoresSection";
import PasswordUpdateModal from "../component/PasswordUpdateModal";
import RatingModal from "../component/RatingModal";

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
  givenRating: { rating: number; ratingId: number } | null;
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
  const userContext = useUser();
  const user = userContext?.user;
  const setUser = userContext?.setUser;
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordUpdateData>>({});
  const [storeSortColumn, setStoreSortColumn] = useState<string>("");
  const [storeSortDirection, setStoreSortDirection] = useState<"asc" | "desc">("asc");
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [ratingUpdateModalOpen, setIsRatingUpdateModalOpen] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [ratingData, setRatingData] = useState<RatingData>({
    rating: 5,
  });
  const [ratingErrors, setRatingErrors] = useState<Partial<RatingData>>({});
  const [ratingUpdateCounter, setRatingUpdateCounter] = useState<number>(0);

  // Fetch stores data
  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const stores = await getAllstores();
              const ratings = await Promise.all(
          stores.data?.map(async (st: StoreData) => {
            try {
              const abc = await getRatingsForUser(user?.userId, st.storeId);
              console.log(abc);
              return {
                ...st,
                givenRating: abc.data[0],
              };
            } catch {
              return {
                ...st,
                givenRating: null,
              };
            }
          }) ?? []
        );

      console.log(ratings);
      setStoreData(ratings);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stores";
      setError(errorMessage);
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
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
          userId: user?.userId,
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        };
        await updatePassword(data);

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors({});
        setIsPasswordModalOpen(false);

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
        rating: store.givenRating.rating,
      });
    } else {
      setRatingData({
        rating: 5,
      });
    }
    setIsRatingModalOpen(true);
  };

  const handleRatingUpdateModalOpen = (store: StoreData, isUpdate: boolean = false) => {
    setSelectedStore(store);
    if (isUpdate && store.givenRating) {
      setRatingData({
        rating: store.givenRating.rating,
      });
    } else {
      setRatingData({
        rating: 5,
      });
    }
    setIsRatingUpdateModalOpen(true);
  };

  // Handle rating form changes
  const handleRatingChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const { name, value } = e.target;
              await updateRating({
          ratingId: selectedStore?.givenRating?.ratingId,
          rating: ratingData.rating,
        });

      if (name === "rating") {
        setRatingData((prev) => ({ ...prev, [name]: parseInt(value) }));
      } else {
        setRatingData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error when user starts typing
      if (ratingErrors[name as keyof RatingData]) {
        setRatingErrors((prev) => ({ ...prev, [name]: undefined }));
      }
      fetchStores();
    } catch (err: any) {
      console.error(err);
      alert("Failed to update rating");
    }
  };

  // Validate rating form
  const validateRatingForm = (): boolean => {
    const newErrors: Partial<RatingData> = {};

    if (ratingData.rating < 1 || ratingData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    setRatingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle rating submission
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateRatingForm() && selectedStore) {
      try {
        await submitRating({
          userId: user?.userId,
          storeId: selectedStore.storeId,
          rating: ratingData.rating,
        });

        console.log("Rating submitted:", {
          userId: user?.userId,
          storeId: selectedStore.storeId,
          rating: ratingData.rating,
        });

        // Update local state
        setStoreData((prev) => {
          const updatedData = prev.map((store) =>
            store.storeId === selectedStore.storeId
              ? { ...store, givenRating: ratingData.rating }
              : store
          );
          console.log("Updated store data:", updatedData);
          return updatedData;
        });

        // Reset form and close modal
        setRatingData({ rating: 5 });
        setRatingErrors({});
        setIsRatingModalOpen(false);
        setSelectedStore(null);

        // Force re-render of the table
        setRatingUpdateCounter((prev) => prev + 1);
        fetchStores();

        alert("Rating submitted successfully!");
      } catch (err) {
        console.error("Error submitting rating:", err);
        alert("Failed to submit rating. Please try again.");
      }
    }
  };

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
            <div className="flex gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setUser?.(null);
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserInfoCard user={user} />
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <StoresSection
        loading={loading}
        error={error}
        processedStoreData={processedStoreData}
        storeSortColumn={storeSortColumn}
        storeSortDirection={storeSortDirection}
        onStoreSort={handleStoreSort}
        ratingUpdateCounter={ratingUpdateCounter}
        onRatingModalOpen={handleRatingModalOpen}
        onRatingUpdateModalOpen={handleRatingUpdateModalOpen}
      />

      {/* Password Update Modal */}
      <PasswordUpdateModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        passwordData={passwordData}
        passwordErrors={passwordErrors}
        onPasswordChange={handlePasswordChange}
        onSubmit={handlePasswordUpdate}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        selectedStore={selectedStore}
        ratingData={ratingData}
        ratingErrors={ratingErrors}
        onRatingChange={(e) =>
          setRatingData((prev) => ({
            ...prev,
            rating: Number(e.target.value),
          }))
        }
        onSubmit={handleRatingSubmit}
        isUpdate={false}
      />

      {/* Rating Update Modal */}
      <RatingModal
        isOpen={ratingUpdateModalOpen}
        onClose={() => setIsRatingUpdateModalOpen(false)}
        selectedStore={selectedStore}
        ratingData={ratingData}
        ratingErrors={ratingErrors}
        onRatingChange={handleRatingChange}
        onSubmit={handleRatingChange}
        isUpdate={true}
      />
    </div>
  );
}
