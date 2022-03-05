import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@desc     Auth user and get token
//@route    POST api/users/login
//@access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Incorrect email or password');
  }
});

//@desc     get user profile
//@route    GET api/users/profile
//@access   Private
const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(404);
    throw new Error('User not found');
  } else {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  }
});

//@desc     Create new user
//@route    POST api/users
//@access   Public
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error('Email already taken!');
  }
  try {
    const user = await new User({ name, email, password }).save();
    res.status(201);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400);
    throw new Error('Name, email and password fields are required');
  }
});

//@desc     Update user profile
//@route    PUT api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(404);
    throw new Error('User not found');
  } else {
    req.user.name = req.body.name || req.user.name;
    req.user.email = req.body.email || req.user.email;
    if (req.body.password) {
      req.user.password = req.body.password;
    }
    const updatedUser = await req.user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
});

export { authUser, getProfile, createUser, updateUserProfile };
