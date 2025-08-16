import React from "react";
import { Role } from "../context/UserContext";

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

interface StoreInfoCardProps {
  selectedStore: StoreData | null;
  renderStars: (value: number) => React.ReactNode;
}

export default function StoreInfoCard({ selectedStore, renderStars }: StoreInfoCardProps) {
  return (
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
  );
}
