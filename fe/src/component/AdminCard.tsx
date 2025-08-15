import React from 'react';

interface AdminCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, value, icon, color = "bg-blue-500" }) => {
  return (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white min-w-[200px] max-w-[250px]`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        {icon && (
          <div className="text-3xl opacity-80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard;

