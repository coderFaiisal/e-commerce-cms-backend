import { Schema, model } from 'mongoose';
import { ICart } from './cart.interface';

const cartSchema = new Schema<ICart>(
  {
    userEmail: { type: String, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Cart = model<ICart>('Cart', cartSchema);
