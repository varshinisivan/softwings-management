const express = require('express');
const router = express.Router();

const authorizeRoles = require('../Middleware/roleMiddleware');
const authMiddleware = require('../Middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} = require('../controllers/usercontroller');

// =====================
// Public Routes
// =====================
router.post('/login', loginUser);
router.post('/register', registerUser); // ← temporary, remove after first admin is created

// =====================
// Protected Routes
// =====================

// View All Users (Admin, Manager, Staff)
router.get('/', authMiddleware, authorizeRoles('admin', 'manager', 'staff'), getAllUsers);

// View Single User (Admin, Manager, Staff)
router.get('/:id', authMiddleware, authorizeRoles('admin', 'manager', 'staff'), getUserById);

// Update User (Admin & Manager only)
router.put('/:id', authMiddleware, authorizeRoles('admin', 'manager'), updateUser);

// Delete User (Admin & Manager only)
router.delete('/:id', authMiddleware, authorizeRoles('admin', 'manager'), deleteUser);

module.exports = router;