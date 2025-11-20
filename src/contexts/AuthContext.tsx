import axios from 'axios';
import { AuthContextType, AuthState, User } from '@/types/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State uses AuthState
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (username: string, password: string) => {
    try {
      // 1. Loading state
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // 2. Send a POST request
      const response = await axios.post<{ token: string; user: User }>(
        'http://localhost:5000/api/auth/login',
        { username, password }
      );

      // 3. Extract data to get token
      const { token, user } = response.data;

      // 4. Store token in localStorage
      localStorage.setItem('token', token);

      // 5. Update state

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Reset loading state on error
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      // Re-throw error so Login component can handle it
      throw error;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      // 1. Loading state
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // 2. Send a POST request
      const response = await axios.post<{ token: string; user: User }>(
        'http://localhost:5000/api/auth/register',
        { email, username, password }
      );

      // 3. Extract data to get token
      const { token, user } = response.data;

      // 4. Store token in localStorage
      localStorage.setItem('token', token);

      // 5. Update state

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Reset loading state on error
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      // Re-throw error so Register component can handle it
      throw error;
    }
  };

  const logout = () => {
    // Remove token
    localStorage.removeItem('token');
    // Reset auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  useEffect(() => {
    // Check localStorage for token on mount
    const token = localStorage.getItem('token');

    if (token) {
      // Set loading state while fetching user data
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Fetch user info from backend to validate token
      axios
        .get<User>('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Token valid, restore full auth state
          setAuthState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        })
        .catch(() => {
          // Token invalid/expired, clear it
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
};
