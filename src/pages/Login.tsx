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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* General error banner (API errors) */}
        {errors.general && (
          <div className="error-banner" role="alert">
            <strong>Error:</strong> {errors.general}
          </div>
        )}

        <h1>Login</h1>

        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your email"
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
            required
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? (
            <>
              <span className="spinner"></span>Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        {/* Register Link */}
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;