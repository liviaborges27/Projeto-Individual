
import { Router, type Request, type Response } from "express";

import ProdutoController from "./src/controller/ProdutoController.js";


const router = Router();

/**
 * Endpoint padrão
 */
// Rota GET na raiz "/" — serve para verificar se a API está no ar (chamada de "health check")
// Quando acessada, retorna uma mensagem simples confirmando que o servidor está funcionando
router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        // Retorna uma mensagem em JSON com a data e hora atual do servidor
        // Isso ajuda a confirmar não só que está no ar, mas também quando foi acessado
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});


//  — busca e retorna a lista completa de produtos ativos
router.get('/api/produtos', ProdutoController.todos);

//— busca e retorna os dados de um produto específico pelo CÓDIGO ÚNICO
router.get('/api/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);

//— busca e retorna os dados de um produto específico pelo ID
router.get('/api/produtos/:id_produto', ProdutoController.produtoPorId);

// cadastra um novo produto no banco de dados
router.post('/api/produtos', ProdutoController.novo);

// — realiza a remoção lógica do produto com o ID informado
router.delete('/api/produtos/:id_produto', ProdutoController.remover);

// PUT /api/produtos/:id_produto — atualiza os dados do produto com o ID informado
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);


export { router };