const knex = require('../connection')

const queryCriarCategoria = async (nome, tipo, id) => {
  return await knex('categorias')
  .insert({nome, tipo, user_id: id})
  .returning('*')
}


const queryCategoriaExistente = async (categoria_id) => {
  return await knex('categorias')
  .where({ id: categoria_id })
  .first()
}

module.exports = {
  queryCategoriaExistente,
  queryCriarCategoria
}