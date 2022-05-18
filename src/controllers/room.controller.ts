import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const roomList = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.status(200).json(rooms);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await prisma.room.create({
      data: {
        title: req.body.title
      }
    });
    return res.status(200).json(room);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    const updatedRoom = await prisma.room.update({
      where: {
        id
      },
      data: {
        title: req.body.title
      }
    });

    return res.status(200).json(updatedRoom);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const deletedRoom = await prisma.room.delete({
      where: {
        id: req.body.id
      }
    });

    return res.status(200).json(deletedRoom);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};
