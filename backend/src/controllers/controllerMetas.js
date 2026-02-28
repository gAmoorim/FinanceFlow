const { queryCriarNovaMeta, queryListarMetas, queryObterMeta, queryAtualizarMeta, queryExcluirMeta } = require("../database/querys/queryMetas");

const controllerCriarNovaMeta = async (req, res) => {
    const { titulo, valor_atual, valor_alvo, mes, ano } = req.body

    if (!titulo || !valor_atual || !valor_alvo || !mes || !ano) {
        return res.status(400).jdon({ error: 'Preencha todos os campos'})
    }

    if (valor_atual < 0) {
        console.error("Valor inválido: não pode ser negativo!");
    }

    if (valor_alvo <= 0) {
        console.error("Valor inválido: não pode ser negativo!");
    }

    try {
        const user_id = req.usuario.id

        if (!user_id) {
            return res.status(400).json({ error: 'Não foi possível obter o id do usuário'})
        }

        const novaMeta = await queryCriarNovaMeta(titulo, valor_atual, valor_alvo, mes, ano, user_id)
        return res.status(201).json({
            mensagem: 'Nova meta criada',
            meta: novaMeta
        })
    } catch (error) {
        console.error("Ocorreu um erro ao criar a meta:", error)
        return res.status(500).json({ error: `Erro ao criar a meta: ${error.message}`})
    }

}

const controllerListarMetas = async (req, res) => {
    const user_id = req.usuario.id

    try {
        const metas = await queryListarMetas(user_id)

        if (!metas) {
            return res.status(404).json({ error: 'Nenhuma meta encontrada'})
        }

        return res.status(200).json({ mensagem: 'metas',
            metas: metas
        })
    } catch (error) {
        console.error("Ocorreu um erro ao listas as metas:", error)
        return res.status(500).json({ error: `Erro ao listar as metas: ${error.message}`})
    }
}

const controllerAtualizarMetas = async (req, res) => {
    const { titulo, valor_atual, valor_alvo, mes, ano } = req.body
    const { id } = req.params
    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(400).json({ error: 'Não foi possivel receber o id do usuário'})
    }

    if (!titulo && !valor_atual && !valor_alvo && !mes && !ano) {
        return res.status(400).json({ error: 'Preencha ao menos um campo para ser atualizado' })
    }

    try {
        const meta = await queryObterMeta(id, user_id)

        if (!meta) {
            return res.status(404).json({ error: 'Meta não encontrada'})
        }

        const metaAtualizada = await queryAtualizarMeta(id, user_id, titulo, valor_atual, valor_alvo, mes, ano)

        return res.status(200).json({ mensagem: 'meta atualizada',
            meta: metaAtualizada
        })
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a meta:", error)
        return res.status(500).json({ error: `Erro ao atualizar a meta: ${error.message}`})
    }
}

const controllerExcluirMeta = async (req, res) => {
    const { id } = req.params
    const user_id = req.usuario.id

    if (!user_id) {
        return res.status(400).json({ error: 'Não foi possível obter o id do usuário' })
    }

    try {
        const meta = await queryObterMeta(id, user_id)

        if (!meta) {
            return res.status(404).json({ error: 'Meta não encontrada'})
        }

        await queryExcluirMeta(id, user_id)

        return res.status(200).json({ mensagem: 'Meta deletada com sucesso'})
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar a meta:", error)
        return res.status(500).json({ error: `Erro ao atualizar a meta: ${error.message}`})
    }
}


module.exports = {
    controllerCriarNovaMeta,
    controllerListarMetas,
    controllerAtualizarMetas,
    controllerExcluirMeta
}