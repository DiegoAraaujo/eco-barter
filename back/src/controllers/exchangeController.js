import {  getAllExchangesByUser, getExchangeById, createExchange, updateExchangeStatus, updateItemsStatus, deleteExchange } from "../models/exchangeModel.js"

const getAllExchangesByUserHandler = async(req, res) => {
  const accountId = parseInt(req.params.accountId);

  if  (!accountId) {
    res.status(400).json({error: "ID não existe."})
  }

  try {
    const exchanges = await getAllExchangesByUser(accountId)
    res.status(200).json(exchanges)
  }

  catch(error) {
    res.status(500).json({error: error.message || "Erro ao buscar trocas."})
  }
}

const getExchangeByIdHandler = async(req, res) => {
  const id = parseInt(req.params.id);

  if(!id) {
    res.status(400).json({error: "O ID é obrigatório."});
  }

  try {
    const exchange = await getExchangeById(id);

    if(!exchange) {
      res.status(400).json({error: "A troca não encontrada."})
    }

    res.status(200).json(exchange);
  }

  catch(error) {
    res.status(500).json({error: "Erro ao buscar troca."})
  }
}

const createExchangeHandler = async(req, res) => {
  console.log('Body recebido:', req.body); // DEBUG
  const { senderItemId, receiverItemId, senderAccountId, receiverAccountId, status } = req.body;
  console.log('Dados extraídos:', { senderItemId, receiverItemId, senderAccountId, receiverAccountId, status }); // DEBUG

  if(!senderItemId || !receiverItemId || !senderAccountId || !receiverAccountId) {
    console.log('Dados incompletos - faltando algum campo'); // DEBUG
    return res.status(400).json({error: "Dados incompletos."});
  }

  try {
    const newExchange = await createExchange(
      parseInt(senderItemId), 
      parseInt(receiverItemId), 
      parseInt(senderAccountId), 
      parseInt(receiverAccountId), 
      status
    );
    res.status(201).json(newExchange);
  }
  catch(error) {
    console.log('Erro no catch:', error.message); // DEBUG
    res.status(500).json({error: error.message || "Erro ao criar troca."});
  }
}

const updateExchangeStatusHandler = async(req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if(!id) {
    res.status(400).json({error: "O ID é obrigatório."})
  }

  if(!status) {
    res.status(400).json({error: "O status é obrigatório."})
  }

  try {
    const updateExchange = await updateExchangeStatus(id, status);
    res.status(200).json(updateExchange);
  }

  catch(error) {
    res.status(500).json({error: "Erro ao alterar status da troca."});
  }
}

const updateItemStatusHandler = async(req, res) => {
  const { senderItemId, receiverItemId, exchangeStatus } = req.body;

  if(!senderItemId || !receiverItemId || !exchangeStatus) {
    res.status(400).json({error: "Dados incompletos."})
  }

  try {
    const exchangeData = {
      senderItemId: parseInt(senderItemId),
      receiverItemId: parseInt(receiverItemId),
      exchangeStatus: exchangeStatus
    };

    await updateItemsStatus(exchangeData);
    res.status(200).json({message: "Status do item atualizado com sucesso."});
  }

  catch(error) {
    res.status(500).json({error: "Erro ao atualizar status do item."});
  }
}

const deleteExchangeHandler = async(req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(400).json({error: "ID não existe."})
  }

  try {
    await deleteExchange(id);
    res.status(204).send();
  }

  catch(error) {
    res.status(500).json({error: "Não foi possível deletar a troca."})
  }
}

export {
  getAllExchangesByUserHandler,
  getExchangeByIdHandler, 
  createExchangeHandler, 
  updateExchangeStatusHandler, 
  updateItemStatusHandler, 
  deleteExchangeHandler
}