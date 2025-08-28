import prisma from "../prisma.js";
import {  ExchangeStatus, ItemStatus  } from "@prisma/client";

const getAllExchangesByUser = async(userId) => {
  return prisma.exchange.findMany({
    where: {
      OR: [
        { senderAccountId: userId },    // O usuário INICIOU a troca
        { receiverAccountId: userId }   // O usuário RECEBEU a troca
      ]
    },

    include: {
      senderItem: {        // Item que foi OFERECIDO na troca
        include: {
          account: true   // Dados da conta DONA do item oferecido
        }
      },
      receiverItem: {      // Item que foi SOLICITADO na troca  
        include: {
          account: true   // Dados da conta DONA do item solicitado
        }
      },
      senderAccount: true,   // Dados completos de quem INICIOU a troca
      receiverAccount: true, // Dados completos de quem RECEBEU a proposta
      reviews: true          // Todas as avaliações desta troca
    },

    orderBy: [
      {
        exchangedAt: 'desc'  // Ordena por data de conclusão da troca
      },
      {
        id: 'desc'
      }
    ]
  });
}

const getExchangeById = async(id) => {
  return prisma.exchange.findUnique({
    where: {
      id: id
    },

    include: {
      senderItem: {
        include: {
          account: true
        }
      },
      
      receiverItem: {
        include: {
          account: true
        }
      },

      senderAccount: true,
      receiverAccount: true,
      reviews: true
    }
  });
}

const createExchange = async(senderItemId, receiverItemId, senderAccountId, receiverAccountId, status) => {
  return prisma.exchange.create({
    data: {
      senderItemId: senderItemId,
      receiverItemId: receiverItemId,
      senderAccountId: senderAccountId,
      receiverAccountId: receiverAccountId,
      status: status || ExchangeStatus.PENDING
    },

    include: {
      senderItem: true,     //retorna o item oferecido
      receiverItem: true,   //retorna o item solicitado
      senderAccount: true,  //retorna os dados de quem iniciou a troca
      receiverAccount: true //retorna os dados de quem recebeu a troca
    }
  });
}

//Atualiza o status da troca
const updateExchangeStatus = async(id, status) => {
  const exchange = await prisma.exchange.findUnique({
    where: {
      id: id
    }
  });

  if (!exchange) {
    throw new Error("Troca não encontrada");
  }

  const data = {  status  };

  if (status === "COMPLETED") {
    data.exchangedAt = new Date();
  }

  const updatedExchange = await prisma.exchange.update({
    where: {
      id: id
    },

    data: data,
    include: {
      senderItem: true,
      receiverItem: true
    }
  });

  if (status === ExchangeStatus.ACCEPTED || status === ExchangeStatus.COMPLETED) {
    await updateItemsStatus(updatedExchange.senderItemId, updatedExchange.receiverItemId, status);
  }

  return updatedExchange;
}

//Atualiza o status do item
const updateItemsStatus = async(senderItemId, receiverItemId, exchangeStatus) => {
  const itemStatus = exchangeStatus === ExchangeStatus.ACCEPTED ? ItemStatus.RESERVED : ItemStatus.SOLD;

  await Promise.all([
    prisma.item.update({
      where: {  id: senderItemId  },
      data: { status: itemStatus  }
    }),
    prisma.item.update({
      where: {  id: receiverItemId  },
      data: { status: itemStatus}
    })
  ]);
}

const deleteExchange = async(id) => {
  const exchange = await prisma.exchange.findUnique({
    where: {
      id: id
    }
  });

  if (!exchange) {
    throw new Error("Troca não encontrada");
  }

  await prisma.exchangeReview.deleteMany({
    where: {
      exchangeId: id
    }
  });

  return prisma.exchange.delete({
    where: {
      id: id
    }
  });
}

export {
  getAllExchangesByUser,
  getExchangeById,
  createExchange,
  updateExchangeStatus,
  updateItemsStatus,
  deleteExchange
}