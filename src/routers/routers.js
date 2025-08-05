const express = require('express')
const { controllerListarUsuarios, controllerCadastrarUsuario } = require('../controllers/controllerUsuarios')

const rotas = express()

rotas.get('/usuarios', controllerListarUsuarios)
rotas.post('/cadastro', controllerCadastrarUsuario)

module.exports = rotas