import { Router } from "express";
const router = Router();

import {
  getAllUsuariosHandler,
  getUsuarioByIdHandler,
  addUsuarioHandler,
  updateUsuarioHandler,
  deleteUsuarioHandler,
  userAuthHandler,
  getMe,
} from "../controllers/usuarioController.js";

router.get("/", getAllUsuariosHandler);
router.get("/me", getMe);

router.get("/:id", getUsuarioByIdHandler);
router.post("/", addUsuarioHandler);
router.put("/:id", updateUsuarioHandler);
router.delete("/:id", deleteUsuarioHandler);
router.post("/login", userAuthHandler);
router.get("/me", (req, res) => {
  res.send("entrei");
});

export default router;
