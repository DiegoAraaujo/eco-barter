import { loadTable, saveTable, seedDemo } from "../mocks/db";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
try {
  seedDemo();
} catch {}

const mapSignupPayload = (form) => ({
  name: form.nome,
  email: form.email,
  password: form.senha,
  phone: form.telefone,
  address: form.endereco,
  city: form.cidade,
  state: form.estado,
});

const mapProfilePayload = (form) => ({
  name: form.nome,
  phone: form.telefone,
  address: form.endereco,
  city: form.cidade,
  state: form.estado,
});


function getSessionUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function registerUser(form) {
  const payload = {
    nome: form.nome,
    fullName: form.nome,
    email: form.email,
    phone: form.telefone,
    city: form.cidade,
    state: form.estado,
    password: form.senha,
  };

  try {
    const userDoc = await axios.post(`${API_BASE}/usuarios`, payload);
    return userDoc.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await axios.post(`${API_BASE}/usuarios/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
}

export async function updateProfile(form, { token, signal } = {}) {
  const payload = mapProfilePayload(form);

  await new Promise((r) => setTimeout(r, 600));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const current = getSessionUser();
  if (!current) {
    const err = new Error("Não autenticado");
    err.status = 401;
    throw err;
  }

  const users = loadTable("users");
  const idx = users.findIndex((u) => u.id === current.id);
  if (idx === -1) {
    const err = new Error("Usuário não encontrado");
    err.status = 404;
    throw err;
  }

  users[idx] = { ...users[idx], ...payload, updatedAt: Date.now() };
  saveTable("users", users);

  const updated = users[idx];
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone || "",
    address: updated.address || "",
    city: updated.city || "",
    state: updated.state || "",
  };
}

export async function getMyProfile({ token, signal } = {}) {
  await new Promise((r) => setTimeout(r, 200));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const current = getSessionUser();
  if (!current) {
    const err = new Error("Não autenticado");
    err.status = 401;
    throw err;
  }

  const users = loadTable("users");
  const full = users.find((u) => u.id === current.id);
  if (!full) {
    return {
      id: current.id,
      name: current.name,
      email: current.email,
      phone: "",
      address: "",
      city: current.city || "",
      state: current.state || "",
    };
  }

  return {
    id: full.id,
    name: full.name,
    email: full.email,
    phone: full.phone || "",
    address: full.address || "",
    city: full.city || "",
    state: full.state || "",
  };
}
