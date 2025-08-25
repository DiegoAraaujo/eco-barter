const express = require('express');
const router = express.Router();
const {getAllUsuariosHandler,getUsuarioByIdHandler,addUsuarioHandler,updateUsuarioHandler,deleteUsuarioHandler} = require('../controllers/usuarioController');


router.get('/', getAllUsuariosHandler);
router.get('/:id', getUsuarioByIdHandler);
router.post('/', addUsuarioHandler);
router.put('/:id', updateUsuarioHandler);
router.delete('/:id', deleteUsuarioHandler);

module.exports = router;