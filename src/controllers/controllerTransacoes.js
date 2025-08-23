const { queryListarTransacoes } = require("../database/querys/queryTransacoes");

const controllerListarTransacoes = async (req, res) => {
    const { data_inicio, data_fim, tipo, categoria_id } = req.query

    try {
        const userId = req.usuario

        const filtros = { data_inicio, data_fim, tipo, categoria_id }
        const transacoes = await queryListarTransacoes(userId, filtros)

        return res.status(200).json(transacoes)
    } catch (error) {
        console.error("Ocorreu um erro ao listar:", error)
        return res.status(500).json({ error: `Erro ao realizar o Login: ${error.message}`})
    }
}

module.exports = {
    controllerListarTransacoes
}