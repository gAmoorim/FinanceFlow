const bcrypt = require('bcrypt')
const { queryListarUsuarios, queryBuscarPeloEmail, queryCadastrarUsuario } = require('../database/querys/queryUsuarios')
const { validarEmail } = require('../utils/validations')

const controllerCadastrarUsuario = async (req,res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha os campos: nome, senha e email'})
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ error: 'Formato do email inválido' });
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
        await queryCadastrarUsuario(nome, email, senhaCriptografada)

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: {nome, email}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar o usuario:", error)
        return res.status(500).json({ mensagem: `Erro ao cadastrar usuário: ${error.message}`})
    }
}

const controllerListarUsuarios = async (req,res) => {
    try {
        const usuarios = await queryListarUsuarios()
        return res.status(200).json(usuarios) 
    } catch (error) {
        
    }
}

module.exports = {
    controllerListarUsuarios,
    controllerCadastrarUsuario
}