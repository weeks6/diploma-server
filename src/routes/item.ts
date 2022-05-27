import { Router } from 'express';
import {
  createItemType,
  deleteItemType,
  updateItemType,
  itemTypeList,
  createItem,
  getItem,
  itemList,
  deleteItem,
  editItem
} from '../controllers/item.controller';

import multer from 'multer';
import path from 'path';
import routeGuard from '../utils/routeGuard';

const router = Router();
router.use(routeGuard);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(process.cwd(), '/storage'));
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/itemTypes', itemTypeList);
router.put('/itemTypes', createItemType);
router.delete('/itemTypes', deleteItemType);
router.patch('/itemTypes', updateItemType);

router.get('/items', itemList);
router.post('/items', getItem);
router.put('/items', upload.array('photos'), createItem);
router.delete('/items', deleteItem);
router.patch('/items', upload.array('photos'), editItem);

export default router;
