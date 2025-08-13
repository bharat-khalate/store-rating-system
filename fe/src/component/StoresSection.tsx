import React, { useState, useMemo } from "react";
import StoreTable from "./StoreTable";

interface StoreData {
  storeId: number | null;
  storeName: string;
  address: string;
  overallRating: number;
  owner: {
    userId: number | null;
    name: string;
    email: string;
    role: string;
  };
  givenRating: { rating: number; ratingId: number } | null;
}

interface StoresSectionProps {
  loading: boolean;
  error: string;
  processedStoreData: StoreData[];
  storeSortColumn: string;
  storeSortDirection: "asc" | "desc";
  onStoreSort: (column: string) => void;
  ratingUpdateCounter: number;
  onRatingModalOpen: (store: StoreData, isUpdate?: boolean) => void;
  onRatingUpdateModalOpen: (store: StoreData, isUpdate?: boolean) => void;
}

export default function StoresSection({
  loading,
  error,
  processedStoreData,
  storeSortColumn,
  storeSortDirection,
  onStoreSort,
  ratingUpdateCounter,
  onRatingModalOpen,
  onRatingUpdateModalOpen
}: StoresSectionProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchBy, setSearchBy] = useState<"name" | "location">("name");

  // Filter stores based on search
  const filteredStores = useMemo(() => {
    if (!searchTerm.trim()) return processedStoreData;
    
    return processedStoreData.filter((store) => {
      const searchValue = searchTerm.toLowerCase();
      
      if (searchBy === "name") {
        return store.storeName.toLowerCase().includes(searchValue);
      } else {
        return store.address.toLowerCase().includes(searchValue);
      }
    });
  }, [processedStoreData, searchTerm, searchBy]);

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
    {
      key: "givenRating",
      label: "Your Rating",
      render: (value: { rating: number; ratingId: number } | null, row: StoreData) => (
        <div>
          <div className="font-medium mb-2">
            {value?.rating ? `Rating: ${value.rating}/5` : "No rating yet"}
          </div>
          {value?.rating ? (
            <button
              onClick={() => onRatingUpdateModalOpen(row, true)}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
            >
              Update Rating
            </button>
          ) : (
            <button
              onClick={() => onRatingModalOpen(row, true)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              Add Rating
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Stores</h2>
        <p className="text-gray-600 mt-1">Browse all stores in the system</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Stores
            </label>
            <input
              type="text"
              id="search"
              placeholder={`Search by ${searchBy === "name" ? "store name" : "location"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="searchBy" className="block text-sm font-medium text-gray-700 mb-2">
              Search By
            </label>
            <select
              id="searchBy"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as "name" | "location")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Store Name</option>
              <option value="location">Location</option>
            </select>
          </div>
          <div className="sm:w-32 flex items-end">
            <button
              onClick={() => setSearchTerm("")}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Found {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} 
              {searchTerm && ` matching "${searchTerm}" in ${searchBy === "name" ? "store names" : "locations"}`}
            </p>
          </div>
        )}
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
          data={filteredStores}
          title=""
          sortColumn={storeSortColumn}
          sortDirection={storeSortDirection}
          onSort={onStoreSort}
        />
      )}
    </div>
  );
}
