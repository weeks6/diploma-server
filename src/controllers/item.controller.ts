import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { rm } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export const itemTypeList = async (req: Request, res: Response) => {
  try {
    const itemTypes = await prisma.itemType.findMany();
    return res.status(200).json(itemTypes);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const createItemType = async (req: Request, res: Response) => {
  try {
    const itemType = await prisma.itemType.create({
      data: {
        title: req.body.title
      }
    });
    return res.status(200).json(itemType);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const updateItemType = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    const updatedItemType = await prisma.itemType.update({
      where: {
        id
      },
      data: {
        title: req.body.title
      }
    });

    return res.status(200).json(updatedItemType);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error' });
  }
};

export const deleteItemType = async (req: Request, res: Response) => {
  try {
    const deletedItemType = await prisma.itemType.delete({
      where: {
        id: req.body.id
      }
    });

    return res.status(200).json(deletedItemType);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const itemList = async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        images: true,
        type: true,
        user: true
      }
    });

    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    let files: any = [];

    const item = await prisma.item.create({
      data: {
        title: req.body.title,
        properties: req.body.properties,
        type: {
          connect: {
            id: Number(req.body.type)
          }
        },
        room: {
          connect: {
            id: Number(req.body.room)
          }
        },
        user: {
          connect: {
            id: Number(req.userId)
          }
        }
      }
    });

    if (req.files?.length) {
      files = await prisma.file.createMany({
        data: (req.files as Express.Multer.File[]).map((file) => ({
          filename: file.filename,
          public: true,
          size: file.size,
          src: `/storage/${file.filename}`,
          type: file.mimetype,
          itemId: item.id
        }))
      });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.log({ error });

    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await prisma.item.findFirst({
      where: {
        id: req.body.id
      },
      include: {
        images: true,
        type: true
      }
    });

    return res.status(200).json(item);
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        itemId: req.body.id
      }
    });

    files.forEach(async (file) => {
      await rm(path.join(process.cwd(), file.src));
    });

    const deleteFiles = prisma.file.deleteMany({
      where: {
        itemId: req.body.id
      }
    });

    const item = prisma.item.delete({
      where: {
        id: req.body.id
      }
    });

    const transaction = await prisma.$transaction([deleteFiles, item]);

    return res.status(200).json({ transaction });
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};
