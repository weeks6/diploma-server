import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const checkSystem = async (req: Request, res: Response) => {
  try {
    const system = await prisma.system.findFirst({
      where: {
        id: 1
      }
    });

    console.log({ system });

    if (!system) {
      res.status(418).json({ message: 'Система не инициализирована' });
    } else {
      res.status(200).json({ system, message: 'Система инициализирована' });
    }
  } catch (error) {
    console.log(error);

    res.status(418).json({ error, message: 'Система не инициализирована' });
  }
};

export const setupSystem = async (req: Request, res: Response) => {
  try {
    const system = await prisma.system.findFirst({
      where: {
        id: 1
      }
    });

    if (!system) {
      const { email, name, password } = req.body;

      const createdUser = await prisma.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(password, 10),
          role: 'ADMIN'
        }
      });

      const system = await prisma.system.create({ data: { id: 1 } });

      res.status(200).json({
        admin: createdUser,
        system,
        message: 'Система успешно инициализирована'
      });
    } else {
      res.status(403).json({ system, message: 'Система уже инициализирована' });
    }
  } catch (error) {
    res.status(400).json({ error, message: 'Ошибка базы данных' });
  }
};
