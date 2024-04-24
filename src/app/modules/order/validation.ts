import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required.',
    }),
    orderStatus: z
      .enum(['pending', 'processing', 'delivered', 'cancel'] as [
        string,
        ...string[],
      ])
      .optional(),
    discounts: z.number().optional(),
    totalCost: z.number({
      required_error: 'Total cost is required.',
    }),
    shippingCharge: z.number({
      required_error: 'Shipping charge is required.',
    }),
    shippingAddress: z.string({
      required_error: 'Shipping address is required.',
    }),
    deliveryMethod: z.string({
      required_error: 'Delivery method is required.',
    }),
    trackingNumber: z.string().optional(),
    giftMessage: z.string().optional(),

    userId: z.string().optional(),
    storeId: z.string({
      required_error: 'Store id is required.',
    }),

    orderItems: z.array(
      z.object({
        quantity: z.number({
          required_error: 'Quantity is required.',
        }),
        productId: z.string({
          required_error: 'Product id required.',
        }),

        orderId: z.string().optional(),
      }),
    ),
  }),
});

const updateSchema = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    orderStatus: z
      .enum(['pending', 'processing', 'delivered', 'cancel'] as [
        string,
        ...string[],
      ])
      .optional(),
    shippingAddress: z.string().optional(),
    deliveryMethod: z.string().optional(),
    giftMessage: z.string().optional(),
  }),
});

export const OrderValidation = {
  createSchema,
  updateSchema,
};
