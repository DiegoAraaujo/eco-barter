import { exchangeReviewCreate, getReviewByExchange} from '../models/reviewModel.js';

const createExchangeReviewHandler = async(req, res) => {
    const exchangeId = parseInt(req.params.exchangeId);
    const { rating, comment } = req.body; 

    if (!exchangeId || rating === undefined || rating === null) {
        return res.status(400).json({ error: "exchangeId e rating são obrigatórios."});
    }
    try{
        const reviewCreate = await exchangeReviewCreate(exchangeId, parseInt(rating), comment || "");
        res.status(201).json(reviewCreate);
    }
    catch(error){
        res.status(500).json({error: error.message || "Erro ao criar review."});
    }
}

const getReviewByExchangeHandler = async(req, res) => {
    const exchangeId = parseInt(req.params.exchangeId);

    if (!exchangeId) {
        return res.status(400).json({ error: "exchangeId é obrigatório." });
    }
    try{
        const reviews = await getReviewByExchange(exchangeId);
        res.status(200).json(reviews);
    }
    catch(error){
        res.status(500).json({ error: "Erro ao buscar reviews." });
    }
}

export{
    createExchangeReviewHandler,
    getReviewByExchangeHandler
}