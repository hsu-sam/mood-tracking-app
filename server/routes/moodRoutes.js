import express from 'express';
import {
  getAllMoods,
  createMood,
  getToday,
  getRecent,
  getAverages,
  getMood,
  updateMood,
  deleteMood,
} from '../controllers/moodController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllMoods).post(createMood);
router.get('/today', getToday);
router.get('/recent', getRecent);
router.get('/averages', getAverages);
router
  .route('/:id')
  .get(getMood)
  .patch(restrictTo('admin'), updateMood)
  .delete(restrictTo('admin'), deleteMood);

export default router;
