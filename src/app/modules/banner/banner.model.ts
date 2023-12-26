import { Schema, model } from 'mongoose';
import { BannerModel, IBanner } from './banner.interface';

const bannerSchema = new Schema<IBanner, BannerModel>(
  {
    label: { type: String, required: true },
    imageURL: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

export const Banner = model<IBanner, BannerModel>('Banner', bannerSchema);
