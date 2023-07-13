import customError from '../utils/customError.js';
import Order from '../model/orderModel.js';

const addOrderItems = async (req, res, next) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice
  } = req.body;
  if (orderItems && orderItems.length === 0) { 
    next(customError('No order items', 400))
  } else { 
    const order = new Order({
      orderItems: orderItems.map(x => ({
        ...x, 
        product: x._id, 
        _id: undefined,
      })),
      user: req.user._id, 
      shippingAddress,
      paymentMethod, 
      itemsPrice, 
      taxPrice, 
      shippingPrice,
      totalPrice,
    });
    
    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }

};

const getMyOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

const getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) { 
    res.status(200).json(order);
  } else { 
    next(customError('Order not found', 404));
  }
};

const updateOrderToPaid = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) { 
    order.isPaid = true; 
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id, 
      status: req.body.status, 
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address, 
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else { 
    next(customError('Order not found', 404));
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) { 
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else { 
    next(customError('Order not found for delivery', 404))
  }

};

const getOrders = async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.status(200).json(orders);
};

export { 
  addOrderItems, 
  getMyOrders, 
  getOrderById, 
  getOrders, 
  updateOrderToDelivered, 
  updateOrderToPaid, 
}