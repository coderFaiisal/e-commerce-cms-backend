import mongoose from 'mongoose';
import { Order } from '../order/model';
import { Subscription } from '../subscription/model';
import { Payment } from './model';
import { SSLService } from './ssl/service';
import { TOrderPaymentData, TSubscriptionPaymentData } from './ssl/type';

const initSubscriptionPayment = async (payload: TSubscriptionPaymentData) => {
  const initPaymentData = {
    amount: payload.amount,
    transactionId: payload.transactionId,
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    productCategory: payload?.productCategory,
  };

  const result = await SSLService.initSubscriptionPayment(initPaymentData);
  return {
    paymentUrl: result,
  };
};

const initOrderPayment = async (payload: TOrderPaymentData) => {
  const initPaymentData = {
    amount: payload.amount,
    transactionId: payload.transactionId,
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    shippingAddress: payload?.shippingAddress || 'N/A',
    deliveryMethod: payload?.deliveryMethod || 'N/A',
    productName: payload?.productName || 'N/A',
  };

  const result = await SSLService.initOrderPayment(initPaymentData);
  return {
    paymentUrl: result,
  };
};

const validatePayment = async (query: Record<string, unknown>) => {
  if (!query || !query.status || !(query.status === 'VALID')) {
    return {
      message: 'Invalid payment!',
    };
  }

  const response = await SSLService.validatePayment(query);

  if (response?.status !== 'VALID') {
    return {
      message: 'Payment failed!',
    };
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Payment.updateOne(
      { transactionId: response.tran_id },
      {
        status: 'paid',
        paymentGatewayData: response,
      },
    ).session(session);

    const updatedPayment = await Payment.findOne({
      transactionId: response.tran_id,
    }).session(session);

    if (updatedPayment?.paymentFor === 'order') {
      await Order.findByIdAndUpdate(updatedPayment.paymentForId, {
        isPaid: true,
      }).session(session);
    }

    if (updatedPayment?.paymentFor === 'subscription') {
      await Subscription.findByIdAndUpdate(updatedPayment.paymentForId, {
        isActive: true,
        isPaid: true,
      }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'Payment completed successfully.',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const PaymentService = {
  initSubscriptionPayment,
  initOrderPayment,
  validatePayment,
};

// ssl commerz ipn listener query
// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=progr6606bdd704623&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=490d86b8ac5faa016f695b60972a7fac&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
