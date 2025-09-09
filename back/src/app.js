import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import exchangeReviewRoutes from "./routes/exchangeReviewRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use("/usuarios", usuarioRoutes);
app.use("/item", itemRoutes);
app.use("/exchange", exchangeRoutes);
app.use("/review", exchangeReviewRoutes);

export default app;
