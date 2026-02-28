const knex = require('../connection')

const queryListarTransacoes = async (user_id, filtros) => {
  let query = knex("transacoes").where("user_id", user_id)

  if (filtros.data_inicio) {
    query = query.where("data", ">=", filtros.data_inicio)
  }

  if (filtros.data_fim) {
    query = query.where("data", "<=", filtros.data_fim)
  }

  if (filtros.tipo) {
    query = query.where("tipo", filtros.tipo)
  }

  return await query.select("*")
}

const queryVerificarTransacao = async (transacaoId, user_id) => { 
  return await knex('transacoes') 
  .where({ id: transacaoId, user_id}) 
  .first()
}

const queryNovaTransacao = async (descricao, valor, tipo, user_id) => {
  return await knex('transacoes')
  .insert({descricao, valor, tipo, user_id})
}

const queryAtualizarTransacao = async (transacaoId, user_id, descricao, valor, tipo) => {
  return await knex('transacoes')
  .update({descricao, valor, tipo})
  .where({id: transacaoId, user_id})
  
}

const queryDeletarTransacao = async (user_id, transacaoId) => {
  return await knex('transacoes')
  .where({id: transacaoId, user_id})
  .delete()
}

const queryTransacoes = async (user_id) => {
  return await knex('transacoes')
  .where({user_id})
  .returning('*')
}

module.exports = {
  queryListarTransacoes,
  queryVerificarTransacao,
  queryNovaTransacao,
  queryAtualizarTransacao,
  queryDeletarTransacao,
  queryTransacoes
}