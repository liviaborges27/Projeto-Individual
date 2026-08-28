import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class MovimentacaoEstoque {
    private id_movimentacao: number = 0;
    private id_produto: number;
    private tipo: 'ENTRADA' | 'SAIDA';
    private quantidade: number;
    private observacao: string;
    private data_movimentacao?: Date | string;

    constructor(_id_produto: number, _tipo: 'ENTRADA' | 'SAIDA', _quantidade: number, _observacao: string = "") {
        this.id_produto = _id_produto;
        this.tipo = _tipo;
        this.quantidade = _quantidade;
        this.observacao = _observacao;
    }

    // Getters e Setters
    public getIdMovimentacao(): number { return this.id_movimentacao; }
    public setIdMovimentacao(value: number) { this.id_movimentacao = value; }

    public getIdProduto(): number { return this.id_produto; }
    public setIdProduto(value: number) { this.id_produto = value; }

    public getTipo(): 'ENTRADA' | 'SAIDA' { return this.tipo; }
    public setTipo(value: 'ENTRADA' | 'SAIDA') { this.tipo = value; }

    public getQuantidade(): number { return this.quantidade; }
    public setQuantidade(value: number) { this.quantidade = value; }

    public getObservacao(): string { return this.observacao; }
    public setObservacao(value: string) { this.observacao = value; }

    public getDataMovimentacao(): Date | string | undefined { return this.data_movimentacao; }

    /**
     * Lista todas as movimentações registradas
     */
    static async listarMovimentacoes(): Promise<Array<MovimentacaoDTO> | null> {
        let lista: Array<MovimentacaoDTO> = [];
        try {
            const query = `SELECT * FROM movimentacao_estoque ORDER BY data_movimentacao DESC;`;
            const respostaBD = await database.query(query);

            respostaBD.rows.forEach((row) => {
                lista.push({
                    id_movimentacao: row.id_movimentacao,
                    id_produto: row.id_produto,
                    tipo: row.tipo,
                    quantidade: row.quantidade,
                    observacao: row.observacao,
                    data_movimentacao: row.data_movimentacao
                });
            });

            return lista;
        } catch (error) {
            console.error(`Erro ao listar movimentações: ${error}`);
            return null;
        }
    }

    /**
     * ROTA ESPECÍFICA: Busca histórico de movimentações filtrando por id_produto
     */
    static async buscarPorProduto(id_produto: number): Promise<Array<MovimentacaoDTO> | null> {
        let lista: Array<MovimentacaoDTO> = [];
        try {
            const query = `SELECT * FROM movimentacao_estoque WHERE id_produto = $1 ORDER BY data_movimentacao DESC;`;
            const respostaBD = await database.query(query, [id_produto]);

            respostaBD.rows.forEach((row) => {
                lista.push({
                    id_movimentacao: row.id_movimentacao,
                    id_produto: row.id_produto,
                    tipo: row.tipo,
                    quantidade: row.quantidade,
                    observacao: row.observacao,
                    data_movimentacao: row.data_movimentacao
                });
            });

            return lista;
        } catch (error) {
            console.error(`Erro ao buscar movimentações do produto: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra nova movimentação no banco
     */
    static async registrarMovimentacao(movimentacao: MovimentacaoEstoque): Promise<boolean> {
        try {
            const query = `
                INSERT INTO movimentacao_estoque (id_produto, tipo, quantidade, observacao)
                VALUES ($1, $2, $3, $4)
                RETURNING id_movimentacao;`;

            const valores = [
                movimentacao.getIdProduto(),
                movimentacao.getTipo(),
                movimentacao.getQuantidade(),
                movimentacao.getObservacao()
            ];

            const result = await database.query(query, valores);
            return result.rows.length > 0;
        } catch (error) {
            console.error(`Erro ao registrar movimentação: ${error}`);
            return false;
        }
    }
}

export default MovimentacaoEstoque;