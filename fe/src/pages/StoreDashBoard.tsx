import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { Role } from "../context/UserContext";
import { getAllstores } from "../service/storeService";
import { getUserById, updatePassword } from "../service/userService";
import { getRatingsByStoreID } from "../service/ratingService";
import { useNavigate } from "react-router-dom";
import StoreInfoCard from "../component/StoreInfoCard";
import QuickStats from "../component/QuickStats";
import PasswordUpdateModal from "../component/PasswordUpdateModal";
import RatingsSection from "../component/RatingsSection";
import StarRating from "../component/StarRating";

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
  const userContext = useUser();
  const user = userContext?.user;
  const setUser = userContext?.setUser;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordUpdateData>>({});
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [storeRatings, setStoreRatings] = useState<StoreRatingRow[]>([]);
  const [ratingSortColumn, setRatingSortColumn] = useState<string>("");
  const [ratingSortDirection, setRatingSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch stores data
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const stores = await getAllstores();
        console.log(stores.data);


        const current = stores.data.find((s: StoreData) => s?.owner?.userId === user?.userId) || null;
        setSelectedStore(current);

        if (current) {
          const storeRating = await getRatingsByStoreID(current.storeId);
          const storeRatingWithUser = await Promise.all(
            storeRating.data?.map(async (rating: { userId: number }) => {
              const user = await getUserById(rating?.userId);
              return {
                ...rating,
                ...user.data[0],
              };
            }) ?? []
          );
          console.log("data", storeRatingWithUser);
          setStoreRatings(storeRatingWithUser);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch stores";
        setError(errorMessage);
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);



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

  const renderStars = (value: number) => <StarRating value={value} />;

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
            <StoreInfoCard selectedStore={selectedStore} renderStars={renderStars} />
            <QuickStats processedRatings={processedRatings} />
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <RatingsSection
        loading={loading}
        error={error}
        processedRatings={processedRatings}
        ratingSortColumn={ratingSortColumn}
        ratingSortDirection={ratingSortDirection}
        onRatingSort={handleRatingSort}
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
    </div>
  );
}
