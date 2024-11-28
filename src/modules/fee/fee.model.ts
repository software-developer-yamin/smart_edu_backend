import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import { FeeType, FeeStatus, IFeeDoc, IFeeModel, Month } from './fee.interfaces';
import paginate from '../paginate/paginate';

const feeSchema = new mongoose.Schema<IFeeDoc, IFeeModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true,
      enum: Object.values(Month),
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    feeBreakdown: [
      {
        type: {
          type: String,
          enum: Object.values(FeeType),
          required: [true, 'Fee type is required'],
        },
        amount: {
          type: Number,
          required: [true, 'Amount is required'],
          min: [0, 'Amount cannot be negative'],
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(FeeStatus),
      default: FeeStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
feeSchema.plugin(toJSON);
feeSchema.plugin(paginate);

// Pre-save middleware to update status based on payment
feeSchema.pre('save', function (next) {
  if (this.paidAmount === 0) {
    this.status = FeeStatus.PENDING;
  } else if (this.paidAmount < this.totalAmount) {
    this.status = FeeStatus.PARTIALLY_PAID;
  } else if (this.paidAmount === this.totalAmount) {
    this.status = FeeStatus.PAID;
  }

  if (this.status !== FeeStatus.PAID && this.dueDate < new Date()) {
    this.status = FeeStatus.OVERDUE;
  }

  next();
});

// add plugin that converts mongoose to json
feeSchema.plugin(toJSON);
feeSchema.plugin(paginate);

const Fee = mongoose.model<IFeeDoc, IFeeModel>('Fee', feeSchema);

export default Fee;
