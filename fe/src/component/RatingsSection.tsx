import React from "react";
import AdminTable from "./AdminTable";
import StarRating from "./StarRating";

interface StoreRatingRow {
  userId: number;
  name: string;
  email: string;
  rating: number;
}

interface RatingsSectionProps {
  loading: boolean;
  error: string;
  processedRatings: StoreRatingRow[];
  ratingSortColumn: string;
  ratingSortDirection: "asc" | "desc";
  onRatingSort: (column: string) => void;
}

export default function RatingsSection({
  loading,
  error,
  processedRatings,
  ratingSortColumn,
  ratingSortDirection,
  onRatingSort
}: RatingsSectionProps) {
  const ratingColumns = [
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => <StarRating value={value} />,
    },
  ];

  return (
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
          onSort={onRatingSort}
        />
      )}
    </div>
  );
}
