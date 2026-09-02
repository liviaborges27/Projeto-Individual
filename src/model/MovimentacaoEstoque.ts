import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

export default class MovimentacaoEstoque {
    id_produto: number;
    tipo: 'ENTRADA' | 'SAIDA';
    quantidade: number;
    observacao: string;

    constructor(id_produto: number, tipo: 'ENTRADA' | 'SAIDA', quantidade: number, observacao: string) {
        this.id_produto = id_produto;
        this.tipo = tipo;
        this.quantidade = quantidade;
        this.observacao = observacao;
    }

    /**
     * Lista todas as movimentações com JOIN em produto
     */
    static async listarMovimentacoes(): Promise<Array<any> | null> {
        try {
            const query = `
                SELECT 
                    m.id_movimentacao,
                    m.id_produto,
                    p.codigo AS codigo_produto,
                    p.nome AS nome_produto,
                    m.tipo,
                    m.motivo,
                    m.quantidade,
                    m.preco_unitario_praticado,
                    m.valor_total,
                    m.observacao,
                    m.data_movimentacao
                FROM movimentacao m
                INNER JOIN produto p ON p.id_produto = m.id_produto
                ORDER BY m.data_movimentacao DESC;
            `;

            const respostaBD = await database.query(query);
            return respostaBD.rows;
        } catch (error) {
            console.error("Erro detalhado ao buscar movimentações:", error);
            return null;
        }
    }

    /**
     * Busca movimentações filtradas por produto
     */
    static async buscarPorProduto(id_produto: number): Promise<Array<any> | null> {
        try {
            const query = `
                SELECT 
                    m.id_movimentacao,
                    m.id_produto,
                    p.codigo AS codigo_produto,
                    p.nome AS nome_produto,
                    m.tipo,
                    m.motivo,
                    m.quantidade,
                    m.preco_unitario_praticado,
                    m.valor_total,
                    m.observacao,
                    m.data_movimentacao
                FROM movimentacao m
                INNER JOIN produto p ON p.id_produto = m.id_produto
                WHERE m.id_produto = $1
                ORDER BY m.data_movimentacao DESC;
            `;

            const respostaBD = await database.query(query, [id_produto]);
            return respostaBD.rows;
        } catch (error) {
            console.error("Erro ao buscar movimentações do produto:", error);
            return null;
        }
    }

    /**
     * Registra uma nova movimentação
     */
    static async registrarMovimentacao(movimentacao: MovimentacaoEstoque): Promise<boolean> {
        try {
            const query = `
                INSERT INTO movimentacao (id_produto, tipo, motivo, quantidade, observacao)
                VALUES ($1, $2, $3, $4, $5);
            `;
            const motivo = movimentacao.tipo === 'ENTRADA' ? 'RECEBIMENTO' : 'USO_INTERNO';
            const params = [
                movimentacao.id_produto,
                movimentacao.tipo,
                motivo,
                movimentacao.quantidade,
                movimentacao.observacao
            ];

            const respostaBD = await database.query(query, params);
            return (respostaBD.rowCount ?? 0) > 0;
        } catch (error) {
            console.error("Erro ao registrar movimentação:", error);
            return false;
        }
    }
}