import express from 'express';
import { signup, login } from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).get(getUser).post(createUser);

router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
