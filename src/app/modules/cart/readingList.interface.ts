import { Types } from 'mongoose';

export type IReadingList = {
  userEmail: string;
  bookId: Types.ObjectId;
  status: 'reading' | 'read soon' | 'finished';
};
