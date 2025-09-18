const express = require('express');
const cors = require('cors');
const {cadastrar_usuario, listar_usuarios, login_usuario } = require('./controller');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/usuarios', async (request, response) => {
    var usuarios = await listar_usuarios();
    response.send(usuarios);
});

app.post("/cadusuario", async (req, res) => {
    try {
        const novoUsuario = req.body;
        await cadastrar_usuario(novoUsuario);
        res.status(201).send({ mensagem: "Usuario inserido com sucesso!" });
    } catch (err) {
        res.status(500).send({ erro: err.mensage })
    }
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await login_usuario(email, senha);

        if (!usuario) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        res.json({ message: "Login realizado com sucesso!", user: usuario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log("Servidor rodando em http://localhost:5000");
});