import React from "react";

interface StoreData {
  storeId: number | null;
  storeName: string;
  address: string;
  overallRating: number;
  owner: {
    userId: number | null;
    name: string;
    email: string;
    role: any;
  };
  givenRating: any;
}

interface RatingData {
  rating: number;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: StoreData | null;
  ratingData: RatingData;
  ratingErrors: Partial<RatingData>;
  onRatingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdate?: boolean;
}

export default function RatingModal({
  isOpen,
  onClose,
  selectedStore,
  ratingData,
  ratingErrors,
  onRatingChange,
  onSubmit,
  isUpdate = false
}: RatingModalProps) {
  if (!isOpen || !selectedStore) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isUpdate ? "Update Rating" : "Add Rating"} - {selectedStore.storeName}
          </h2>
          <button
            onClick={onClose}
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating *
            </label>
            <select
              id="rating"
              name="rating"
              value={ratingData.rating}
              onChange={onRatingChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                ratingErrors.rating ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
            {ratingErrors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {ratingErrors.rating}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isUpdate ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
