import { UserService } from '../database/user.service';
import { handleError } from '../../utils/errors/errorHandler';
import { toast } from 'react-hot-toast';
import { User } from '../../types/auth';

export class GoogleAuthService {
  static async handleGoogleLogin(tokenResponse: any): Promise<User | null> {
    try {
      // Get user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const data = await response.json();

      // Check if user exists
      let user = await UserService.getUserByEmail(data.email);

      if (user) {
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success('Welcome back!');
        return user;
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        mobile: '',
        role: 'user',
        isVerified: true,
        profileImage: data.picture,
        createdAt: new Date().toISOString()
      };

      const createdUser = await UserService.createUser(newUser);
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(createdUser));
      toast.success('Account created successfully!');
      return createdUser;
    } catch (error) {
      handleError(error);
      return null;
    }
  }
}