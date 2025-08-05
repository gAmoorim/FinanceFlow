const knex = require('../connection')

const queryBuscarPeloEmail = async (email) => {
    return await knex('usuarios')
    .where({email})
    .first()
}

const queryCadastrarUsuario = async (nome, email, senhaCriptografada) => {
    return await knex('usuarios')
    .insert({nome, email, senha: senhaCriptografada})
}

const queryListarUsuarios = async () => {
    return await knex('usuarios')
}


module.exports = {
    queryListarUsuarios,
    queryBuscarPeloEmail,
    queryCadastrarUsuario
}