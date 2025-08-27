import prisma from "../prisma.js";

const getAllItems = async(accountId) => {
  return prisma.Item.findMany({
    where: {
      accountId: accountId
    },
    orderBy: {
      name: 'asc'
    }
  });
}

const getItemById = async(id) => {
  return prisma.Item.findUnique({
    where: {
      id: id
    }
  });
}

const addItem = async(name, imageUrl, category, description, status, condition, accountId) => {
  return prisma.Item.create({
    data: {
      name: name,
      registeredAt: new Date(),
      imageUrl: imageUrl,
      category: category,
      description: description,
      status: status,
      condition: condition,
      accountId: accountId
    }
  });
}

const updateItem = async(id, name, imageUrl, category, description, status, condition) => {
  const item = await prisma.Item.findUnique({
    where: {
      id: id
    }
  });

  if(!item) {
    throw new Error('Item não encontrado');
  }

  return prisma.Item.update({
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
  const item = await prisma.Item.findUnique({
    where: {
      id: id
    }
  });

  if(!item) {
    throw new Error('Item não encontrado');
  }

  return prisma.Item.delete({
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