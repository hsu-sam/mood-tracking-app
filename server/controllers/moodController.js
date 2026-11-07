import mongoose from 'mongoose';
import MoodEntry from '../models/moodModel.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import { getQuote } from '../utils/qoutes.js';
import { MOOD_LABELS, SLEEP_LABELS } from '../models/constants.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const invalidId = (res) => res.status(400).json({ error: 'Invalid id' });

const withLabels = (e) => ({
  ...e,
  moodLabel: MOOD_LABELS[String(e.mood)],
  sleepLabel: SLEEP_LABELS[String(e.sleepHours)],
});

const latestAllowedDate = () =>
  new Date(Date.now() + 14 * 3600 * 1000).toISOString().slice(0, 10);

// Average rounded to 2 decimals, or null for an empty list
const avg = (arr, key) =>
  arr.length
    ? Math.round((arr.reduce((sum, e) => sum + e[key], 0) / arr.length) * 100) /
      100
    : null;

// GET /api/moods?entryDate[gte]=2026-11-01&mood=1&sort=-entryDate&page=1&limit=20
export const getAllMoods = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    MoodEntry.find({ user: req.user._id }),
    req.query,
    {
      filterable: ['entryDate', 'mood', 'sleepHours', 'feelings'],
      defaultSort: '-entryDate',
    },
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const entries = await features.query.lean();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    results: entries.length,
    data: entries.map(withLabels),
  });
});

// POST /api/moods
export const createMood = catchAsync(async (req, res) => {
  const { entryDate, mood, feelings, sleepHours, journal } = req.body;

  if (!DATE_RE.test(entryDate || '')) {
    return res.status(400).json({ error: 'entryDate must be YYYY-MM-DD' });
  }
  if (entryDate > latestAllowedDate()) {
    return res.status(400).json({ error: 'entryDate cannot be in the future' });
  }

  try {
    const entry = await MoodEntry.create({
      user: req.user._id,
      entryDate,
      mood,
      feelings,
      sleepHours,
      journal,
    });

    res.status(201).json({
      entry: withLabels(entry.toObject()),
      quote: getQuote(entry.mood, entry.entryDate),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You already logged this day' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }
});

// GET /api/moods/today?date=YYYY-MM-DD
export const getToday = catchAsync(async (req, res) => {
  const { date } = req.query;
  if (!DATE_RE.test(date || '')) {
    return res.status(400).json({ error: 'date query must be YYYY-MM-DD' });
  }

  const entry = await MoodEntry.findOne({
    user: req.user._id,
    entryDate: date,
  }).lean();

  if (!entry) return res.status(200).json({ entry: null, quote: null });

  res.status(200).json({
    entry: withLabels(entry),
    quote: getQuote(entry.mood, entry.entryDate),
  });
});

// GET /api/moods/recent  (chart: latest 11, oldest to newest)
export const getRecent = catchAsync(async (req, res) => {
  const entries = await MoodEntry.find({ user: req.user._id })
    .sort({ entryDate: -1 })
    .limit(11)
    .lean();

  res.status(200).json({ results: entries.reverse().map(withLabels) });
});

// GET /api/moods/averages  (last 5 vs previous 5)
export const getAverages = catchAsync(async (req, res) => {
  const entries = await MoodEntry.find({ user: req.user._id })
    .sort({ entryDate: -1 })
    .limit(10)
    .lean();

  const current = entries.slice(0, 5);
  const previous = entries.slice(5, 10);

  res.status(200).json({
    current: {
      mood: avg(current, 'mood'),
      sleep: avg(current, 'sleepHours'),
      count: current.length,
    },
    previous: {
      mood: avg(previous, 'mood'),
      sleep: avg(previous, 'sleepHours'),
      count: previous.length,
    },
  });
});

// GET /api/moods/:id
export const getMood = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const entry = await MoodEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).lean();

  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  res.status(200).json({
    entry: withLabels(entry),
    quote: getQuote(entry.mood, entry.entryDate),
  });
});

// PATCH /api/moods/:id
export const updateMood = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const entry = await MoodEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  // Only these fields can change. user and entryDate are locked.
  for (const key of ['mood', 'feelings', 'sleepHours', 'journal']) {
    if (req.body[key] !== undefined) entry[key] = req.body[key];
  }

  try {
    await entry.save();
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    throw err;
  }

  res.status(200).json({
    entry: withLabels(entry.toObject()),
    quote: getQuote(entry.mood, entry.entryDate),
  });
});

// DELETE /api/moods/:id
export const deleteMood = catchAsync(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return invalidId(res);

  const entry = await MoodEntry.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!entry) return res.status(404).json({ error: 'Entry not found' });

  res.status(204).send();
});
