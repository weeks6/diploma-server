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

const prisma = new PrismaClient();
const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(systemRouter);
app.use(authRouter);
app.use(userRouter);
app.use(itemRouter);

app.use(errors());

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);