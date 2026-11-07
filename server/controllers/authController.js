import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user: newUser,
    },
  });
});
