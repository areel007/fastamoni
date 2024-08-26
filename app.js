import express from "express";
import routes from "./src/routes/index.js";
import cors from "cors";
import dotenv from "dotenv";

// environment variables
dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
