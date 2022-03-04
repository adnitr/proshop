import express from 'express';
import {
  authUser,
  getProfile,
  createUser,
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = new express.Router();

router.route('/login').post(authUser);
router.route('/profile').get(protect, getProfile);
router.route('/').post(createUser);

export default router;
