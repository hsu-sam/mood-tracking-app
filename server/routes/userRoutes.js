import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password:token', resetPassword);

router.use(protect);

router
  .route('/')
  .get(restrictTo('admin'), getAllUsers)
  .get(getUser)
  .post(createUser);
router.route('/:id').patch(updateUser).delete(restrictTo('admin'), deleteUser);

export default router;
