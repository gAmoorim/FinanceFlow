const express = require('express')
const { controllerListarUsuarios, controllerCadastrarUsuario, controllerLoginUsuario, controllerObterUsuario, controllerAtualizarUsuario, controllerAtualizarSenhaUsuario, controllerDeletarUsuario, } = require('../controllers/controllerUsuarios')
const auth = require('../middlewares/auth')


const rotas = express()

rotas.post('/cadastro', controllerCadastrarUsuario)
rotas.post('/login', controllerLoginUsuario)
rotas.get('/usuarios', controllerListarUsuarios)

rotas.get('/usuario', auth, controllerObterUsuario)
rotas.put('/usuario', auth, controllerAtualizarUsuario)
rotas.put('/atualizarsenha', auth, controllerAtualizarSenhaUsuario)
rotas.delete('/usuario', auth, controllerDeletarUsuario)

module.exports = rotas