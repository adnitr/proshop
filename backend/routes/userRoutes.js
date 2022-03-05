import express from 'express';
import {
  authUser,
  getProfile,
  createUser,
  updateUserProfile,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = new express.Router();

router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateUserProfile);
router.route('/').post(createUser);

export default router;
