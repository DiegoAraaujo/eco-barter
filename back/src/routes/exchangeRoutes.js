import { Router } from "express";
const router = Router();
import {  getAllExchangesByUserHandler, getExchangeByIdHandler, createExchangeHandler, updateExchangeStatusHandler, updateItemStatusHandler, deleteExchangeHandler  } from '../controllers/exchangeController.js';

router.get('/account/:accountId', getAllExchangesByUserHandler);
router.get('/:id', getExchangeByIdHandler);
router.post('/', createExchangeHandler);
router.patch('/:id/status', updateExchangeStatusHandler);
router.patch('/item/status', updateItemStatusHandler);      //O controller espera senderItemId e receiverItemId no body, não no params
router.delete('/:id', deleteExchangeHandler);

export default router;