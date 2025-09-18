import prisma from "../prisma.js";
import { ItemCondition } from "@prisma/client";

const getAllItems = async (accountId) => {
  return prisma.item.findMany({
    where: {
      accountId: accountId,
    },
    orderBy: {
      name: "asc",
    },
  });
};

const getItemById = async (id) => {
  return prisma.item.findUnique({
    where: {
      id: id,
    },
    include: {
      account: true,

      sentExchanges: {
        include: {
          receiverItem: true,
          receiverAccount: true,
          reviews: true,
        },
      },

      recExchanges: {
        include: {
          senderItem: true,
          senderAccount: true,
          reviews: true,
        },
      },
    },
  });
};

const addItem = async (
  name,
  imageUrl,
  category,
  description,
  condition,
  accountId
) => {
  return prisma.item.create({
    data: {
      name: name,
      registeredAt: new Date(),
      imageUrl: imageUrl,
      category: category,
      description: description,
      condition: condition || ItemCondition.NEW,
      accountId: accountId,
    },
  });
};

const updateItem = async (
  id,
  name,
  imageUrl,
  category,
  description,
  status,
  condition
) => {
  const item = await prisma.item.findUnique({
    where: {
      id: id,
    },
  });

  if (!item) {
    throw new Error("Item não encontrado");
  }

  return prisma.item.update({
    where: {
      id: id,
    },

    data: {
      name: name,
      imageUrl: imageUrl,
      category: category,
      description: description,
      status: status,
      condition: condition,
    },
  });
};

const deleteItem = async (id) => {
  const item = await prisma.item.findUnique({
    where: {
      id: id,
    },
  });

  if (!item) {
    throw new Error("Item não encontrado");
  }

  return prisma.item.delete({
    where: {
      id: id,
    },
  });
};

const getAllItemsCatalog = async (category) => {
  return prisma.item.findMany({
    where: category ? { category: category } : {},
    orderBy: { name: "asc" },
    include: {
      account: true,
    },
  });
};

export {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getAllItemsCatalog, // <== não esqueça de exportar
};
