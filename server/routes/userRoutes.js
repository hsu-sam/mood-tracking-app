import express from 'express';
import { signup } from '../controllers/authController.js';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);

router.route('/').get(getUser).post(createUser);

router.route('/:id').patch(updateUser).delete(deleteUser);

export default router;
