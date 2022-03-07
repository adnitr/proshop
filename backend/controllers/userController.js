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

//@desc     Get all users
//@route    GET api/users
//@access   Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@desc     Delete a users
//@route    DELETE api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed!' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc     Get user by id
//@route    GET api/users/:id
//@access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@desc     Edit a users
//@route    PUT api/users/:id
//@access   Private/Admin
const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.isAdmin === false || req.body.isAdmin === true) {
      user.isAdmin = req.body.isAdmin;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  getProfile,
  createUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  editUser,
};
