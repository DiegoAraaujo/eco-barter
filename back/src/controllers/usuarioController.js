const{ getAllUsuarios,getUsuarioById, addUsuario, updateUsuario,deleteUsuario} = require('../models/usuarioModel');



const getAllUsuariosHandler = async(req, res) =>{
    try{
        const accounts = await getAllUsuarios();
        res.status(200).json(accounts);
    }

    catch(error){
        res.status(500).json({error: error.message || "Erro ao buscar usuários"});
    }

}

const getUsuarioByIdHandler = async(req, res) => {
    const id = parseInt(req.params.id);

    try{
        const account = await getUsuarioById(id);

        if(!account){
            return res.status(404).json({error: "Usuário não encontrado"});
        }

        res.status(200).json(account);
    }

    catch(error){
        res.status(500).json({error: "Erro ao buscar Usuário"});
    }   

}
const addUsuarioHandler = async(req, res) => {

    const{ nome, fullName, email, phone, city, state,  passwordHash} = req.body;

    if(!nome){
        return res.status(400).json({error: "Nome é obrigatório"});
    }

    try{
        const account = await addUsuario( nome, fullName, email, phone, city, state,  passwordHash);
        res.status(201).json(account);
    }

    catch(error){
        res.status(500).json({error: error.message});
    }

}
const updateUsuarioHandler = async(req, res) => {

    const id = parseInt(req.params.id);

    const{ nome, fullName, email, phone, city, state, passwordHash } = req.body;

    if(!nome){
        return res.status(400).json({error: "Nome é obrigatório"});
    }

    try{
        const account  = await updateUsuario(id, nome, fullName, email, phone, city, state,  passwordHash);

        res.status(200).json(account);
    }

    catch(error){
        if(error.message === 'Usuário não encontrado'){
            return res.status(404).json({error: "Usuário não encontrado"});
        }
        res.status(500).json({error: "Erro ao atualizar Usuário"});
    }
}
    const deleteUsuarioHandler = async(req, res) => {
    const id = parseInt(req.params.id);

    try{
        const account = await deleteUsuario(id);
        res.status(200).json({message: "Usuário deletado com sucesso"});
    }

    catch(error){
        if(error.message === 'Usuário não encontrado'){
            return res.status(404).json({error: "Usuário não encontrado"});
        }
        res.status(500).json({error: "Erro ao deletar usuário"});
    }
}
module.exports = {
    getAllUsuariosHandler,
    getUsuarioByIdHandler,
    addUsuarioHandler,
    updateUsuarioHandler,
    deleteUsuarioHandler
};