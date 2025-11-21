import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login: React.FC = () => {
  // ===== HOOKS =====
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { login } = useAuth();
  const navigate = useNavigate();

  // ===== STATE =====
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // ===== VALIDATION =====
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== FORM SUBMISSION =====
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: undefined }));

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      await login(email, password);
      // Login successful - redirect to previous page or home
      navigate(from);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {/* General error banner (API errors) */}
        {errors.general && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <strong>Error:</strong> {errors.general}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h1>

        {/* Email Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
            required
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link className="text-blue-600 hover:underline" to="/register">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
