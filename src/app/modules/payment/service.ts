import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { sendEmail } from '../../../shared/sendEmail';
import { Notification } from '../notification/model';
import { Order } from '../order/model';
import { Profile, User } from '../user/model';
import { Subscription } from './../subscription/model';
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
      const updatedOrder = await Order.findByIdAndUpdate(
        updatedPayment.paymentForId,
        {
          isPaid: true,
        },
        { new: true },
      ).session(session);

      const isUserExist = await User.findById(updatedPayment.userId).session(
        session,
      );

      if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
      }

      const isProfileExist = await Profile.findOne({
        userId: updatedOrder?.userId,
      }).session(session);

      if (!isProfileExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile doesn't exist!");
      }

      await sendEmail(
        isUserExist.email,
        'Order Completed',
        `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Details</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #050315;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #fff;
                  border-radius: 10px;
                  border-color: 1px #000000;
                  overflow: hidden;
              }
              .header {
                  background-color: #007bff;
                  color: #fff;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
                min-height: 150px;
              }
      
              h1 {
                  color: #fff;
                font-size: 25px;
                  margin-top: 0;
              }
      
              p {
                  color: #000000;
              }
      
              .link-style{
                  display: inline-block;
                  background-color: #dedcff;
                  font-size: 13px;
                  text-decoration: none;
                  padding: 2px 6px;
                  border-radius: 5px;
                  transition: background-color 0.3s;
              }
              .link-style:hover {
                  background-color: #0056b3;
              }
              .footer {
                  background-color: #eaeaea;
                  color: #fff;
                  text-align: center;
                  font-size: 12px;
                  padding: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Order Details</h1>
              </div>
              <div class="content">
                  <p>Hello ${isProfileExist.name}</p>
                  <p>Your order is successfully completed. 
                  <ul>
                    <li>Total Cost: ${updatedOrder?.totalCost}</li>
                    <li>Transaction ID: ${response.tran_id}</li>
                    <li>Phone Number: ${updatedOrder?.phoneNumber}</li>
                    <li>Shipping Address: ${updatedOrder?.shippingAddress}</li>
                    <li>Order Status: ${updatedOrder?.orderStatus}</li>
                  </ul>
                  
                  <a class="link-style" href=${'https://ecommerce-cms.vercel.app/orders'}>click here...</a></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 E-commerce CMS. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      
      `,
      );

      const notificationData = {
        title: 'Order Payment',
        message: `You received order payment from ${isProfileExist.name}`,
        notificationFor: 'order',
        userId: isUserExist._id,
      };

      await Notification.create([notificationData], { session });
    }

    if (updatedPayment?.paymentFor === 'subscription') {
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        updatedPayment.paymentForId,
        {
          isActive: true,
          isPaid: true,
        },
        { new: true },
      ).session(session);

      const isUserExist = await User.findById(updatedPayment.userId).session(
        session,
      );

      if (!isUserExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
      }

      const isProfileExist = await Profile.findOne({
        userId: updatedSubscription?.userId,
      }).session(session);

      if (!isProfileExist) {
        throw new ApiError(httpStatus.NOT_FOUND, "Profile doesn't exist!");
      }

      await sendEmail(
        isUserExist.email,
        'Subscription Completed',
        `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Details</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #050315;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #fff;
                  border-radius: 10px;
                  border-color: 1px #000000;
                  overflow: hidden;
              }
              .header {
                  background-color: #007bff;
                  color: #fff;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
                min-height: 150px;
              }
      
              h1 {
                  color: #fff;
                font-size: 25px;
                  margin-top: 0;
              }
      
              p {
                  color: #000000;
              }
      
              .link-style{
                  display: inline-block;
                  background-color: #dedcff;
                  font-size: 13px;
                  text-decoration: none;
                  padding: 2px 6px;
                  border-radius: 5px;
                  transition: background-color 0.3s;
              }
              .link-style:hover {
                  background-color: #0056b3;
              }
              .footer {
                  background-color: #eaeaea;
                  color: #fff;
                  text-align: center;
                  font-size: 12px;
                  padding: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Subscription Details</h1>
              </div>
              <div class="content">
                  <p>Hello ${isProfileExist.name}</p>
                  <p>Your order is successfully completed. 
                  <ul>
                    <li>Subscription Plan: ${updatedSubscription?.plan}</li>
                    <li>Transaction ID: ${response.tran_id}</li>
                    <li>Total Cost: ${updatedPayment?.amount}</li>
                    <li>Expiration Date: ${updatedSubscription?.endTime}</li>
                  </ul>
                  
                  <a class="link-style" href=${'https://ecommerce-cms.vercel.app/subscription'}>click here...</a></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 E-commerce CMS. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      
      `,
      );

      const notificationData = {
        title: 'Subscription Payment',
        message: `You received subscription payment from ${isProfileExist.name}`,
        notificationFor: 'subscription',
        userId: isUserExist._id,
      };

      await Notification.create([notificationData], { session });
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
