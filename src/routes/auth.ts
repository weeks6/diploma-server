import { loginUser } from './../controllers/user.controller';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { createUser } from '../controllers/user.controller';

const router = Router();

router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }),
  loginUser
);

export default router;
