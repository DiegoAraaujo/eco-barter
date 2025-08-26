import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/usuarios", usuarioRoutes);

export default app;
