import Joi from 'joi';
import { objectId } from '../validate';

const createPaymentBody = {
  userId: Joi.required().custom(objectId),
  feeId: Joi.required().custom(objectId),
  amount: Joi.number().required().min(1).max(100000).message('Amount must be between 1 and 100,000'),
};

export const createPayment = {
  body: Joi.object().keys(createPaymentBody),
};

export const getPayments = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
    searchFields: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  }),
};
