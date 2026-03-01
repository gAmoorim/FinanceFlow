const express = require('express')
const { controllerListarUsuarios, controllerCadastrarUsuario, controllerObterUsuario, controllerAtualizarUsuario, controllerAtualizarSenhaUsuario, controllerDeletarUsuario, } = require('../controllers/controllerUsuarios')
const { controllerCriarTransacao, controllerListarTransacoes, controllerDetalharTransacoes, controllerAtualizarTransacao, controllerExlcuirTransacao, controllerResumoTransacoes } = require('../controllers/controllerTransacoes')
const { controllerCriarNovaMeta, controllerListarMetas, controllerAtualizarMetas, controllerExcluirMeta } = require('../controllers/controllerMetas')
const { controllerLoginUsuario } = require('../controllers/controllerLogin')
const auth = require('../middlewares/auth')


const rotas = express.Router()

rotas.post('/cadastro', controllerCadastrarUsuario)
rotas.post('/login', controllerLoginUsuario)
rotas.get('/usuarios', controllerListarUsuarios)

rotas.use(auth)

rotas.get('/usuario', controllerObterUsuario)
rotas.put('/usuario', controllerAtualizarUsuario)
rotas.put('/atualizarsenha', controllerAtualizarSenhaUsuario)
rotas.delete('/usuario', controllerDeletarUsuario)

rotas.post('/transacoes', controllerCriarTransacao)
rotas.get('/transacoes', controllerListarTransacoes)
rotas.get('/transacoes/resumo', controllerResumoTransacoes)
rotas.get('/transacoes/:transacaoId', controllerDetalharTransacoes)
rotas.put('/transacoes/:transacaoId', controllerAtualizarTransacao)
rotas.delete('/transacoes/:transacaoId', controllerExlcuirTransacao)

rotas.post('/metas', controllerCriarNovaMeta)
rotas.get('/metas', controllerListarMetas)
rotas.put('/metas/:id', controllerAtualizarMetas)
rotas.delete('/metas/:id', controllerExcluirMeta)

module.exports = rotas