const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  validateStep1Fields,
  validateStep2Fields,
  validateStep3Fields,
} = require('../utils/signupValidators');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, preferredLanguages, favoriteGenres } = req.body;

    // Validate Step 1 fields
    const step1Result = validateStep1Fields({
      name,
      email,
      password,
      confirmPassword: password,
    });
    if (!step1Result.isValid) {
      return res.status(422).json({ success: false, errors: step1Result.errors });
    }

    // Validate Step 2 fields
    const step2Result = validateStep2Fields({ preferredLanguages });
    if (!step2Result.isValid) {
      return res.status(422).json({ success: false, errors: step2Result.errors });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(422).json({
        success: false,
        errors: { email: 'Email already registered' },
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      preferredLanguages: preferredLanguages || ['en'],
      favoriteGenres: favoriteGenres || [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguages: user.preferredLanguages,
        favoriteGenres: user.favoriteGenres,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguages: user.preferredLanguages,
        favoriteGenres: user.favoriteGenres,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Validate signup step
exports.validateStep = async (req, res) => {
  try {
    const { step, data } = req.body;

    if (!step || !data) {
      return res.status(400).json({
        success: false,
        message: 'step and data are required',
      });
    }

    let result;

    switch (step) {
      case 1: {
        result = validateStep1Fields(data);
        if (!result.isValid) {
          return res.status(422).json({ success: false, errors: result.errors });
        }

        const existingUser = await User.findOne({
          email: data.email.trim().toLowerCase(),
        });
        if (existingUser) {
          return res.status(422).json({
            success: false,
            errors: { email: 'This email is already registered' },
          });
        }
        break;
      }
      case 2: {
        result = validateStep2Fields(data);
        if (!result.isValid) {
          return res.status(422).json({ success: false, errors: result.errors });
        }
        break;
      }
      case 3: {
        result = validateStep3Fields();
        break;
      }
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid step number',
        });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
