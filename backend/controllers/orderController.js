import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

//@desc     Create new order
//@route    POST /api/orders
//@access   Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('The order must contain items.');
  } else {
    const createdOrder = await new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    }).save();
    res.status(201).json(createdOrder);
  }
});

//@desc     Get order by ID
//@route    GET /api/orders/:id
//@access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

//@desc     Update order to paid
//@route    PUT /api/orders/:id/pay
//@access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

//@desc     GET user orders
//@route    GET /api/orders/myorders
//@access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  });
  res.json(orders);
});

//@desc     GET all orders
//@route    GET /api/orders
//@access   Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

//@desc     Update order to delivered
//@route    PUT /api/orders/:id/deliver
//@access   Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
};
