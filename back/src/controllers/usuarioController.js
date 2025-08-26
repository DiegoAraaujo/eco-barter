import bcrypt from "bcryptjs";

import { JWTSign } from "../utils/jwt.js";
import {
  getAllUsuarios,
  getUsuarioById,
  addUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuarioByEmail,
  userAuth,
} from "../models/usuarioModel.js";

const bcryptSalt = bcrypt.genSaltSync();

export const getAllUsuariosHandler = async (req, res) => {
  try {
    const accounts = await getAllUsuarios();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message || "Erro ao buscar usuários" });
  }
};

export const getUsuarioByIdHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const account = await getUsuarioById(id);

    if (!account) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar Usuário" });
  }
};

export const addUsuarioHandler = async (req, res) => {
  const { nome, fullName, email, phone, city, state, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const account = await addUsuario(
      nome,
      fullName,
      email,
      phone,
      city,
      state,
      encryptedPassword
    );

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsuarioHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  const { nome, fullName, email, phone, city, state, passwordHash } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const account = await updateUsuario(
      id,
      nome,
      fullName,
      email,
      phone,
      city,
      state,
      passwordHash
    );

    res.status(200).json(account);
  } catch (error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar Usuário" });
  }
};

export const deleteUsuarioHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const account = await deleteUsuario(id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

export const userAuthHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUsuarioByEmail(email);
    if (user) {
      const { id, name, registeredAt, fullName, phone, city, state } = user;
      const passwordCorrect = bcrypt.compareSync(password, user.passwordHash);

      const payload = {
        id,
        name,
        registeredAt,
        fullName,
        phone,
        city,
        state,
      };

      if (passwordCorrect) {
        const token = await JWTSign(payload);

        console.log(token)
        res.cookie("token", token).json(payload);
      } else {
        res.status(401).json({ error: "senha invalida" });
      }
    } else {
      res.status(404).send("Usuario não existe");
    }
  } catch (error) {
    res.status(500).json({ error: "erro no servidor" });
  }
};
