import express from "express";
import cors from "cors";
import { router } from "./routes.js";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

app.use(cors());
app.use(express.json());
app.use(router);

const server = app.listen(PORT, HOST, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export { app, server };
export default app;