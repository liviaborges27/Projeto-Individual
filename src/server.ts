import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { router } from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const server = createServer(app);

export { app, server };
export default app;
