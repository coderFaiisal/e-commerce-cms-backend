import { z } from 'zod';

const createBillboardZodSchema = z.object({
  body: z.object({
    label: z.string({
      required_error: 'Billboard label is required',
    }),
    imageURL: z.string({
      required_error: 'Image url is required',
    }),
    storeId: z.string({
      required_error: 'Store id is required',
    }),
    categories: z.array(z.string()).optional(),
  }),
});

export const BillboardValidation = {
  createBillboardZodSchema,
};
