const { queryCriarCategoria } = require("../database/querys/queryCategorias")

const controllerCriarCategoria = async (req, res) => {
    const {nome, tipo} = req.body

    if (!nome || !tipo) {
        return res.status(400).json({ error: 'Preencha os campos necessários'})
    }

    if (tipo !== 'entrada' && tipo !== 'despesa') {
        return res.status(400).json({ error: 'tipo deve ser entrada ou despesa'})
    }

    const {id} = req.usuario

    try { 
        await queryCriarCategoria(nome, tipo, id)

        return res.status(201).json({ 
            mensagem: 'Nova categoria criada',
            categoria: {nome, tipo}
        })
    } catch (error) {
        console.error("Ocorreu um erro ao cadastrar a categoria:", error)
        return res.status(500).json({ error: `Erro ao cadastrar a categoria: ${error.message}`})
    }
}

module.exports = {
    controllerCriarCategoria
}