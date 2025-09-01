require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJWT = process.env.JWT_PWD
const { queryListarUsuarios, queryBuscarPeloEmail, queryCadastrarUsuario, queryAtualizarUsuario, queryUsuarioExistente, queryAtualizarSenhaUsuario, queryDeletarUsuario } = require('../database/querys/queryUsuarios')
const { validarEmail } = require('../utils/validations')
const { criarCategoriasBase } = require('../utils/categoriasBase')
const knex = require('../database/connection')

const controllerCadastrarUsuario = async (req,res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha os campos: nome, senha e email'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' })
    }

    try {
        const emailExistente = await queryBuscarPeloEmail(email)

        if (emailExistente) {
            return res.status(400).json({ error: 'Esse email ja foi cadastrado'})
        }

        if (senha.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const usuario = await queryCadastrarUsuario(nome, email, senhaCriptografada)

        const usuarioId = usuario.id

        await criarCategoriasBase(usuarioId, knex)

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: {nome, email}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuário:", error)
        return res.status(500).json({ error: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const controllerLoginUsuario = async (req,res) => {
    const { email, senha } = req.body
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    try {
        const usuario = await queryBuscarPeloEmail(email)

        if (!usuario) {
            return res.status(400).json({ error: 'email ou senha incorreto'})
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhaCorreta) {
            return res.status(400).json({ error: 'email ou senha incorreto'})
        }
        
        const dadosTokenUsuario = {
            id: usuario.id,
            nome: usuario.nome
        }

        const token = jwt.sign(dadosTokenUsuario, senhaJWT, { expiresIn: '3h' })
        const {senha: _, ...dadosUsuario} = usuario
        
        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })
    } catch (error) {
        console.error("Ocorreu um erro ao realizar o Login:", error)
        return res.status(500).json({ error: `Erro ao realizar o Login: ${error.message}`})
    }
}

const controllerObterUsuario = async (req,res) => {
    const {id} = req.usuario

    if (!id) {
        return res.status(200).json({ error: 'Não foi possível receber o id do usuário'})
    }

    try {
        const usuario = await queryUsuarioExistente(id)

        return res.status(200).json({ usuario: usuario.nome, 
            email: usuario.email, 
            criado_em: usuario.criado_em
        })
    } catch (error) {
        console.error("Ocorreu um erro ao obter o usuário:", error)
        return res.status(500).json({ error: `Erro ao obter usuário: ${error.message}`})
    }
}

const controllerListarUsuarios = async (req,res) => {
    try {
        const usuarios = await queryListarUsuarios()

        if (!usuarios) {
            return res.status(404).json({ error: 'Nenhum usuário encontrado.'})
        }

        return res.status(200).json(usuarios) 
    } catch (error) {
        console.error("Ocorreu um erro ao listar os usuários:", error)
        return res.status(500).json({ error: `Erro ao listar os usuários: ${error.message}`})
    }
}

const controllerAtualizarUsuario = async (req,res) => {
    const {nome, email} = req.body

    if (!nome || !email) {
        return res.status(400).json({ error: 'Preencha ao menos um campo para ser atualizado'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' })
    }

    const {id} = req.usuario

    if (!id) {
        return res.status(200).json({ error: 'Não foi possível receber o id do usuário'})
    }

    try {
        const emailExistente = await queryBuscarPeloEmail(email)

        if (emailExistente) {
            return res.status(400).json({ error: 'Emal já cadastrado'})
        }

        await queryAtualizarUsuario(id, nome, email)

        return res.status(200).json({
            mensagem: 'Usuario atualizado!',
            usuario: {nome, email}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar o usuário:", error)
        return res.status(500).json({ mensagem: `Erro ao atualizar o usuário: ${error.message}`})
    }
}

const controllerAtualizarSenhaUsuario = async (req,res) => {
    const { novasenha } = req.body
    
    if (!novasenha) {
        return res.status(400).json({ error: 'informe a nova senha'})
    }

    const {id} = req.usuario

    if (!id) {
        return res.status(200).json({ error: 'Não foi possível receber o id do usuário'})
    }
    
    try {
        const novaSenhaCriptografada = await bcrypt.hash(novasenha, 10)
        await queryAtualizarSenhaUsuario(id, novaSenhaCriptografada)
        
        return res.status(200).json({ mensagem: 'Senha Atualizada'})
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a senha:", error)
        return res.status(500).json({ error: `Erro ao atualizar a senha: ${error.message}`})
    }
}

const controllerDeletarUsuario = async (req,res) => {
    const {id} = req.usuario

    if (!id) {
        return res.status(200).json({ error: 'Não foi possível receber o id do usuário'})
    }

    try {
        const usuario = await queryUsuarioExistente(id)

        if (!usuario) {
            return res.status(404).json({error: 'Usuário não encontrado'})
        }

        await queryDeletarUsuario(id)
        return res.status(200).json({mensagem: 'Usuário deletado com sucesso'})
    } catch (error) {
        console.log('Ocorreu um erro ao deletar o usuário', error)
        return res.status(500).json({ error: `Erro ao deletar o usuário: ${error.message}`})
    }
}



module.exports = {
    controllerCadastrarUsuario,
    controllerLoginUsuario,
    controllerObterUsuario,
    controllerListarUsuarios,
    controllerAtualizarUsuario,
    controllerAtualizarSenhaUsuario,
    controllerDeletarUsuario
}