import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DatabaseModel {
    
    /**
     * Configuração para conexão com o banco de dados
     */
    private _config: object;

    /**
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        // Configuração padrão para conexão com o banco de dados
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            max: 10,
            idleTimoutMillis: 10000
        }

        // Inicialização do pool de conexões
        this._pool = new pg.Pool(this._config);

    }

    /**
     * Método para testar a conexão com o banco de dados.
     *
     * @returns **true** caso a conexão tenha sido feita, **false** caso negativo
     */
    public async testeConexao() {
        try {
            // Testa a conexão sem encerrar o pool usado pela aplicação
            await this._pool.query('SELECT 1');
            console.log('Database connected!');
            return true;
        } catch (error) {
            // Em caso de erro, exibe uma mensagem de erro
            console.log('Error to connect database X( ');
            console.log(error);
            return false;
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool() {
        return this._pool;
    }
}