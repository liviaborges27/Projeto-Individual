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




}
export default ProdutoController;