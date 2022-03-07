import express from 'express';
import {
  authUser,
  getProfile,
  createUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  editUser,
  getUserById,
} from '../controllers/userController.js';
import protect, { admin } from '../middleware/authMiddleware.js';
const router = new express.Router();

router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateUserProfile);
router.route('/').get(protect, admin, getAllUsers).post(createUser);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, editUser);

export default router;
