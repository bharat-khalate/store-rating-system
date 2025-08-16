import React, { useState } from 'react';
import { Role } from '../context/UserContext';
import { data } from 'react-router-dom';

interface StoreFormData {
  storeName: string;
  address: string;
  owner: {
    name: string;
    email: string;
    password: string;
    role: Role;
  };
}

interface StoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (storeData: StoreFormData) => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    storeName: '',
    address: '',
    owner: {
      name: '',
      email: '',
      password: '',
      role: Role.STORE_OWNER
    }
  });
  const [errors, setErrors] = useState<Partial<StoreFormData & { ownerName: string; ownerEmail: string; ownerPassword: string; ownerRole: string }>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<StoreFormData & { ownerName: string; ownerEmail: string; ownerPassword: string; ownerRole: string }> = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.owner.name.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.owner.email.trim()) {
      newErrors.ownerEmail = 'Owner email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.owner.email)) {
      newErrors.ownerEmail = 'Owner email is invalid';
    }

    if (!formData.owner.password.trim()) {
      newErrors.ownerPassword = 'Owner password is required';
    } else if (formData.owner.password.length < 6) {
      newErrors.ownerPassword = 'Owner password must be at least 6 characters';
    }

    if (!formData.owner.role) {
      newErrors.ownerRole = 'Owner role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend={
      ...formData,
      user:formData.owner
    }

    dataToSend.user={
      ...dataToSend.user,
      address:dataToSend.address
    }
    
    if (validateForm()) {
      onSubmit(dataToSend);
      setFormData({ 
        storeName: '', 
        address: '', 
        owner: { name: '', email: '', password: '', role: Role.USER }
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('owner')) {
      const ownerField = name.replace('owner', '').toLowerCase() as keyof typeof formData.owner;
      
      if (name === 'ownerRole') {
        // Convert string value to Role enum for role field
        setFormData(prev => ({
          ...prev,
          owner: {
            ...prev.owner,
            role: value as Role
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          owner: {
            ...prev.owner,
            [ownerField]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create New Store</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
              Store Name *
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.storeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter store name"
            />
            {errors.storeName && (
              <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter store address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Name *
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.owner.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ownerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter owner name"
            />
            {errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Email *
            </label>
            <input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              value={formData.owner.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ownerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter owner email"
            />
            {errors.ownerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Password *
            </label>
            <input
              type="password"
              id="ownerPassword"
              name="ownerPassword"
              value={formData.owner.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ownerPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter owner password"
            />
            {errors.ownerPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerPassword}</p>
            )}
          </div>

          {/* <div>
            <label htmlFor="ownerRole" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Role *
            </label>
                         <select
               id="ownerRole"
               name="ownerRole"
               value={formData.owner.role}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.ownerRole ? 'border-red-500' : 'border-gray-300'
               }`}
             >
               <option value={Role.USER}>User</option>
               <option value={Role.SYSTEM_ADMINISTRATOR}>System Administrator</option>
               <option value={Role.STORE_OWNER}>Store Owner</option>
             </select>
            {errors.ownerRole && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerRole}</p>
            )}
          </div> */}

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
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;