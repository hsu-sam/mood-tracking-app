import express from 'express';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs';
import multer from 'multer';
import AppError from '../utils/appError.js';
import { fileURLToPath } from 'node:url';
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
  deleteUser,
  updateMe,
  getMe,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const uploadDirectory = fileURLToPath(
  new URL('../public/img/users/', import.meta.url),
);
const allowedPhotoTypes = new Set(['image/jpeg', 'image/png']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      mkdir(uploadDirectory, { recursive: true }, (error) =>
        callback(error, uploadDirectory),
      );
    },
    filename: (req, file, callback) => {
      const extension = file.mimetype === 'image/png' ? '.png' : '.jpg';
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: {
    fileSize: 250 * 1024,
    files: 1,
    fields: 2,
    fieldNameSize: 100,
    fieldSize: 10 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedPhotoTypes.has(file.mimetype)) {
      return callback(new AppError('Photo must be a PNG or JPEG image', 400));
    }
    callback(null, true);
  },
});

const uploadPhoto = (req, res, next) => {
  upload.single('photo')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'Photo must not exceed 250KB'
          : 'Unable to upload photo';
      return next(new AppError(message, 400));
    }
    next(error);
  });
};

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protect);

router.route('/').get(restrictTo('admin'), getAllUsers);
router.get('/me', getMe);
router.patch('/onboarding', onboarding);
router.patch('/update-me', uploadPhoto, updateMe);
router.patch('/update-password', updatePassword);
router.route('/:id').delete(restrictTo('admin'), deleteUser);

export default router;
