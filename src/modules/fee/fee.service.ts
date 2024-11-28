/* eslint-disable import/prefer-default-export */

import mongoose from 'mongoose';
import Fee from './fee.model';
import { IFee, IFeeDoc } from './fee.interfaces';

export const createFee = async (body: Omit<IFee, 'status'>): Promise<IFeeDoc> => {
  return Fee.create(body);
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFeeDoc | null>}
 */
export const getFeeByUserId = async (id: mongoose.Types.ObjectId): Promise<IFeeDoc | null> => Fee.findOne({ userId: id });
