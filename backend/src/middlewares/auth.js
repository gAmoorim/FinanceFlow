require('dotenv').config()
const jwt = require('jsonwebtoken')
const { queryUsuarioExistente } = require('../database/querys/queryUsuarios')
const senhaJWT = process.env.JWT_PWD

const auth = async (req,res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(400).json({mensagem: 'Não autorizado'})
    }

    try {
        const token = authorization.replace('Bearer ', '').trim()
        
        if (!token) {
            return res.status(401).json({ error: 'Token ausente' });
        }
        
        const { id } = jwt.verify(token,senhaJWT)
        const usuarioExistente = await queryUsuarioExistente(id)

        if (!usuarioExistente) {
            return res.status(400).json({mensagem: 'Usuário não encontrado'})
        }
        
        const { senha, ...usuario } = usuarioExistente

        req.usuario = usuario

        next()
    } catch (error) {
        console.error("Ocorreu um erro:", error)
        return res.status(401).json(error.message)
    }
}

module.exports = auth