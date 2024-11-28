import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IPaymentDoc, IPaymentModel, PaymentStatus } from './payment.interfaces';

const paymentSchema = new mongoose.Schema<IPaymentDoc, IPaymentModel>(
  {
    feeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Fee ID is required'],
      ref: 'Fee',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PaymentStatus),
        message: 'Invalid payment status',
      },
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    refundData: {
      amount: {
        type: Number,
        min: [0, 'Refund amount cannot be negative'],
      },
      reason: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
      },
    },
    metadata: {
      ipAddress: {
        type: String,
        trim: true,
      },
      userAgent: {
        type: String,
        trim: true,
      },
      attempts: {
        type: Number,
        default: 0,
        min: [0, 'Attempts cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

const Payment = mongoose.model<IPaymentDoc, IPaymentModel>('Payment', paymentSchema);

export default Payment;
