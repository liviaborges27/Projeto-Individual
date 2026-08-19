import type { Request, Response } from "express";
import Produto from "../model/Produto.js";
import type ProdutoDTO from "../dto/ProdutoDTO.js";

class ProdutoController {

    /**
      Lista todos os produtos ativos
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeProdutos = await Produto.listarProdutos();

            if (listaDeProdutos !== null) {
                return res.status(200).json(listaDeProdutos);
            } else {
                return res.status(400).json({ mensagem: "Erro ao buscar a lista de produtos." });
            }
        } catch (error) {
            console.error(`Erro ao listar produtos: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

     /**
     *- Busca produto por ID
     */
    static async produtoPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id_produto = parseInt(req.params.id_produto as string, 10);

            if (isNaN(id_produto)) {
                return res.status(400).json({ mensagem: "O ID do produto fornecido é inválido." });
            }

            const produto: ProdutoDTO | null = await Produto.listarProduto(id_produto);

            if (produto !== null) {
                return res.status(200).json(produto);
            } else {
                return res.status(404).json({ mensagem: "Produto não encontrado." });
            }
        } catch (error) {
            console.error(`Erro ao buscar produto por ID: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

     /*  Busca produto pelo Código Único 
     */
    static async produtoPorCodigo(req: Request, res: Response): Promise<Response> {
        try {
            const codigo = req.params.codigo as string;

            if (!codigo) {
                return res.status(400).json({ mensagem: "É necessário informar o código do produto." });
            }

            const produto: ProdutoDTO | null = await Produto.buscarPorCodigo(codigo);

            if (produto !== null) {
                return res.status(200).json(produto);
            } else {
                return res.status(404).json({ mensagem: "Nenhum produto foi encontrado com o código fornecido." });
            }
        } catch (error) {
            console.error(`Erro ao buscar produto por código: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
/**
     * Rota POST /produtos - Cadastra um novo produto no banco de dados com validações backend
     */
    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const { id_categoria, codigo, nome, descricao, preco_unitario, quantidade_minima } = req.body;

            // VALIDAÇÃO DE DADOS NO BACKEND
            if (!id_categoria || !codigo || !nome || preco_unitario === undefined || quantidade_minima === undefined) {
                return res.status(400).json({ 
                    mensagem: "Campos obrigatórios incompletos: id_categoria, codigo, nome, preco_unitario e quantidade_minima devem ser informados." 
                });
            }

            // Validação de Preço Não Negativo (Constraint ck_produto_preco / RN02)
            if (preco_unitario < 0) {
                return res.status(400).json({ mensagem: "O preço unitário não pode ser um valor negativo." });
            }

            // Validação de Quantidade Mínima Não Negativa (Constraint ck_produto_quantidade_minima)
            if (quantidade_minima < 0) {
                return res.status(400).json({ mensagem: "A quantidade mínima não pode ser um valor negativo." });
            }

            // Validação de duplicidade do Código (Constraint UQ_produto_codigo)
            const produtoExistente = await Produto.buscarPorCodigo(codigo);
            if (produtoExistente !== null) {
                return res.status(409).json({ mensagem: "Já existe um produto cadastrado com este código." });
            }

            // Cria instância da classe Produto
            const novoProduto = new Produto(
                id_categoria,
                codigo,
                nome,
                descricao || "",
                preco_unitario,
                quantidade_minima
            );

            // Chama a persistência no banco
            const cadastroSucesso = await Produto.cadastrarProduto(novoProduto);

            if (cadastroSucesso) {
                return res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível cadastrar o produto no banco de dados." });
            }

        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
/**
     * Rota DELETE /produtos/:id_produto - Desativa um produto (Desativação Lógica - RN18/RN19)
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_produto = parseInt(req.params.id_produto as string, 10);

            if (isNaN(id_produto)) {
                return res.status(400).json({ mensagem: "O ID do produto fornecido é inválido." });
            }

            const removido = await Produto.removerProduto(id_produto);

            if (removido) {
                return res.status(200).json({ mensagem: "Produto desativado com sucesso do sistema." });
            } else {
                return res.status(400).json({ mensagem: "Não foi possível desativar o produto. Verifique se ele existe e se está ativo." });
            }
        } catch (error) {
            console.error(`Erro ao desativar produto: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }




}
export default ProdutoController;