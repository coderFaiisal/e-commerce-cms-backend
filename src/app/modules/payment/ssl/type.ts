export type TSubscriptionPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  phoneNumber: string;
  productCategory: string | null;
};

export type TOrderPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  deliveryMethod: string;
  productName?: string | null;
};
