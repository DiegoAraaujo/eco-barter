import { getAllItems, getItemById, addItem, updateItem, deleteItem, getAllItemsCatalog } from '../models/itemModel.js';

const getAllCatalogItemsHandler = async (req, res) => {
  const { category } = req.query;

  try {
    const items = await getAllItemsCatalog(category);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao buscar itens do catálogo." });
  }
};

const getAllItemsHandler = async(req, res) => {
  const accountId = parseInt(req.params.accountId);

  if (!accountId) {
    res.status(400).json({error: "ID não existe."})
  }

  try {
    const items = await getAllItems(accountId);
    res.status(200).json(items);
  } catch(error) {
    res.status(500).json({error: error.message || "Erro ao buscar items."});
  }
}

const getItemByIdHandler = async(req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(400).json({error: "O ID é obrigatório."})
  }

  try {
    const item = await getItemById(id);

    if(!item) {
      return res.status(400).json({error: "Item não encontrado."});
    }

    res.status(200).json(item);
  } catch(error) {
    res.status(500).json({error: "Erro ao buscar item."});
  }
}

const addItemHandler = async(req, res) => {
  const {name, imageUrl, category, description, condition, accountId} = req.body;

  if (!name || !accountId || !description) {
    return res.status(400).json({error: "Dados incompletos."})
  }

  if (description && description.length > 500) {
    return res.status(400).json({ error: 'Descrição muito longa (máx. 500 caracteres)' });
  }

  try {
    const newItem = await addItem(name, imageUrl, category, description, condition, parseInt(accountId));
    res.status(201).json(newItem);
  } catch(error) {
    res.status(500).json({error: error.message || "Erro ao adicionar item."});
  }
}

const updateItemHandler = async(req, res) => {
  const id = parseInt(req.params.id);
  const {name, imageUrl, category, description, status, condition} = req.body;
  
  if (!id) {
    res.status(400).json({error: "ID não existe."})
  }

  if (!name || !imageUrl || !category || !description || !status || !condition) {
    return res.status(400).json({error: "Pelo menos um dos campos deve ser alterado para atualizar."})
  }

  try {
    const updatedItem = await updateItem(id, name, imageUrl, category, description, status, condition);
    res.status(200).json(updatedItem);
  } catch(error) {
    res.status(500).json({error: "Não foi possível atualizar o item."})
  }
}

const deleteItemHandler = async(req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(400).json({error: "ID não existe."})
  }

  try {
    await deleteItem(id);
    res.status(204).send();
  } catch(error) {
    res.status(500).json({error: "Não foi possível deletar o item."})
  }
}

export {
  getAllCatalogItemsHandler,
  getItemByIdHandler,
  addItemHandler,
  updateItemHandler,
  deleteItemHandler,
  getAllItemsHandler
}
