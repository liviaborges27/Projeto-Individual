import type { Request, Response } from "express";
import Categoria from "../model/Categoria.js";
import type CategoriaDTO from "../dto/CategoriaDTO.js";

class CategoriaController {

    static async todas(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = await Categoria.listarCategorias();
            if (categorias !== null) {
                return res.status(200).json(categorias);
            }
            return res.status(400).json({ mensagem: "Erro ao buscar a lista de categorias." });
        } catch (error) {
            console.error(`Erro ao listar categorias: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async categoriaPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id_categoria = parseInt(req.params.id_categoria as string, 10);
            if (isNaN(id_categoria)) {
                return res.status(400).json({ mensagem: "O ID da categoria fornecido é inválido." });
            }

            const categoria: CategoriaDTO | null = await Categoria.buscarPorId(id_categoria);
            if (categoria) {
                return res.status(200).json(categoria);
            }
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async nova(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, descricao } = req.body;

            // VALIDAÇÃO DE DADOS NO BACKEND
            if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
                return res.status(400).json({ mensagem: "O nome da categoria é obrigatório e deve conter ao menos 2 caracteres." });
            }

            const novaCategoria = new Categoria(nome.trim(), descricao || "");
            const cadastrado = await Categoria.cadastrarCategoria(novaCategoria);

            if (cadastrado) {
                return res.status(201).json({ mensagem: "Categoria cadastrada com sucesso!" });
            }
            return res.status(400).json({ mensagem: "Erro ao cadastrar categoria no banco de dados." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
    try {
        const id_categoria = Number(req.params.id_categoria);
        const { nome, ativo } = req.body;

        if (isNaN(id_categoria) || !nome) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar a categoria." });
        }

        const atualizado = await Categoria.atualizarCategoria(id_categoria, nome, ativo ?? true);

        if (atualizado) {
            return res.status(200).json({ mensagem: "Categoria atualizada com sucesso!" });
        } else {
            return res.status(400).json({ mensagem: "Não foi possível atualizar a categoria." });
        }
    } catch (error) {
        console.error("Erro no controller ao atualizar categoria:", error);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
}

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_categoria = parseInt(req.params.id_categoria as string, 10);
            if (isNaN(id_categoria)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const removido = await Categoria.removerCategoria(id_categoria);
            if (removido) {
                return res.status(200).json({ mensagem: "Categoria desativada com sucesso." });
            }
            return res.status(400).json({ mensagem: "Não foi possível desativar a categoria." });
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro interno no servidor." });
        }
    }
}

export default CategoriaController;