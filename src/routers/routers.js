const express = require('express')
const { controllerListarUsuarios, controllerCadastrarUsuario, controllerLoginUsuario, controllerObterUsuario, controllerAtualizarUsuario, controllerAtualizarSenhaUsuario, controllerDeletarUsuario, } = require('../controllers/controllerUsuarios')
const { controllerCriarTransacao } = require('../controllers/controllerTransacoes')
const { controllerCriarCategoria } = require('../controllers/controllerCategorias')
const auth = require('../middlewares/auth')


const rotas = express()

rotas.post('/cadastro', controllerCadastrarUsuario)
rotas.post('/login', controllerLoginUsuario)
rotas.get('/usuarios', controllerListarUsuarios)

rotas.get('/usuario', auth, controllerObterUsuario)
rotas.put('/usuario', auth, controllerAtualizarUsuario)
rotas.put('/atualizarsenha', auth, controllerAtualizarSenhaUsuario)
rotas.delete('/usuario', auth, controllerDeletarUsuario)

rotas.post('/transacao', auth, controllerCriarTransacao)

rotas.post('/categoria', auth, controllerCriarCategoria)

module.exports = rotas