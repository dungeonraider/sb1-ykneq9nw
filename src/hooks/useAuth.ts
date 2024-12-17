import { useState } from 'react';
import { User, RegisterFormData } from '../types/auth';
import { UserService } from '../services/database/user.service';
import { AuthService } from '../services/auth/auth.service';
import { toast } from 'react-hot-toast';
import { handleError } from '../utils/errors/errorHandler';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await AuthService.registerUser(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Store user in localStorage and state
      localStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      toast.success('Login successful');
      return user;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };
};