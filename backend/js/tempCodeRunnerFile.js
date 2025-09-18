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