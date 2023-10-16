import { z } from 'zod';

const createReadingListZodSchema = z.object({
  body: z.object({
    userEmail: z.string({
      required_error: 'User email is required',
    }),
    bookId: z.string({
      required_error: 'Book is required',
    }),
    status: z
      .enum(['reading', 'read soon', 'finished'] as [string, ...string[]])
      .optional(),
  }),
});

const updateReadingListZodSchema = z.object({
  body: z.object({
    status: z.enum(
      ['reading', 'read soon', 'finished'] as [string, ...string[]],
      {
        required_error: 'Status is required',
      },
    ),
  }),
});

export const ReadingListValidation = {
  createReadingListZodSchema,
  updateReadingListZodSchema,
};
