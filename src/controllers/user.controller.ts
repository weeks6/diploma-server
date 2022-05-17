import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import exclude from '../utils/User/excludeUserKey';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId)
    }
  });

  if (user?.role !== 'ADMIN') {
    res.status(401).json({ message: 'Недоступное действие' });
  }

  const { email, name, password } = req.body;

  try {
    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10)
      }
    });

    res.json(createdUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const setUserRole = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: 'ADMIN'
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    res.json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { email }
    });

    // get user data
    // check if it is valid

    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id
        },
        process.env.AUTH_TOKEN_SECRET!
      );

      res.json({
        token
      });
    } else {
      res
        .status(400)
        .json({ message: 'Такой комбинации логина и пароля не существует' });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const users = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  const usersWithoutPasswords = users.map((user) => exclude(user, 'password'));

  res.json(usersWithoutPasswords);
};

export const profile = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res
      .status(401)
      .json({ message: 'Необходима авторизация', error: 'No id in request' });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId)
    }
  });

  if (user) {
    const userWithoutPassword = exclude(user, 'password');
    return res.json({ result: userWithoutPassword });
  } else {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId)
    }
  });

  if (user?.role !== 'ADMIN') {
    res.status(401).json({ message: 'Недоступное действие' });
  }

  try {
    await prisma.user.delete({
      where: {
        id: req.body.id
      }
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Ошибка в запросе', status: 'error' });
  }

  return res.status(200).json({ message: 'Успешно', status: 'success' });
};
