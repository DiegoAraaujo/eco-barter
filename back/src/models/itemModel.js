import prisma from "../prisma.js";
import {  ItemStatus, ItemCondition  } from "@prisma/client";

const getAllItems = async(accountId) => {
  return prisma.item.findMany({
    where: {
      accountId: accountId
    },
    orderBy: {
      name: 'asc'
    }
  });
}

const getItemById = async(id) => {
  return prisma.item.findUnique({
    where: {
      id: id
    },
    include: {
      account: true, // Carrega os dados da conta dona do item
      
      sentExchanges: { // Histórico de quando o item foi oferecido em trocas
        include: {
          receiverItem: true,   // Item que foi recebido em troca
          receiverAccount: true, // Conta que recebeu este item
          reviews: true         // Avaliações desta troca
        }
      },
      
      recExchanges: { // Histórico de quando outros queriam este item em troca
        include: {
          senderItem: true,    // Item que foi oferecido em troca
          senderAccount: true, // Conta que ofereceu o item
          reviews: true        // Avaliações desta troca
        }
      }
    }
  });
}

const addItem = async(name, imageUrl, category, description, status, condition, accountId) => {
  return prisma.item.create({
    data: {
      name: name,
      registeredAt: new Date(),
      imageUrl: imageUrl,
      category: category,
      description: description,
      status: status || ItemStatus.AVAILABLE,
      condition: condition || ItemCondition.NEW,
      accountId: accountId
    }
  });
}

const updateItem = async(id, name, imageUrl, category, description, status, condition) => {
  const item = await prisma.item.findUnique({
    where: {
      id: id
    }
  });

  if(!item) {
    throw new Error('Item não encontrado');
  }

  return prisma.item.update({
    where: {
      id: id
    },

    data: {
      name: name,
      imageUrl: imageUrl,
      category: category,
      description: description,
      status: status,
      condition: condition
    }
  });
}

const deleteItem = async (id) => {
  const item = await prisma.item.findUnique({
    where: {
      id: id
    }
  });

  if(!item) {
    throw new Error('Item não encontrado');
  }

  return prisma.item.delete({
    where: {
      id: id
    }
  });
}

export {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem
}