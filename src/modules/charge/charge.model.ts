import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IChargeDoc, IChargeModel } from './charge.interfaces';
import { feeInterfaces } from '../fee';

const chargeSchema = new mongoose.Schema<IChargeDoc, IChargeModel>(
  {
    month: {
      type: String,
      required: [true, 'Month is required'],
      trim: true,
      enum: Object.values(feeInterfaces.Month),
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    feeBreakdown: [
      {
        type: {
          type: String,
          enum: Object.values(feeInterfaces.FeeType),
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
chargeSchema.plugin(toJSON);
chargeSchema.plugin(paginate);

const Charge = mongoose.model<IChargeDoc, IChargeModel>('Charge', chargeSchema);

export default Charge;
