import React from "react";

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  passwordData: PasswordUpdateData;
  passwordErrors: Partial<PasswordUpdateData>;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PasswordUpdateModal({
  isOpen,
  onClose,
  passwordData,
  passwordErrors,
  onPasswordChange,
  onSubmit
}: PasswordUpdateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Update Password
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
              onChange={onPasswordChange}
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
              onChange={onPasswordChange}
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
              onChange={onPasswordChange}
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
              onClick={onClose}
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
  );
}
