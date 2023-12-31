import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter
  .post('/register', AuthController.register)
  .post('/login', AuthController.login)
  .post('/verify', AuthController.verify)
  .get('/pesel/:id', AuthController.getUserPesel);
