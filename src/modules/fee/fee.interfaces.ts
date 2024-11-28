import mongoose, { Model, Document } from 'mongoose';
import { IQueryResult } from '../paginate/paginate';

export enum FeeType {
  TUITION = 'TUITION',
  EXAM = 'EXAM',
  LIBRARY = 'LIBRARY',
  LABORATORY = 'LABORATORY',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export enum Month {
  JANUARY = 'january',
  FEBRUARY = 'february',
  MARCH = 'march',
  APRIL = 'april',
  MAY = 'may',
  JUNE = 'june',
  JULY = 'july',
  AUGUST = 'august',
  SEPTEMBER = 'september',
  OCTOBER = 'october',
  NOVEMBER = 'november',
  DECEMBER = 'december',
}
export interface IFee {
  userId: mongoose.Types.ObjectId;
  academicYear: string;
  month: Month;
  dueDate: Date;
  feeBreakdown: {
    type: FeeType;
    amount: number;
    description?: string;
  }[];
  totalAmount: number;
  paidAmount: number;
  status: FeeStatus;
}

export interface IFeeDoc extends IFee, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IFeeModel extends Model<IFeeDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<IQueryResult<IFeeDoc>>;
}
