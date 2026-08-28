export default interface MovimentacaoDTO {
    id_movimentacao?: number;
    id_produto: number;
    tipo: 'ENTRADA' | 'SAIDA';
    quantidade: number;
    observacao?: string;
    data_movimentacao?: Date | string;
}