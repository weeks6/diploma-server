import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { errors } from 'celebrate';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import systemRouter from './routes/system';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import itemRouter from './routes/item';
import roomRouter from './routes/room';

const prisma = new PrismaClient();
const app = express();

app.use('/storage', express.static('storage'));
app.use(morgan('combined'));
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(express.json());

app.use('/system', systemRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/inventory', itemRouter);
app.use('/room', roomRouter);

app.use(errors());

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
