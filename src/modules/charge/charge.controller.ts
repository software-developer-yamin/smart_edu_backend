import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as chargeService from './charge.service';

export const createCharge = catchAsync(async (req: Request, res: Response) => {
  const charge = await chargeService.createCharge(req.body);
  res.status(httpStatus.CREATED).send(charge);
});

export const getUser = catchAsync(async (_req: Request, res: Response) => {
  const charge = await chargeService.getCharge();
  if (!charge) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Charge not found');
  }
  res.send(charge);
});
