import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../config/env';

class AuthService {
  async login(email: string, password: string) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    if (!user.isActive) {
      throw { statusCode: 403, message: 'Account is deactivated. Contact administrator.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token hash in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
      
      const user = await User.findById(decoded.userId).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
        throw { statusCode: 401, message: 'Invalid refresh token' };
      }

      if (!user.isActive) {
        throw { statusCode: 403, message: 'Account is deactivated' };
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);
      
      // Rotate refresh token
      const newRefreshToken = this.generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw { statusCode: 401, message: 'Invalid refresh token' };
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
  }

  private generateAccessToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
  }

  private generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );
  }
}

export const authService = new AuthService();
