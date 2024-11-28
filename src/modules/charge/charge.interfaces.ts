import { Model, Document } from 'mongoose';
import { IQueryResult } from '../paginate/paginate';
import { feeInterfaces } from '../fee';

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

export type ICharge = Omit<feeInterfaces.IFee, 'status' | 'userId' | 'academicYear'>;

export interface IChargeDoc extends ICharge, Document {}

export interface IChargeModel extends Model<IChargeDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<IQueryResult<IChargeDoc>>;
}
