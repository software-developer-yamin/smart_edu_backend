import express, { Router } from 'express';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router.route('/').post(auth('manageUsers')).get(auth('getUsers'));

export default router;
