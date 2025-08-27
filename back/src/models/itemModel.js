import prisma from "../prisma.js";

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

const addItem = async(itemData) => {
  return prisma.item.create({
    data: {
      name: itemData.name,
      registeredAt: new Date(),
      imageUrl: itemData.imageUrl,
      category: itemData.category,
      description: itemData.description,
      status: itemData.status || 'AVAILABLE',
      condition: itemData.condition,
      accountId: itemData.accountId
    }
  });
}

const updateItem = async(id, itemData) => {
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
      name: itemData.name,
      imageUrl: itemData.imageUrl,
      category: itemData.category,
      description: itemData.description,
      status: itemData.status,
      condition: itemData.condition
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