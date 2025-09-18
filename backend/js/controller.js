const { conectar, desconectar } = require('./db');
const bcrypt = require("bcryptjs");

async function listar_usuarios() {
    try {
        const conn = await conectar();
        var query = 'SELECT * FROM usuarios';
        var [linhas] = await conn.execute(query);
        console.log(linhas);
        await desconectar(conn);
        return (linhas);
    } catch (error) {
        console.log('Error: ', err.message);
    }
};

async function cadastrar_usuario(usuario) {
    const conn = await conectar();
    try {
        // Verifica se email já existe
        const [lista] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [usuario.email]);
        if (lista.length > 0) {
            throw new Error("Email já cadastrado!");
        }

        const hashed = await bcrypt.hash(usuario.senha, 10);

        await conn.execute(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [
                usuario.nome, 
                usuario.email, 
                hashed
            ]
        );
        
    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        throw err;
    } finally {
        await desconectar(conn);
    }
}

async function login_usuario(email, senhaDigitada) {
    const conn = await conectar();
    try {
        const [lista] = await conn.execute("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (lista.length === 0) {
            return null;
        }
        const usuario = lista[0];
        const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha);

        if (!senhaCorreta) {
            return null; // senha incorreta
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };
    } catch (err) {
        console.error("Erro no login:", err);
        throw err;
    } finally {
        await desconectar(conn);
    }
}

module.exports = {cadastrar_usuario, listar_usuarios, login_usuario}