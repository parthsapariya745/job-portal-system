const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, googleLogin, sendOTP, verifyOTP, forgotPassword, resetPassword } = require('../controllers/authController');
const passport = require('passport');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { registerSchema, loginSchema } = require('../validators/joiSchemas');

// Simple test route without any middleware
router.post('/register-simple', async (req, res) => {
    try {
        console.log('Simple register called with:', req.body);
        res.json({ message: 'Simple register working', body: req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Phone + OTP Routes for Non-Educated users
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    googleLogin
);

module.exports = router;
