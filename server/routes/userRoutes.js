import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  onboarding,
} from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protect);

router
  .route('/')
  .get(restrictTo('admin'), getAllUsers)
  .get(getUser)
  .post(createUser);
router.patch('/onboarding', onboarding);
router.patch('/update-me', updateMe);
router.patch('/update-password', updatePassword);
router.route('/:id').patch(updateUser).delete(restrictTo('admin'), deleteUser);

export default router;
