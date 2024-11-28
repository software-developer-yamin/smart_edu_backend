import Joi from 'joi';
import { password } from '../validate/custom.validation';

const roles = ['user', 'admin', 'manager'];
const UserStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
};

const registerBody = {
  role: Joi.string()
    .valid(...roles)
    .default('user'),
  isEmailVerified: Joi.boolean().default(false),
  rollNumber: Joi.string()
    .required()
    .regex(/^[A-Z0-9]{6,12}$/)
    .messages({
      'string.pattern.base': 'Invalid roll number format',
    }),
  name: Joi.string().required().min(2).max(50).trim(),
  class: Joi.string().required().trim(),
  section: Joi.string().required().trim().uppercase(),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^\+?[\d\s-]{10,}$/)
    .messages({
      'string.pattern.base': 'Invalid phone number',
    }),
  email: Joi.string().required().email().trim().lowercase(),
  password: Joi.string().required().min(8).custom(password),
  guardian: Joi.object().keys({
    name: Joi.string().required().trim(),
    relation: Joi.string().required().trim(),
    phoneNumber: Joi.string()
      .required()
      .pattern(/^\+?[\d\s-]{10,}$/)
      .messages({
        'string.pattern.base': 'Invalid guardian phone number',
      }),
  }),
  address: Joi.string().required().trim(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .default(UserStatus.ACTIVE),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
