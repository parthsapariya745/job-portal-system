const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const createRefreshToken = async (userId) => {
    const expiredAt = new Date();
    expiredAt.setSeconds(
        expiredAt.getSeconds() + 7 * 24 * 60 * 60 // 7 days
    );
    
    // Generate random token
    const _token = crypto.randomUUID();
    
    const object = new RefreshToken({
        token: _token,
        user: userId,
        expires: expiredAt, // Changed from expiryDate to expires
    });
    
    const refreshToken = await object.save();
    return refreshToken.token;
};

class AuthService {
    async register(data) {
        const { name, email, password, role, companyProfile } = data;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }
        
        const user = await User.create({
            name,
            email,
            password,
            role,
            companyProfile
        });
        
        // Remove password from output
        user.password = undefined;
        return user;
    }

    async login(email, password) {
        if (!email || !password) {
            throw new AppError('Please provide email and password', 400);
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            throw new AppError('Incorrect email or password', 401);
        }

        const accessToken = signToken(user._id);
        const refreshToken = await createRefreshToken(user._id);

        return { user, accessToken, refreshToken };
    }

    async loginViaProvider(user) {
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const accessToken = signToken(user._id);
        const refreshToken = await createRefreshToken(user._id);

        return { user, accessToken, refreshToken };
    }

    async refreshToken(requestToken) {
        if (!requestToken) {
            throw new AppError('Refresh Token is required!', 403);
        }

        const tokenDoc = await RefreshToken.findOne({ token: requestToken });

        if (!tokenDoc) {
            throw new AppError('Refresh token is not in database!', 403);
        }

        if (tokenDoc.isExpired) {
            await RefreshToken.findByIdAndDelete(tokenDoc._id);
            throw new AppError('Refresh token was expired. Please make a new signin request', 403);
        }

        const user = await User.findById(tokenDoc.user);
        const newAccessToken = signToken(user._id);

        return {
            accessToken: newAccessToken,
            refreshToken: tokenDoc.token,
            user
        };
    }
}

module.exports = new AuthService();
