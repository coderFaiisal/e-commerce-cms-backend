import { Types } from 'mongoose';

export type ICart = {
  userEmail: string;
  products: {
    productId: Types.ObjectId;
    quantity: string;
  }[];
};
