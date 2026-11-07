import mongoose from 'mongoose';
import {
  FEELINGS,
  MOOD_VALUES,
  SLEEP_VALUES,
  MOOD_LABELS,
  SLEEP_LABELS,
} from './constants.js';

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An entry must belong to a user'],
    },
    entryDate: {
      type: String,
      required: [true, 'entryDate is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'entryDate must be YYYY-MM-DD'],
    },
    mood: {
      type: Number,
      required: [true, 'mood is required'],
      validate: {
        validator: (v) => MOOD_VALUES.includes(v),
        message: 'mood must be one of -2, -1, 0, 1, 2',
      },
    },
    feelings: {
      type: [{ type: String, enum: FEELINGS }],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 3,
        message: 'Choose 1 to 3 feelings',
      },
    },
    sleepHours: {
      type: Number,
      required: [true, 'sleepHours is required'],
      validate: {
        validator: (v) => SLEEP_VALUES.includes(v),
        message: 'sleepHours must be one of 1, 3.5, 5.5, 7.5, 9',
      },
    },
    journal: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'journal cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

moodSchema.index({ user: 1, entryDate: -1 }, { unique: true });

moodSchema.virtual('moodLabel').get(function () {
  return MOOD_LABELS[String(this.mood)];
});

moodSchema.virtual('sleepLabel').get(function () {
  return SLEEP_LABELS[String(this.sleepHours)];
});

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;
