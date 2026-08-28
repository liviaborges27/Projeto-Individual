import type { Request, Response } from "express";
import MovimentacaoEstoque from "../model/MovimentacaoEstoque.js";
import Produto from "../model/Produto.js";

class MovimentacaoController {

    static async todas(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await MovimentacaoEstoque.listarMovimentacoes();
            if (lista !== null) {
                return res.status(200).json(lista);
            }
            return res.status(400).json({ mensagem: "Erro ao buscar movimentações." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    /**
     * ROTA ESPECÍFICA: GET /movimentacoes/produto/:id_produto
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
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    /**
     * POST /movimentacoes - Registra movimentação com validação do back-end
     */
    static async nova(req: Request, res: Response): Promise<Response> {
        try {
            const { id_produto, tipo, quantidade, observacao } = req.body;

            // VALIDAÇÕES DE DADOS NO BACKEND
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

            // Valida se o produto existe e está ativo antes de movimentar estoque
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
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default MovimentacaoController;