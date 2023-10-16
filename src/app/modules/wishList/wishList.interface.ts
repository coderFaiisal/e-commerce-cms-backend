import { Types } from 'mongoose';

export type IWishList = {
  userEmail: string;
  productId: Types.ObjectId;
};
