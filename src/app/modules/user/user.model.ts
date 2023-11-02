/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, Types, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String },
    phoneNumber: { type: String },
    image: { type: String },
    reviews: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        review: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await User.findOne({ email }).select('+password').lean();
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
