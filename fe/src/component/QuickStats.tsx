import React from "react";

interface StoreRatingRow {
  userId: number;
  name: string;
  email: string;
  rating: number;
}

interface QuickStatsProps {
  processedRatings: StoreRatingRow[];
}

export default function QuickStats({ processedRatings }: QuickStatsProps) {
  const averageRating = processedRatings.length > 0
    ? (processedRatings.reduce((sum, r) => sum + r.rating, 0) / processedRatings.length).toFixed(1)
    : "0.0";

  return (
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
            {averageRating}
          </div>
          <div className="text-sm text-green-600">Avg. User Rating</div>
        </div>
      </div>
    </div>
  );
}
