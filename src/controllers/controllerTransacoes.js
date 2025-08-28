const { queryListarTransacoes, queryVerificarTransacao } = require("../database/querys/queryTransacoes");

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

    const { transacaoId } = req.params

    if (!transacaoId) {
        return res.status(400).json({mensagem: 'informe o id da transação'})
    }
   
    try {
        const usuario_id = id

        const TransacaoExistente = await queryVerificarTransacao(transacaoId, usuario_id)

        if (!TransacaoExistente) {
            return res.status(404).json({mensagem: 'Transação não existe'})
        }

        return res.status(200).json(TransacaoExistente)
    } catch (error) {
        console.error("Ocorreu um erro ao detalhar a transação:", error)
        return res.status(500).json({ error: `Erro ao realizar o Login: ${error.message}`})
    }
}

const controllerCriarTransacao = async (req, res) => {
    const { descricao, valor, tipo, categoria_id } = req.body
}

module.exports = {
    controllerListarTransacoes,
    controllerDetalharTransacoes
}



