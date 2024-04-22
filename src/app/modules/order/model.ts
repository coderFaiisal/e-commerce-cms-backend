import { Schema, model } from 'mongoose';
import { OrderItemModel, OrderModel, TOrder, TOrderItem } from './type';

const orderSchema = new Schema<TOrder, OrderModel>(
  {
    isPaid: { type: Boolean, required: true },
    phoneNumber: { type: String, required: true },
    orderStatus: { type: String, default: 'pending' },
    discounts: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    deliveryMethod: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    giftMessage: { type: String },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  },
  {
    timestamps: true,
  },
);

const orderItemSchema = new Schema<TOrderItem, OrderItemModel>({
  quantity: { type: Number, required: true },

  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
});

export const Order = model<TOrder, OrderModel>('Order', orderSchema);

export const OrderItem = model<TOrderItem, OrderItemModel>(
  'OrderItem',
  orderItemSchema,
);
