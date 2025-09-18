const mysql = require('mysql2/promise');

async function conectar() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'protecmax',
        port: 3306
    });
    return connection;
}

async function desconectar(connection) {
    connection.end();
}

module.exports = {conectar, desconectar};