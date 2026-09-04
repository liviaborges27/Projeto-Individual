import type UsuarioDTO from "../dto/UsuarioDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Usuario {
    private idUsuario: number = 0;

    constructor(
        private nome: string,
        private email: string,
        private senha: string,
        private perfil: string = "OPERADOR"
    ) { }

    // ID
    getIdUsuario(): number {
        return this.idUsuario;
    }
    setIdUsuario(idUsuario: number): void {
        this.idUsuario = idUsuario;
    }

    // Nome
    getNome(): string {
        return this.nome;
    }
    setNome(nome: string): void {
        this.nome = nome;
    }

    // Email
    getEmail(): string {
        return this.email;
    }
    setEmail(email: string): void {
        this.email = email;
    }

    // Senha
    getSenha(): string {
        return this.senha;
    }
    setSenha(senha: string): void {
        this.senha = senha;
    }

    // Perfil
    getPerfil(): string {
        return this.perfil;
    }
    setPerfil(perfil: string): void {
        this.perfil = perfil;
    }

    // Busca o usuário pelo e-mail para autenticação de login
    static async buscarPorEmail(email: string): Promise<UsuarioDTO | null> {
        try {
            const querySelectUsuario = `SELECT * FROM usuario WHERE email = $1;`;
            const respostaBD = await database.query(querySelectUsuario, [email]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const usuarioBD = respostaBD.rows[0];

            const usuarioDTO: UsuarioDTO = {
                id_usuario: usuarioBD.id_usuario,
                nome: usuarioBD.nome,
                email: usuarioBD.email,
                senha: usuarioBD.senha,
                perfil: usuarioBD.perfil
            };

            return usuarioDTO;

        } catch (error) {
            console.log(`Erro ao acessar o modelo de usuário: ${error}`);
            return null;
        }
    }

    // Método opcional para listar todos os usuários cadastrados
    static async listarUsuarios(): Promise<Array<UsuarioDTO> | null> {
        let listaDeUsuarios: Array<UsuarioDTO> = [];

        try {
            const querySelectUsuarios = `SELECT id_usuario, nome, email, perfil FROM usuario;`;
            const respostaBD = await database.query(querySelectUsuarios);

            respostaBD.rows.forEach((usuario: any) => {
                const usuarioDTO: UsuarioDTO = {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil
                };

                listaDeUsuarios.push(usuarioDTO);
            });

            return listaDeUsuarios;

        } catch (error) {
            console.log(`Erro ao listar usuários no modelo: ${error}`);
            return null;
        }
    }
}

export default Usuario;