import type CategoriaDTO from "../dto/CategoriaDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Categoria {
    private id_categoria: number = 0;
    private nome: string;
    private descricao: string;
    private ativo: boolean = true;
    private data_cadastro?: Date | string;

    constructor(_nome: string, _descricao: string = "") {
        this.nome = _nome;
        this.descricao = _descricao;
    }

    // Getters e Setters
    public getIdCategoria(): number { return this.id_categoria; }
    public setIdCategoria(value: number) { this.id_categoria = value; }

    public getNome(): string { return this.nome; }
    public setNome(value: string) { this.nome = value; }

    public getDescricao(): string { return this.descricao; }
    public setDescricao(value: string) { this.descricao = value; }

    public getAtivo(): boolean { return this.ativo; }
    public setAtivo(value: boolean) { this.ativo = value; }

    public getDataCadastro(): Date | string | undefined { return this.data_cadastro; }
    public setDataCadastro(value: Date | string) { this.data_cadastro = value; }

    /**
     * Lista todas as categorias ativas
     */
    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {
        let lista: Array<CategoriaDTO> = [];
        try {
            const query = `SELECT * FROM categoria WHERE ativo = TRUE ORDER BY nome;`;
            const respostaBD = await database.query(query);

            respostaBD.rows.forEach((cat) => {
                const dto: CategoriaDTO = {
                    id_categoria: cat.id_categoria,
                    nome: cat.nome,
                    descricao: cat.descricao,
                    ativo: cat.ativo,
                    data_cadastro: cat.data_cadastro
                };
                lista.push(dto);
            });

            return lista;
        } catch (error) {
            console.error(`Erro ao listar categorias: ${error}`);
            return null;
        }
    }

    /**
     * Busca uma categoria pelo ID
     */
    static async buscarPorId(id_categoria: number): Promise<CategoriaDTO | null> {
        try {
            const query = `SELECT * FROM categoria WHERE id_categoria = $1;`;
            const respostaBD = await database.query(query, [id_categoria]);

            if (respostaBD.rows.length === 0) return null;

            const cat = respostaBD.rows[0];
            return {
                id_categoria: cat.id_categoria,
                nome: cat.nome,
                descricao: cat.descricao,
                ativo: cat.ativo,
                data_cadastro: cat.data_cadastro
            };
        } catch (error) {
            console.error(`Erro ao buscar categoria por ID: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra uma nova categoria no banco de dados
     */
    static async cadastrarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const query = `
                INSERT INTO categoria (nome, descricao)
                VALUES ($1, $2)
                RETURNING id_categoria;`;

            const valores = [
                categoria.getNome().toUpperCase(),
                categoria.getDescricao()
            ];

            const result = await database.query(query, valores);
            return result.rows.length > 0;
        } catch (error) {
            console.error(`Erro ao cadastrar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Atualiza dados de uma categoria
     */
    static async atualizarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const query = `
                UPDATE categoria 
                SET nome = $1, descricao = $2
                WHERE id_categoria = $3;`;

            const valores = [
                categoria.getNome().toUpperCase(),
                categoria.getDescricao(),
                categoria.getIdCategoria()
            ];

            const result = await database.query(query, valores);
            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error}`);
            return false;
        }
    }

    /**
     * Remoção lógica (Desativação)
     */
    static async removerCategoria(id_categoria: number): Promise<boolean> {
        try {
            const query = `UPDATE categoria SET ativo = FALSE WHERE id_categoria = $1;`;
            const result = await database.query(query, [id_categoria]);
            return result.rowCount !== 0;
        } catch (error) {
            console.error(`Erro ao desativar categoria: ${error}`);
            return false;
        }
    }
}

export default Categoria;