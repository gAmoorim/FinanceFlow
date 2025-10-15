const knex = require('../connection')

const queryCriarNovaMeta = async (titulo, valor_atual, valor_alvo, mes, ano, user_id) => {
    return await knex('metas')
    .insert({titulo, valor_atual, valor_alvo, mes, ano, user_id})
    .returning('*')
}

const queryListarMetas = async (user_id) => {
    return await knex('metas')
    .where({user_id})
    .returning('*')
}

const queryObterMeta = async (id, user_id) => {
    return await knex('metas')
    .where({ id, user_id})
    .first()
}

const queryAtualizarMeta = async (id, user_id, titulo, valor_atual, valor_alvo, mes, ano) => {
    return await knex('metas')
    .where({id, user_id})
    .update({titulo, valor_atual, valor_alvo, mes, ano})
    .returning('*')
}

const queryExcluirMeta = async (id, user_id) => {
    return await knex('metas')
    .where({id, user_id})
    .delete()
}

module.exports = {
    queryCriarNovaMeta,
    queryListarMetas,
    queryObterMeta,
    queryAtualizarMeta,
    queryExcluirMeta
}