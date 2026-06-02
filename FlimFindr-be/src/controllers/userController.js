const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload / replace avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete previous avatar file (best-effort)
    if (user.avatar) {
      const oldPath = path.join(__dirname, '..', '..', user.avatar.replace(/^\//, ''));
      fs.unlink(oldPath, () => {
        /* ignore — file may have already been removed */
      });
    }

    const publicPath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = publicPath;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar updated',
      avatar: publicPath,
      user: user.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove avatar
exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.avatar) {
      const oldPath = path.join(__dirname, '..', '..', user.avatar.replace(/^\//, ''));
      fs.unlink(oldPath, () => {});
      user.avatar = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Avatar removed',
      user: user.toObject(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
      });
    }

    const user = await User.findById(req.user.id);

    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist',
      });
    }

    user.watchlist.push(movieId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to watchlist',
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter((id) => id !== movieId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from watchlist',
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark as watched
exports.markAsWatched = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.watched.includes(movieId)) {
      user.watched.push(movieId);
    }

    // Remove from watchlist if present
    user.watchlist = user.watchlist.filter((id) => id !== movieId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Marked as watched',
      watched: user.watched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get watched movies
exports.getWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      watched: user.watched,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { preferredLanguages, favoriteGenres } = req.body;

    const user = await User.findById(req.user.id);

    if (preferredLanguages) {
      user.preferredLanguages = preferredLanguages;
    }

    if (favoriteGenres) {
      user.favoriteGenres = favoriteGenres;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguages: user.preferredLanguages,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, preferredLanguages, favoriteGenres, oldPassword, newPassword, confirmPassword } = req.body;

    const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ta', 'te', 'kn'];
    const validGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Adventure', 'Fantasy'];

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Validate name
    if (name !== undefined && name.length < 2) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters',
      });
    }

    // Validate email
    if (email !== undefined && email !== user.email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Invalid email format',
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already in use',
        });
      }
    }

    // Validate preferredLanguages
    if (preferredLanguages !== undefined) {
      if (!Array.isArray(preferredLanguages) || preferredLanguages.length < 3) {
        return res.status(400).json({
          message: 'Please select at least 3 languages',
        });
      }

      const invalidLanguages = preferredLanguages.filter((lang) => !validLanguages.includes(lang));
      if (invalidLanguages.length > 0) {
        return res.status(400).json({
          message: `Invalid language codes: ${invalidLanguages.join(', ')}`,
        });
      }
    }

    // Validate favoriteGenres
    if (favoriteGenres !== undefined) {
      if (!Array.isArray(favoriteGenres)) {
        return res.status(400).json({
          message: 'Favorite genres must be an array',
        });
      }

      const invalidGenres = favoriteGenres.filter((genre) => !validGenres.includes(genre));
      if (invalidGenres.length > 0) {
        return res.status(400).json({
          message: `Invalid genres: ${invalidGenres.join(', ')}`,
        });
      }
    }

    // Handle password change
    if (oldPassword) {
      if (!newPassword || !confirmPassword) {
        return res.status(400).json({
          message: 'New password and confirm password are required',
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: 'Passwords do not match',
        });
      }

      const userWithPassword = await User.findById(req.user.id).select('+password');
      const isPasswordCorrect = await userWithPassword.comparePassword(oldPassword);

      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (preferredLanguages !== undefined) user.preferredLanguages = preferredLanguages;
    if (favoriteGenres !== undefined) user.favoriteGenres = favoriteGenres;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguages: user.preferredLanguages,
        favoriteGenres: user.favoriteGenres,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
