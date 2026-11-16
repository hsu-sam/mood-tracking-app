import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to access all users', 403),
    );
  }

  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You can't update your password here.", 400));
  }

  const filteredBody = filterObj(req.body, 'fullName');

  if (
    req.body.fullName !== undefined &&
    typeof req.body.fullName !== 'string'
  ) {
    return next(new AppError('fullName must be a string', 400));
  }

  if (req.body.photo !== undefined) {
    if (
      typeof req.body.photo !== 'string' ||
      !/^https:\/\/.+/.test(req.body.photo)
    ) {
      return next(new AppError('photo must be an https URL', 400));
    }
    filteredBody.photo = req.body.photo;
  }

  if (req.file) {
    filteredBody.photo = `/img/users/${req.file.filename}`;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser.toProfile(),
    },
  });
});

export const getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user.toProfile(),
    },
  });
};

export const deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to delete users', 403),
    );
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).send();
});
