import express from 'express';
import { createGroup, addMember, removeMember, postGroupMessage } from '../controllers/group.controller.js';

const router = express.Router();

router.post('/', createGroup);
router.post('/:groupId/add', addMember);
router.post('/:groupId/remove', removeMember);
router.post('/:groupId/messages', postGroupMessage);

export default router;
