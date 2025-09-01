import prisma from "../prisma.js";

const exchangeReviewCreate = async(exchangeId, rating, comment) => {
    return prisma.exchangeReview.create({
        data:{
            exchangeId,
            rating,
            comment
        }
    });
};

const getReviewByExchange = async(exchangeId) => {
    return prisma.exchangeReview.findMany({
        where: {
            exchangeId
        },
    });
};

export{
    exchangeReviewCreate,
    getReviewByExchange
}