import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";

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
app.use("/item", itemRoutes);
app.use("/exchange", exchangeRoutes);

export default app;
