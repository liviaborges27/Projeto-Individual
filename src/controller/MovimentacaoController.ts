import type { Request, Response } from "express";
import MovimentacaoEstoque from "../model/MovimentacaoEstoque.js";
import Produto from "../model/Produto.js";

class MovimentacaoController {

    /**
     * GET /movimentacoes - Lista todas as movimentações
     */
    static async todas(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await MovimentacaoEstoque.listarMovimentacoes();
            if (lista !== null) {
                return res.status(200).json(lista);
            }
            return res.status(400).json({ mensagem: "Erro ao buscar movimentações." });
        } catch (error) {
            console.error("Erro no controller ao listar movimentações:", error);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    /**
     * GET /movimentacoes/produto/:id_produto - Lista movimentações por produto
     */
    static async porProduto(req: Request, res: Response): Promise<Response> {
        try {
            const id_produto = parseInt(req.params.id_produto as string, 10);

            if (isNaN(id_produto)) {
                return res.status(400).json({ mensagem: "O ID do produto fornecido é inválido." });
            }

            const lista = await MovimentacaoEstoque.buscarPorProduto(id_produto);
            if (lista !== null) {
                return res.status(200).json(lista);
            }
            return res.status(404).json({ mensagem: "Nenhuma movimentação encontrada para o produto informado." });
        } catch (error) {
            console.error("Erro no controller ao buscar por produto:", error);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    /**
     * POST /movimentacoes - Registra movimentação de estoque
     */
    static async nova(req: Request, res: Response): Promise<Response> {
        try {
            const { id_produto, tipo, quantidade, observacao } = req.body;

            if (!id_produto || isNaN(Number(id_produto))) {
                return res.status(400).json({ mensagem: "O ID do produto é obrigatório e deve ser numérico." });
            }

            const tipoUpper = typeof tipo === 'string' ? tipo.toUpperCase() : '';
            if (tipoUpper !== 'ENTRADA' && tipoUpper !== 'SAIDA') {
                return res.status(400).json({ mensagem: "O tipo de movimentação deve ser estritamente 'ENTRADA' ou 'SAIDA'." });
            }

            const qtd = Number(quantidade);
            if (isNaN(qtd) || qtd <= 0 || !Number.isInteger(qtd)) {
                return res.status(400).json({ mensagem: "A quantidade deve ser um número inteiro positivo maior que zero." });
            }

            const produtoExistente = await Produto.listarProduto(Number(id_produto));
            if (!produtoExistente || !produtoExistente.ativo) {
                return res.status(404).json({ mensagem: "Produto não encontrado ou desativado no sistema." });
            }

            const novaMovimentacao = new MovimentacaoEstoque(
                Number(id_produto),
                tipoUpper as 'ENTRADA' | 'SAIDA',
                qtd,
                observacao || ""
            );

            const registrado = await MovimentacaoEstoque.registrarMovimentacao(novaMovimentacao);

            if (registrado) {
                return res.status(201).json({ mensagem: "Movimentação registrada com sucesso!" });
            }
            return res.status(400).json({ mensagem: "Não foi possível registrar a movimentação." });
        } catch (error) {
            console.error("Erro no controller ao registrar movimentação:", error);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default MovimentacaoController;