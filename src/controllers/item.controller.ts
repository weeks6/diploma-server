import { Prisma, PrismaClient } from '@prisma/client';
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
    console.log({ error });

    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const itemList = async (req: Request, res: Response) => {
  try {
    const { room, type } = req.query;
    console.log({ room, type });

    const options: Prisma.ItemFindManyArgs = {
      include: {
        images: true,
        type: true,
        user: true,
        room: true
      }
    };

    if (room?.length) {
      const roomIds = (room as string).split(',').map((v) => Number(v));
      options.where = {
        room: {
          id: { in: roomIds }
        }
      };
    }

    const items = await prisma.item.findMany(options);

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

    const data: any = {
      title: req.body.title,
      guid: req.body.guid,
      properties: req.body.properties,
      type: {
        connect: {
          id: Number(req.body.type)
        }
      },
      user: {
        connect: {
          id: Number(req.userId)
        }
      }
    };

    if (req.body.room) {
      data.room = {
        connect: {
          id: Number(req.body.room)
        }
      };
    }

    const item = await prisma.item.create({
      data
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
        type: true,
        user: true,
        room: true
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
  console.log({ body: req.body });

  try {
    const files = await prisma.file.findMany({
      where: {
        itemId: req.body.id
      }
    });

    console.log({ files });

    files.forEach(async (file) => {
      const filePath = path.join(process.cwd(), file.src);
      console.log({ fileSrc: file.src, filePath });

      await rm(filePath, { force: true });
    });

    const item = await prisma.item.delete({
      where: {
        id: req.body.id
      }
    });

    return res.status(200).json(item);
  } catch (error) {
    console.log({ error });

    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};

export const editItem = async (req: Request, res: Response) => {
  const data: any = {
    title: req.body.title,
    type: {
      connect: {
        id: Number(req.body.type)
      }
    },
    guid: req.body.guid,
    properties: req.body.properties
  };

  if (req.body.room) {
    data.room = {
      connect: {
        id: Number(req.body.room)
      }
    };
  }

  try {
    const updatedItem = await prisma.item.update({
      where: {
        id: Number(req.body.id)
      },
      data
    });

    console.log({ oldPhotos: req.body.photos_old });

    if (req.body.photos_old?.length) {
      const oldPhotos = await prisma.file.findMany({
        where: {
          itemId: Number(req.body.id)
        }
      });

      oldPhotos.forEach(async (file) => {
        if (!req.body.photos_old?.includes(`${file.id}`)) {
          const deleteFile = await prisma.file.delete({
            where: {
              id: file.id
            }
          });

          console.log({ deleteFile });

          const filePath = path.join(process.cwd(), file.src);
          await rm(filePath, { force: true });
        }
      });

      const createdFiles = await prisma.file.createMany({
        data: (req.files as Express.Multer.File[]).map((file) => ({
          filename: file.filename,
          public: true,
          size: file.size,
          src: `/storage/${file.filename}`,
          type: file.mimetype,
          itemId: Number(req.body.id)
        }))
      });

      console.log({ createdFiles });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.log({ error });
    return res
      .status(400)
      .json({ message: 'Что-то пошло не так', status: 'error', error });
  }
};
