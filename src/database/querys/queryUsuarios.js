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
    .select('id', 'nome', 'email', 'criado_em')
}

const queryUsuarioExistente = async (id) => {
    return await knex('usuarios')
    .where({id})
    .first()
}

const queryAtualizarUsuario = async (id, nome, email) => {
    return await knex('usuarios')
    .update({nome, email})
    .where('id', id)
}

const queryAtualizarSenhaUsuario = async (id, novaSenhaCriptografada) => {
    return await knex('usuarios')
    .update({senha: novaSenhaCriptografada})
    .where('id', id)

}

const queryDeletarUsuario = async (id) => {
    return await knex('usuarios')
    .where('id', id)
    .delete()
}

module.exports = {
    queryListarUsuarios,
    queryBuscarPeloEmail,
    queryCadastrarUsuario,
    queryUsuarioExistente,
    queryAtualizarUsuario,
    queryAtualizarSenhaUsuario,
    queryDeletarUsuario
}