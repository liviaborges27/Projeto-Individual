import { Router, type Request, type Response } from "express";

import ProdutoController from "./controller/ProdutoController.js";
import CategoriaController from "./controller/CategoriaController.js";
import MovimentacaoController from "./controller/MovimentacaoController.js";
import { Auth } from "./middleware/Auth.js";

const router = Router();

/**
 * Endpoint padrão (Health Check)
 */
router.get('/', (req: Request, res: Response) => {
    return res
        .status(200)
        .json(`Aplicação online. Timestamp: ${new Date()}`);
});


router.post("/login", Auth.validacaoUsuario);

/* ==========================================================================
   ROTAS DE PRODUTOS
   ========================================================================== */
// GET /api/produtos — busca e retorna a lista completa de produtos ativos
router.get('/api/produtos', Auth.verifyToken, ProdutoController.todos);

// Alias para clientes que usam GET /produtos
router.get('/produtos', Auth.verifyToken, ProdutoController.todos);

// GET /api/produtos/codigo/:codigo — busca produto pelo CÓDIGO ÚNICO
router.get('/api/produtos/codigo/:codigo', ProdutoController.produtoPorCodigo);

// GET /api/produtos/:id_produto — busca produto pelo ID
router.get('/api/produtos/:id_produto', ProdutoController.produtoPorId);

// POST /api/produtos — cadastra um novo produto
router.post('/api/produtos', ProdutoController.novo);

// PUT /api/produtos/:id_produto — atualiza os dados de um produto
router.put('/api/produtos/:id_produto', ProdutoController.atualizar);

// DELETE /api/produtos/:id_produto — realiza a remoção lógica do produto
router.delete('/api/produtos/:id_produto', ProdutoController.remover);


/* ==========================================================================
   ROTAS DE CATEGORIAS
   ========================================================================== */
// GET /api/categorias — lista todas as categorias ativas
router.get('/api/categorias', CategoriaController.todas);

// GET /api/categorias/:id_categoria — busca categoria pelo ID
router.get('/api/categorias/:id_categoria', CategoriaController.categoriaPorId);

// POST /api/categorias — cadastra nova categoria
router.post('/api/categorias', CategoriaController.nova);

// PUT /api/categorias/:id_categoria — atualiza categoria existente
router.put('/api/categorias/:id_categoria', CategoriaController.atualizar);

// DELETE /api/categorias/:id_categoria — desativa (remoção lógica) uma categoria
router.delete('/api/categorias/:id_categoria', CategoriaController.remover);


/* ==========================================================================
   ROTAS DE MOVIMENTAÇÃO DE ESTOQUE
   ========================================================================== */
// GET /api/movimentacoes — lista todo o histórico de movimentações
router.get('/api/movimentacoes', MovimentacaoController.todas);

// GET /api/movimentacoes/produto/:id_produto — ROTA ESPECÍFICA: busca movimentações de um produto específico
router.get('/api/movimentacoes/produto/:id_produto', MovimentacaoController.porProduto);

// POST /api/movimentacoes — registra nova entrada ou saída de estoque
router.post('/api/movimentacoes', MovimentacaoController.nova);


export { router };