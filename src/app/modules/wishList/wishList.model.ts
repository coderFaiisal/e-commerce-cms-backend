import { model, Schema } from 'mongoose';
import { IWishList } from './wishList.interface';

const wishListSchema = new Schema<IWishList>({
  userEmail: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

export const WishList = model<IWishList>('WishList', wishListSchema);
