const categoriasBase = [
  { nome: "Alimentação", tipo: "despesa", subcategorias: ["Supermercado", "Restaurante", "Lanche"] },
  { nome: "Transporte", tipo: "despesa", subcategorias: ["Ônibus", "Uber", "Gasolina"] },
  { nome: "Moradia", tipo: "despesa", subcategorias: ["Aluguel", "Água", "Luz", "Internet"] },
  { nome: "Saúde", tipo: "despesa", subcategorias: ["Farmácia", "Consulta médica"] },
  { nome: "Lazer", tipo: "despesa", subcategorias: ["Cinema", "Viagem", "Assinaturas"] },
  { nome: "Educação", tipo: "despesa", subcategorias: ["Cursos", "Livros"] },
  { nome: "Renda", tipo: "receita", subcategorias: ["Salário", "Investimentos", "Freelance"] }
]

async function criarCategoriasBase(usuarioId, knex) {
  for (const cat of categoriasBase) {
    const [categoriaId] = await knex('categorias')
      .insert({
        nome: cat.nome,
        tipo: cat.tipo,
        user_id: usuarioId
      })
      .returning('id');

    for (const sub of cat.subcategorias) {
      await knex('categorias').insert({
        nome: sub,
        tipo: cat.tipo,
        user_id: usuarioId,
        categoria_pai_id: categoriaId
      })
    }
  }
}

module.exports = { criarCategoriasBase }