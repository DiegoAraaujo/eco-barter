import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  const { name, fullName, email, phone, city, state, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);

  if (!name) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  try {
    const account = await addUsuario(
      name,
      fullName,
      email,
      phone,
      city,
      state,
      encryptedPassword
    );

    const accountSafe = {
      id: account.id,
      name,
      fullName,
      email,
      phone,
      city,
      state,
    };

    const token = await JWTSign(accountSafe);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(accountSafe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsuarioHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  const { nome, fullName, email, phone, city, state, passwordHash } = req.body;

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

    const accountSafe = {
      id: account.id,
      name: account.name,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      city: account.city,
      state: account.state,
    };
    res.status(200).json(accountSafe);
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

    if (!user) {
      return res.status(404).json({ error: "Usuário não existe" });
    }

    const passwordCorrect = bcrypt.compareSync(password, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      registeredAt: user.registeredAt,
      fullName: user.fullName,
      phone: user.phone,
      city: user.city,
      state: user.state,
    };

    const token = await JWTSign(payload);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};

export const getMe = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    res.status(200).json(decoded);
  } catch (err) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
