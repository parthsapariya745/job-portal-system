const AuthService = require("../services/authService");
const AppError = require("../utils/AppError");
const OTP = require("../models/OTP");
const User = require("../models/User");
const crypto = require("crypto");

const register = async (req, res, next) => {
  try {
    console.log("Register request body:", req.body);

    // 1. Register User
    const user = await AuthService.register(req.body);

    // 2. Login immediately (Generate tokens)
    const { accessToken, refreshToken } = await AuthService.login(
      user.email,
      req.body.password,
    );

    // 3. Set Refresh Token Cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      status: "success",
      accessToken,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password,
    );

    // Set Refresh Token Cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      accessToken,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const requestToken = req.cookies.refreshToken;

    // Silent fail: If no token, just say "no access token" (200 OK)
    if (!requestToken) {
      return res.status(200).json({
        status: "success",
        accessToken: null,
      });
    }

    const result = await AuthService.refreshToken(requestToken);

    res.status(200).json({
      status: "success",
      accessToken: result.accessToken,
      data: { user: result.user },
    });
  } catch (error) {
    // Silent fail: If token validation fails (expired/invalid), just return null
    // This prevents 401/403 errors in the console/logs
    return res.status(200).json({
      status: "success",
      accessToken: null,
    });
  }
};

const logout = async (req, res, next) => {
  try {
    const requestToken = req.cookies.refreshToken;
    if (requestToken) {
      // Ideally remove from DB too, need AuthService.logout(token)
      // await AuthService.logout(requestToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to phone number
const sendOTP = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
      return next(new AppError("Please provide a valid 10-digit phone number", 400));
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phoneNumber });

    // Save new OTP
    await OTP.create({
      phoneNumber,
      otp,
    });

    // TODO: Integrate with SMS service like Twilio, Fast2SMS, etc.
    // For now, return OTP in response (development only)
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      // Remove otp field in production
      ...(process.env.NODE_ENV !== "production" && { otp }),
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP and login/register
const verifyOTP = async (req, res, next) => {
  try {
    const { phoneNumber, otp, name, aadharCard } = req.body;

    if (!phoneNumber || !otp) {
      return next(new AppError("Please provide phone number and OTP", 400));
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      phoneNumber,
      otp,
      verified: false,
    });

    if (!otpRecord) {
      return next(new AppError("Invalid OTP", 400));
    }

    if (otpRecord.expiresAt < new Date()) {
      return next(new AppError("OTP has expired", 400));
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    // If user doesn't exist, create new user (registration)
    if (!user) {
      if (!name || !aadharCard) {
        return next(new AppError("Name and Aadhar card required for registration", 400));
      }

      // Validate Aadhar
      if (!/^[0-9]{12}$/.test(aadharCard)) {
        return next(new AppError("Please provide a valid 12-digit Aadhar number", 400));
      }

      // Check if Aadhar already exists
      const existingAadhar = await User.findOne({ aadharCard });
      if (existingAadhar) {
        return next(new AppError("Aadhar number already registered", 400));
      }

      user = await User.create({
        name,
        phoneNumber,
        aadharCard,
        userType: "Non-Educated",
        role: "Job Seeker",
        password: crypto.randomBytes(16).toString("hex"), // Random password
        isVerified: true,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await AuthService.loginViaProvider(user);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      accessToken,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Register for Non-Educated users
const googleLogin = async (req, res, next) => {
  try {
    // req.user is already set by Passport
    const user = req.user;

    const { accessToken, refreshToken } = await AuthService.loginViaProvider(user);

    // Set Refresh Token Cookie
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Redirect to frontend
    res.redirect(
      `http://localhost:5173/auth/google/callback?token=${accessToken}`,
    );
  } catch (error) {
    next(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: \n ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      // Typically use nodemailer here to send email.
      // Since email setup might not be configured, log for now and simulate send
      console.log(message);
      
      res.status(200).json({
        status: "success",
        message: "Token sent to email! (Check backend console for link)",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // If token has not expired, and there is user, set new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    // Checking if new passwords match
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  googleLogin,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
