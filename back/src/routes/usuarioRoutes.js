import { Router } from "express";
const router = Router();

import {
  getAllUsuariosHandler,
  getUsuarioByIdHandler,
  addUsuarioHandler,
  updateUsuarioHandler,
  deleteUsuarioHandler,
  userAuthHandler
} from "../controllers/usuarioController.js";

router.get("/", getAllUsuariosHandler);
router.get("/:id", getUsuarioByIdHandler);
router.post("/", addUsuarioHandler);
router.put("/:id", updateUsuarioHandler);
router.delete("/:id", deleteUsuarioHandler);
router.post("/login", userAuthHandler)

export default router;