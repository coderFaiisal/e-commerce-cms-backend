/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, Types, model } from 'mongoose';
import config from '../../../config';
import { ProfileModel, TProfile, TUser, UserModel } from './type';

const userSchema = new Schema<TUser, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExist = async function (
  email: string,
): Promise<TUser | null> {
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

const User = model<TUser, UserModel>('User', userSchema);

const profileSchema = new Schema<TProfile, ProfileModel>(
  {
    name: { type: String, required: true },
    image: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    dob: { type: String },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

const Profile = model<TProfile, ProfileModel>('Profile', profileSchema);

export { Profile, User };
