import { DatabaseModel } from "./DatabaseModel.js";
import type CategoriaDTO from "../dto/CategoriaDTO.js";

const database = new DatabaseModel().pool;

export default class Categoria {
    id_categoria?: number;
    nome: string;
    descricao?: string;
    ativo?: boolean;
    data_cadastro?: Date | string;

    constructor(nome: string, descricao: string = "") {
        this.nome = nome;
        this.descricao = descricao;
        this.ativo = true;
    }

    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {
        try {
            const query = `SELECT * FROM categoria WHERE ativo = TRUE ORDER BY nome;`;
            const respostaBD = await database.query(query);

            return respostaBD.rows.map((categoria: any) => ({
                id_categoria: categoria.id_categoria,
                nome: categoria.nome,
                ativo: categoria.ativo,
                data_cadastro: categoria.data_cadastro
            }));
        } catch (error) {
            console.error("Erro ao listar categorias:", error);
            return null;
        }
    }

    static async buscarPorId(id_categoria: number): Promise<CategoriaDTO | null> {
        try {
            const query = `SELECT * FROM categoria WHERE id_categoria = $1;`;
            const respostaBD = await database.query(query, [id_categoria]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const categoria = respostaBD.rows[0];
            return {
                id_categoria: categoria.id_categoria,
                nome: categoria.nome,
                ativo: categoria.ativo,
                data_cadastro: categoria.data_cadastro
            };
        } catch (error) {
            console.error("Erro ao buscar categoria por id:", error);
            return null;
        }
    }

    static async cadastrarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const query = `
                INSERT INTO categoria (nome, ativo)
                VALUES ($1, TRUE)
                RETURNING id_categoria;
            `;

            const respostaBD = await database.query(query, [categoria.nome]);
            return (respostaBD.rowCount ?? 0) > 0;
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            return false;
        }
    }

    static async atualizarCategoria(id_categoria: number, nome: string, ativo: boolean = true): Promise<boolean> {
        try {
            const query = `
                UPDATE categoria
                SET nome = $1,
                    ativo = $2
                WHERE id_categoria = $3;
            `;

            const respostaBD = await database.query(query, [nome, ativo, id_categoria]);
            return (respostaBD.rowCount ?? 0) > 0;
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            return false;
        }
    }

    static async removerCategoria(id_categoria: number): Promise<boolean> {
        try {
            const query = `UPDATE categoria SET ativo = FALSE WHERE id_categoria = $1;`;
            const respostaBD = await database.query(query, [id_categoria]);
            return (respostaBD.rowCount ?? 0) > 0;
        } catch (error) {
            console.error("Erro ao remover categoria:", error);
            return false;
        }
    }
}