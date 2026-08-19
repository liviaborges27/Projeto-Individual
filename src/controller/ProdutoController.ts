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

}
export default ProdutoController;