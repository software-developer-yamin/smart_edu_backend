import httpStatus from 'http-status';
// eslint-disable-next-line import/no-extraneous-dependencies
import SSLCommerzPayment from 'sslcommerz-lts';
import mongoose from 'mongoose';
import Payment from './payment.model';
import { IPayment, IPaymentDoc, PaymentStatus } from './payment.interfaces';
import config from '../../config/config';
import ApiError from '../errors/ApiError';
import { IPaginateOptions, IQueryResult } from '../paginate/paginate';
import { userService } from '../user';
import { feeService } from '../fee';
import PaymentPDFGenerator from '../utils/PaymentPDFGenerator';

const sslcommerz = new SSLCommerzPayment(config.sslcommerz.storeId, config.sslcommerz.storePass, false);

const formatSSLCommerzData = async (userId: mongoose.Types.ObjectId) => {
  const user = await userService.getUserById(userId);
  const fee = await feeService.getFeeByUserId(userId);
  const transactionId = new mongoose.Types.ObjectId().toString();
  return {
    total_amount: fee?.totalAmount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.baseUrl}/payments/${transactionId}/success`,
    fail_url: `${config.baseUrl}/payments/${transactionId}/failed`,
    cancel_url: `${config.baseUrl}/api/v1/payment/cancel`,
    ipn_url: `${config.baseUrl}/api/v1/payment/ipn`,
    shipping_method: 'NO',
    product_name: `School Fee - Class ${user?.class}`,
    product_category: 'Education',
    product_profile: 'non-physical-goods',
    cus_name: user?.name,
    cus_email: user?.email,
    cus_add1: user?.address,
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: user?.phoneNumber,
    value_a: user?.id,
    value_b: fee?.id,
  };
};

/**
 * Create a payment
 * @param {IPaymentUser} paymentBody
 * @returns {Promise<IPaymentDoc>}
 */
export const createPayment = async (userId: mongoose.Types.ObjectId): Promise<IPaymentDoc> => {
  // Format SSL Commerz data
  const sslData = await formatSSLCommerzData(userId);

  // Initialize SSL Commerz transaction
  const gatewayResponse = await sslcommerz.init(sslData);

  if (!gatewayResponse.status || gatewayResponse.status !== 'SUCCESS') {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to initialize payment gateway');
  }

  const payment = Payment.create({
    userId,
    feeId: sslData.value_b,
    amount: sslData.total_amount,
    transactionId: sslData.tran_id,
    status: PaymentStatus.PROCESSING,
  });
  return {
    ...payment,
    gatewayPageURL: gatewayResponse.GatewayPageURL,
  };
};

export const queryPayments = async (
  filter: Record<string, any>,
  options: IPaginateOptions
): Promise<IQueryResult<IPaymentDoc>> => {
  const payments = await Payment.paginate(filter, options);
  return payments;
};

export const getPaymentByTransactionId = async (transactionId: string): Promise<IPaymentDoc | null> =>
  Payment.findOne({ transactionId });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updatePaymentByTransactionId = async (
  transactionId: string,
  updateBody: Partial<IPayment>
): Promise<IPaymentDoc | null> => {
  const payment = await getPaymentByTransactionId(transactionId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

export const createPdfById = async (id: string) => {
  const payment = await getPaymentByTransactionId(id);

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'payment not found');
  }

  const generator = new PaymentPDFGenerator();

  return generator.generatePDF(payment);
};
