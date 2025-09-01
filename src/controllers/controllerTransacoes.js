const { queryCategoriaExistente } = require("../database/querys/queryCategorias")
const { queryListarTransacoes, queryVerificarTransacao, queryNovaTransacao } = require("../database/querys/queryTransacoes")

const controllerListarTransacoes = async (req, res) => {
    const { data_inicio, data_fim, tipo, categoria_id } = req.query

    try {
        const userId = req.usuario

        const filtros = { data_inicio, data_fim, tipo, categoria_id }
        const transacoes = await queryListarTransacoes(userId, filtros)

        return res.status(200).json(transacoes)
    } catch (error) {
        console.error("Ocorreu um erro ao listar as transações:", error)
        return res.status(500).json({ error: `Erro ao listar as transações: ${error.message}`})
    }
}

const controllerDetalharTransacoes = async (req,res) => {
    const {id} = req.usuario

    if (!id) {
        return res.status(200).json({ error: 'Não foi possível receber o id do usuário'})
    }

    const { transacaoId } = req.params

    if (!transacaoId) {
        return res.status(400).json({ error: 'informe o id da transação'})
    }
   
    try {
        const usuario_id = id

        const TransacaoExistente = await queryVerificarTransacao(transacaoId, usuario_id)

        if (!TransacaoExistente) {
            return res.status(404).json({error: 'Transação não existe'})
        }

        return res.status(200).json(TransacaoExistente)
    } catch (error) {
        console.error("Ocorreu um erro ao detalhar a transação:", error)
        return res.status(500).json({ error: `Erro ao realizar o Login: ${error.message}`})
    }
}

const controllerCriarTransacao = async (req, res) => {
    const { descricao, valor, tipo, categoria_id } = req.body

    if (!descricao || !valor || !tipo ) {  //categoria_id
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    if (tipo !== 'entrada' && tipo !== 'despesa') {
        return res.status(400).json({ error: 'o tipo deve ser entrada ou despesa'})
    }

    if (valor <= 0) {
        return res.status(400).json({ error: 'o valor deve ser positivo'})
    }

    const {id} = req.usuario

    try {
        const categoriaExistente = await queryCategoriaExistente(categoria_id) //(categoria_id)

        if (!categoriaExistente) {
            return res.status(400).json({ error: 'Categoria não existe'})
        }

        await queryNovaTransacao(descricao, valor, tipo, id, categoria_id)

        return res.status(201).json({
            mensagem: 'Nova transação registrada',
            transacao: {descricao, valor, tipo}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar a transação:", error)
        return res.status(500).json({ error: `Erro ao cadastrar a transação: ${error.message}`})
    }

}

module.exports = {
    controllerListarTransacoes,
    controllerDetalharTransacoes,
    controllerCriarTransacao
}



