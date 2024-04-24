import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,

    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

    reset_pass_expires_in: process.env.JWT_RESET_PASS_EXPIRES_IN,
  },
  resetlink: process.env.RESETLINK,
  user_email: process.env.USER_EMAIL,
  user_pass: process.env.USER_PASS,

  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,

    subscriptionSuccessUrl: process.env.SUBSCRIPTION_SUCCESS_URL,
    subscriptionCancelUrl: process.env.SUBSCRIPTION_CANCEL_URL,
    subscriptionFailUrl: process.env.SUBSCRIPTION_FAIL_URL,
    subscriptionIpnUrl: process.env.SUBSCRIPTION_IPN_URL,

    orderSuccessUrl: process.env.ORDER_SUCCESS_URL,
    orderCancelUrl: process.env.ORDER_CANCEL_URL,
    orderFailUrl: process.env.ORDER_FAIL_URL,
    orderIpnUrl: process.env.ORDER_IPN_URL,

    sslPaymentApi: process.env.SSL_PAYMENT_API,
    sslValidationApi: process.env.SSL_VALIDATIOIN_API,
  },

  init_order_payment_api_end_point:
    process.env.INIT_ORDER_PAYMENT_API_END_POINT,
  init_subscription_payment_api_end_point:
    process.env.INIT_SUBSCRIPTION_PAYMENT_API_END_POINT,
};
