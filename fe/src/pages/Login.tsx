import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser, Role } from "../context/UserContext";
import { login, register } from "../service/userService";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  email: string;
  name: string;
  address: string;
  password: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  address?: string;
  password?: string;
}

export default function Login() {
  const ctx = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState<SignupFormData>({
    email: "",
    name: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  if (ctx && ctx?.user) {
    return <Outlet />;
  }

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Address validation
  const validateAddress = (address: string): boolean => {
    return address.trim().length >= 5;
  };

  // Name validation
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(loginData.password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!signupData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!signupData.name) {
      newErrors.name = "Name is required";
    } else if (!validateName(signupData.name)) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!signupData.address) {
      newErrors.address = "Address is required";
    } else if (!validateAddress(signupData.address)) {
      newErrors.address = "Address must be at least 5 characters long";
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(signupData.password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    try {
      
     const user=await login(loginData);
      
      ctx?.setUser(user.data[0]);
    } catch (error: any) {
      console.error("Login failed:", error.message);
      window.alert("Login Failed: " + error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      const user=await register(signupData)
      

      
      ctx?.setUser(user.data[0]);
    } catch (error: any) {
      console.error("Signup failed:", error.message);
      window.alert("Signup failed: " + error.message);

    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formType: "login" | "signup"
  ) => {
    const { name, value } = e.target;
    
    if (formType === "login") {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {isLogin ? "Sign in to your account" : "Join us today"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => handleInputChange(e, "login")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => handleInputChange(e, "login")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  value={signupData.name}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  id="signup-address"
                  name="address"
                  type="text"
                  value={signupData.address}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}