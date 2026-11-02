exports.FEELINGS = [
  'Joyful',
  'Motivated',
  'Hopeful',
  'Grateful',
  'Calm',
  'Peaceful',
  'Down',
  'Tired',
  'Disappointed',
  'Frustrated',
  'Excited',
  'Content',
  'Overwhelmed',
  'Lonely',
  'Irritable',
  'Optimistic',
  'Confident',
  'Anxious',
];

exports.MOODS = {
  VERY_SAD: -2,
  SAD: -1,
  NEUTRAL: 0,
  HAPPY: 1,
  VERY_HAPPY: 2,
};

exports.MOOD_LABELS = {
  '-2': 'Very Sad',
  '-1': 'Sad',
  0: 'Neutral',
  1: 'Happy',
  2: 'Very Happy',
};

exports.SLEEP_LABELS = {
  1: '0-2 hours',
  3.5: '3-4 hours',
  5.5: '5-6 hours',
  7.5: '7-8 hours',
  9: '9+ hours',
};

exports.MOOD_VALUES = Object.values(exports.MOODS);
exports.SLEEP_VALUES = [1, 3.5, 5.5, 7.5, 9];
