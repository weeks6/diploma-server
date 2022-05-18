import { Router } from 'express';
import {
  createRoom,
  deleteRoom,
  roomList,
  updateRoom
} from '../controllers/room.controller';

const router = Router();

router.get('/', roomList);
router.put('/', createRoom);
router.delete('/', deleteRoom);
router.patch('/', updateRoom);

export default router;
