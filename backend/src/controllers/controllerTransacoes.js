const { queryListarTransacoes, queryVerificarTransacao, queryNovaTransacao, queryAtualizarTransacao, queryDeletarTransacao, queryTransacoes } = require("../database/querys/queryTransacoes")

const controllerListarTransacoes = async (req, res) => {
    const { data_inicio, data_fim, tipo } = req.query

    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(200).json({ error: 'Não foi possível obter o id do usuário'})
    }

    try {
        const filtros = { data_inicio, data_fim, tipo }
        const transacoes = await queryListarTransacoes(user_id, filtros)

        return res.status(200).json(transacoes)
    } catch (error) {
        console.error("Ocorreu um erro ao listar as transações:", error)
        return res.status(500).json({ error: `Erro ao listar as transações: ${error.message}`})
    }
}

const controllerDetalharTransacoes = async (req,res) => {
    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(200).json({ error: 'Não foi possível obter o id do usuário'})
    }

    const { transacaoId } = req.params

    if (!transacaoId) {
        return res.status(400).json({ error: 'Informe o id da transação'})
    }
   
    try {
        const transacoes = await queryVerificarTransacao(transacaoId, user_id)

        if (!transacoes) {
            return res.status(404).json({error: 'Transação não existe'})
        }

        return res.status(200).json(transacoes)
    } catch (error) {
        console.error("Ocorreu um erro ao detalhar a transação:", error)
        return res.status(500).json({ error: `Erro ao realizar o Login: ${error.message}`})
    }
}

const controllerCriarTransacao = async (req, res) => {
    const { descricao, valor, tipo } = req.body

    if (!descricao || !valor || !tipo ) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    if (valor <= 0) {
        return res.status(400).json({ error: 'o valor deve ser positivo'})
    }

    if (tipo !== 'entrada' && tipo !== 'despesa') {
        return res.status(400).json({ error: 'o tipo deve ser entrada ou despesa'})
    }
    
    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(200).json({ error: 'Não foi possível obter o id do usuário'})
    }

    try {
        await queryNovaTransacao(descricao, valor, tipo, user_id)

        return res.status(201).json({
            mensagem: 'Nova transação registrada',
            transacao: {descricao, valor, tipo}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar a transação:", error)
        return res.status(500).json({ error: `Erro ao cadastrar a transação: ${error.message}`})
    }

}

const controllerAtualizarTransacao = async (req, res) => {
    const { descricao, valor, tipo } = req.body

    if (!descricao && !valor && !tipo) {
        return res.status(400).json({ error: 'Preencha os campos para serem atualizados' })
    }
    
    const { transacaoId } = req.params

    if (!transacaoId) {
        return res.status(400).json({ error: 'Informe o id da transação'})
    }

    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(200).json({ error: 'Não foi possível obter o id do usuário'})
    }

    try {
        const transacaoExistente = await queryVerificarTransacao(transacaoId, user_id)

        if (!transacaoExistente) {
            return res.status(404).json({ error: 'Transação não existente'})
        }

        await queryAtualizarTransacao(transacaoId, user_id, descricao, valor, tipo)

        return res.status(204).json({
            mensagem: 'Transação atualizada'
        })
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a transação:", error)
        return res.status(500).json({ error: `Erro ao atualizar a transação: ${error.message}`})
    }
}

const controllerExlcuirTransacao = async (req, res) => {
    const {transacaoId} = req.params

    if (!transacaoId) {
        return res.status(400).json({ error: 'Informe o id da transação'})
    }

    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(200).json({ error: 'Não foi possível obter o id do usuário'})
    }

    try {
        const transacaoExistente = await queryVerificarTransacao(transacaoId, user_id)

        if (!transacaoExistente) {
            return res.status(404).json({ error: 'Transacao não encontrada'})
        }

        await queryDeletarTransacao(user_id, transacaoId)
        return res.status(204).json({ mensagem: 'Transacao deletada com sucesso'})
    } catch (error) {
        console.error("Ocorreu um erro ao deletar a transação:", error)
        return res.status(500).json({ error: `Erro ao deletar a transação: ${error.message}`})
    }
}

const controllerResumoTransacoes = async (req, res) => {
    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(400).json({ error: 'Não foi possível obter o id do usuárioo'})
    }

    try {
        const transacoes = await queryTransacoes(user_id)

        const entradas = transacoes
        .filter(t => t.tipo === "entrada")
        .reduce((acc, t) => acc + Number(t.valor), 0)

        const saidas = transacoes
        .filter(t => t.tipo === "despesa")
        .reduce((acc, t) => acc + Number(t.valor), 0)

        const saldo = entradas - saidas
        return res.status(200).json({ entradas, saidas, saldo })
    } catch (error) {
        console.error("Ocorreu um erro ao gerar o resumo:", error)
        return res.status(500).json({ error: `Erro ao gerar o resumo: ${error.message}`})
    }
}

module.exports = {
    controllerListarTransacoes,
    controllerDetalharTransacoes,
    controllerCriarTransacao,
    controllerAtualizarTransacao,
    controllerExlcuirTransacao,
    controllerResumoTransacoes
}