import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required.',
    }),
    price: z.number({
      required_error: 'Price is required.',
    }),
    productImages: z.array(
      z.object({
        url: z.string({ required_error: 'Image url required.' }),
      }),
    ),
    productCode: z.string().optional(),
    description: z.string({
      required_error: 'Description is required.',
    }),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    status: z.enum(['stock', 'stock out'] as [string, ...string[]], {
      required_error: 'Status is required.',
    }),
    stockQuantity: z.number({
      required_error: 'Stock quantity is required.',
    }),
    discounts: z.number().optional(),
    returnPolicy: z.string().optional(),

    storeId: z.string({
      required_error: 'Store id is required.',
    }),
    categoryId: z.string({
      required_error: 'Category id is required.',
    }),
    attributeIds: z.array(
      z.string({
        required_error: 'Attribute id is required.',
      }),
    ),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    status: z.string().optional(),
    stockQuantity: z.number().optional(),
    discounts: z.number().optional(),
    returnPolicy: z.string().optional(),
    attributeIds: z.array(z.string().optional()).optional(),
  }),
});

export const ProductValidation = {
  createSchema,
  updateSchema,
};
