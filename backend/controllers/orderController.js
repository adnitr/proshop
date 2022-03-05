import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

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
    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found!');
  }
});

export { addOrderItems, getOrderById };
