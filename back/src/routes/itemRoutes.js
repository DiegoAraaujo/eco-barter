import { Router } from "express";
const router = Router();
import {  getAllItemsHandler, getItemByIdHandler, addItemHandler, updateItemHandler, deleteItemHandler  } from '../controllers/itemController.js';

router.get('/account/:accountId', getAllItemsHandler);
router.get('/:id', getItemByIdHandler);
router.post('/', addItemHandler);
router.put('/:id', updateItemHandler);
router.delete('/:id', deleteItemHandler);

export default router;