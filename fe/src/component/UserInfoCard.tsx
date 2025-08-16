import React from "react";
import { Role } from "../context/UserContext";

interface UserInfoCardProps {
  user: {
    name: string;
    email: string;
    role: Role;
    address?: string;
  };
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const getRoleDisplayName = (role: Role) => {
    switch (role) {
      case Role.USER:
        return "User";
      case Role.SYSTEM_ADMINISTRATOR:
        return "System Administrator";
      case Role.STORE_OWNER:
        return "Store Owner";
      default:
        return role;
    }
  };

  return (
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
            {getRoleDisplayName(user.role)}
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
  );
}
