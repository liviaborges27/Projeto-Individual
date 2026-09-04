import type UsuarioDTO from "../dto/UsuarioDTO.js";
import Usuario from "../model/Usuario.js";
import { type Request, type Response } from "express";

class UsuarioController {
    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
            }

            const usuario: UsuarioDTO | null = await Usuario.buscarPorEmail(email);

            if (!usuario) {
                return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
            }

            if (usuario.senha !== senha) {
                return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
            }

            return res.status(200).json({
                mensagem: "Login realizado com sucesso!",
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil
                }
            });

        } catch (error) {
            console.error(`Erro no controller de login: ${error}`);
            return res.status(500).json({ mensagem: "Erro no servidor ao tentar realizar login." });
        }
    }
}

export default UsuarioController;