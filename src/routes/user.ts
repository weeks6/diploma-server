import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import {
  createUser,
  deleteUser,
  profile
} from '../controllers/user.controller';
import routeGuard from '../utils/routeGuard';

const router = Router();

router.use(routeGuard);

router.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required()
    })
  }),
  createUser
);

router.get('/profile', profile);

router.delete('/user', deleteUser);

export default router;
