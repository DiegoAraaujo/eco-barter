import { Router } from "express";
const router = Router();

import{
    createExchangeReviewHandler,
    getReviewByExchangeHandler
} from "../controllers/reviewController.js";

router.post('/:exchangeId/review', createExchangeReviewHandler);
router.get('/:exchangeId/reviews', getReviewByExchangeHandler);

export default router;