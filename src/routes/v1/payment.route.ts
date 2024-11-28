import express, { Router } from 'express';
import { paymentController, paymentValidation } from '../../modules/payment';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('managePayments'), validate(paymentValidation.createPayment), paymentController.createPayment)
  .get(auth('getPayments'), validate(paymentValidation.getPayments), paymentController.getPayments);

router.route('/:transactionId/download/receipt').get(paymentController.downloadPaymentReceipt);

router.route('/:transactionId/:type').post(paymentController.updatePayment);
router.route('/:transactionId/:type').post(paymentController.updatePayment);

export default router;
