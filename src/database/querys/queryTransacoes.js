const knex = require('../connection')

const queryListarTransacoes = async (userId, filtros) => {
  let query = knex("transacoes").where("usuario_id", userId)

  if (filtros.data_inicio) {
    query = query.where("data", ">=", filtros.data_inicio)
  }

  if (filtros.data_fim) {
    query = query.where("data", "<=", filtros.data_fim)
  }

  if (filtros.tipo) {
    query = query.where("tipo", filtros.tipo)
  }

  if (filtros.categoria_id) {
    query = query.where("categoria_id", filtros.categoria_id)
  }

  return await query.select("*")
}

const queryVerificarTransacao = async (transacaoId, usuario_id) => { 
  return await knex('transacoes') 
  .where({ id: transacaoId, user_id: usuario_id }) 
  .first()
}

module.exports = {
  queryListarTransacoes,
  queryVerificarTransacao
}