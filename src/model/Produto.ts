// Importa o tipo ProdutoDTO, que define a estrutura de dados de um produto (objeto simples, sem métodos)
import type ProdutoDTO from "../dto/ProdutoDTO.js";
// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;


class Produto {
    private id_produto: number = 0;
    private id_categoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string;
    private preco_unitario: number;
    private quantidade_disponivel: number = 0;
    private quantidade_minima: number = 0;
    private ativo: boolean = true;
    private data_cadastro?: Date | string;

    // Construtor: chamado automaticamente ao criar um novo objeto Produto
    constructor(
        _id_categoria: number,      
        _codigo: string,             
        _nome: string,              
        _descricao: string,         
        _preco_unitario: number,     
        _quantidade_minima: number  
    ) {
        // Atribui os valores recebidos aos atributos internos da classe
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.preco_unitario = _preco_unitario;
        this.quantidade_minima = _quantidade_minima;
    }

    public getIdProduto(): number {
        return this.id_produto;
    }
    public setIdProduto(value: number) {
        this.id_produto = value;
    }


    public getIdCategoria(): number {
        return this.id_categoria;
    }
    public setIdCategoria(value: number) {
        this.id_categoria = value;
    }


    public getCodigo(): string {
        return this.codigo;
    }
    public setCodigo(value: string) {
        this.codigo = value;
    }


    public getNome(): string {
        return this.nome;
    }
    public setNome(value: string) {
        this.nome = value;
    }


    public getDescricao(): string {
        return this.descricao;
    }
    public setDescricao(value: string) {
        this.descricao = value;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }
    public setPrecoUnitario(value: number) {
        this.preco_unitario = value;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }
    public setQuantidadeDisponivel(value: number) {
        this.quantidade_disponivel = value;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }
  
    public setQuantidadeMinima(value: number) {
        this.quantidade_minima = value;
    }


    public getAtivo(): boolean {
        return this.ativo;
    }
    public setAtivo(value: boolean) {
        this.ativo = value;
    }

    public getDataCadastro(): Date | string | undefined {
        return this.data_cadastro;
    }
    public setDataCadastro(value: Date | string) {
        this.data_cadastro = value;
    }


    /**
     * Retorna uma lista com todos os produtos cadastrados e ativos no banco de dados
     * 
     * @returns Lista com todos os produtos ativos cadastrados no banco de dados
     */
    // Método que busca todos os produtos ativos e retorna uma lista de ProdutoDTO ou null
    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {
        // Cria uma lista vazia que vai receber os produtos encontrados no banco
        let listaDeProdutos: Array<ProdutoDTO> = [];

        try {
            // Query SQL que busca todos os produtos ativos no sistema (ativo = TRUE)
            const querySelectProduto = `SELECT * FROM produto WHERE ativo = TRUE ORDER BY nome;`;

            // Executa a query no banco de dados e aguarda o resultado
            const respostaBD = await database.query(querySelectProduto);

            // Percorre cada linha retornada pelo banco de dados
            respostaBD.rows.forEach((produto) => {
                // Monta o objeto ProdutoDTO com os dados da linha atual
                const produtoDTO: ProdutoDTO = {
                    id_produto: produto.id_produto,
                    id_categoria: produto.id_categoria,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco_unitario: produto.preco_unitario,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    quantidade_minima: produto.quantidade_minima,
                    ativo: produto.ativo,
                    data_cadastro: produto.data_cadastro
                };

                // Adiciona o objeto ProdutoDTO à lista
                listaDeProdutos.push(produtoDTO);
            });

            // Retorna a lista com todos os produtos encontrados
            return listaDeProdutos;

        } catch (error) {
            // Se ocorrer qualquer erro durante a consulta, exibe no console para facilitar o debug
            console.log(`Erro ao acessar o modelo: ${error}`);
            // Retorna null para indicar que houve falha
            return null;
        }
    }

     /**
     * Retorna as informações de um produto informado pelo ID
     * 
     * @param id_produto 
     * @returns
     */
    // Recebe o ID do produto e retorna um único ProdutoDTO ou null
    static async listarProduto(id_produto: number): Promise<ProdutoDTO | null> {
        try {
            // Query SQL que busca um produto específico pelo ID
            const querySelectProduto = `SELECT * FROM produto WHERE id_produto = $1;`;

            // Executa a query passando o id_produto como parâmetro (substitui o $1)
            const respostaBD = await database.query(querySelectProduto, [id_produto]);

            // Se nenhuma linha foi encontrada, retorna null
            if (respostaBD.rows.length === 0) {
                return null;
            }

            // Monta o objeto ProdutoDTO com os dados da primeira linha retornada
            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
            };

            // Retorna o objeto ProdutoDTO preenchido com os dados do banco
            return produtoDTO;
        } catch (error) {
            // Exibe o erro no console e retorna null em caso de falha
            console.error(`Erro ao realizar consulta. ${error}`);
            return null;
        }
    }

    /**
     * Retorna as informações de um produto através do seu CÓDIGO ÚNICO
     * 
     * @param codigo Código único do produto (ex: "PER-001")
     * @returns Objeto com informações do produto ou null
     */
    static async buscarPorCodigo(codigo: string): Promise<ProdutoDTO | null> {
        try {
            // Query SQL que busca o produto pelo código único ignorando maiúsculas/minúsculas
            const querySelectCodigo = `SELECT * FROM produto WHERE LOWER(codigo) = LOWER($1);`;

            // Executa a query passando o código como parâmetro
            const respostaBD = await database.query(querySelectCodigo, [codigo]);

            // Se não encontrou registros, retorna null
            if (respostaBD.rows.length === 0) {
                return null;
            }

            // Monta o objeto DTO retornado
            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
            };

            return produtoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta por código. ${error}`);
            return null;
        }
    }
/**
     * Cadastra um novo produto no banco de dados
     * @param produto Objeto Produto contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    // Recebe um objeto Produto completo e tenta inseri-lo no banco de dados
    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {
            // Query SQL de inserção com placeholders
            // "RETURNING id_produto" faz o banco retornar o ID gerado automaticamente
            const queryInsertProduto = `
                INSERT INTO produto (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_minima)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_produto;`;

            // Organiza os valores em um array na mesma ordem dos placeholders
            const valores = [
                produto.getIdCategoria(),
                produto.getCodigo().toUpperCase(),
                produto.getNome().toUpperCase(),
                produto.getDescricao(),
                produto.getPrecoUnitario(),
                produto.getQuantidadeMinima()
            ];

            // Executa a query passando o array de valores e armazena o resultado
            const result = await database.query(queryInsertProduto, valores);

            // Verifica se o banco retornou pelo menos uma linha (ou seja, o INSERT funcionou)
            if (result.rows.length > 0) {
                console.log(`Produto cadastrado com sucesso. ID: ${result.rows[0].id_produto}`);
                return true;
            }

            return false;

        } catch (error) {
            // Exibe o erro no console e retorna false em caso de exceção
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

}
export default Produto;