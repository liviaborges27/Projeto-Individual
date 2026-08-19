import { DatabaseModel } from "./src/model/DatabaseModel.js";
import { server } from "./server.js";
const port: number = parseInt(process.env.PORT as string);
const host: string = process.env.HOST ?? "";



new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})