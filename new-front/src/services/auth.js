// Caminho do arquivo: src/services/auth.js

// Serviço de autenticação e perfil (mock localStorage).
// - seedDemo(): garante um usuário demo no "banco" local para testes.
// - mapSignupPayload(form): mapeia o formulário de cadastro para o formato de usuário.
// - mapProfilePayload(form): mapeia o formulário de perfil para campos persistidos.
// - getSessionUser(): lê do localStorage o usuário da sessão atual (AuthContext salva).
// - registerUser(form, { signal }): simula cadastro; valida e-mail duplicado; persiste em "users"; retorna { token, user(min) }.
// - loginUser({ email, senha }, { signal }): simula login; valida credenciais contra "users"; retorna { token, user(min) }.
// - updateProfile(form, { token, signal }): simula PATCH do perfil do usuário logado; retorna usuário completo atualizado (sem gravar localStorage aqui — quem faz isso é o AuthContext).
// - getMyProfile({ token, signal }): retorna o perfil completo do usuário logado (inclui phone/address); usado para pré-preencher o formulário de perfil.

import { loadTable, saveTable, seedDemo } from "../mocks/db";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
try { seedDemo(); } catch { }

/* =========================
   Mapeamentos de payload
   ========================= */
// mapSignupPayload: converte campos de formulário de cadastro para o formato salvo
const mapSignupPayload = (form) => ({
  name: form.nome,
  email: form.email,
  password: form.senha,
  phone: form.telefone,
  address: form.endereco,
  city: form.cidade,
  state: form.estado,
});

// mapProfilePayload: converte campos de formulário de perfil (edição) para o formato salvo
const mapProfilePayload = (form) => ({
  name: form.nome,
  phone: form.telefone,
  address: form.endereco,
  city: form.cidade,
  state: form.estado,
});

/* =========================
   Helpers de sessão
   ========================= */
// getSessionUser: lê o snapshot do usuário atual salvo pelo AuthContext
function getSessionUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* =========================
   SIGNUP (cadastro)
   ========================= */
// registerUser: valida duplicidade de e-mail, cria usuário no mock DB e retorna token + snapshot mínimo do usuário
export async function registerUser(form, { signal } = {}) {
  const payload = mapSignupPayload(form);

  // simula latência de rede (e suporta AbortController)
  await new Promise((r) => setTimeout(r, 600));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const users = loadTable("users");
  const duplicated = users.some(
    (u) => u.email?.toLowerCase() === payload.email?.toLowerCase()
  );
  if (duplicated) {
    const err = new Error("Validation error");
    err.status = 400;
    err.body = { errors: { email: "E-mail já cadastrado" } };
    throw err;
  }

  const id = `user_${Date.now().toString(36)}`;
  const newUser = { id, ...payload, createdAt: Date.now() };
  users.push(newUser);
  saveTable("users", users);

  return {
    token: "demo-token",
    user: {
      id,
      name: newUser.name,
      email: newUser.email,
      city: newUser.city,
      state: newUser.state,
    },
  };
}

/* =========================
   LOGIN (autenticação)
   ========================= */
// loginUser: confere e-mail/senha no mock DB; retorna token + snapshot mínimo do usuário
export async function loginUser({ email, senha }, { signal } = {}) {
  await new Promise((r) => setTimeout(r, 600));
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const users = loadTable("users");
  const user = users.find(
    (u) => u.email?.toLowerCase() === email?.toLowerCase() && u.password === senha
  );
  if (!user) {
    const err = new Error("Credenciais inválidas");
    err.status = 401;
    err.body = { message: "E-mail ou senha inválidos." };
    throw err;
  }

  return {
    token: "demo-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      state: user.state,
    },
  };
}

/* =========================
   PERFIL (edição/PATCH)
   ========================= */
// updateProfile: atualiza dados do usuário logado no mock DB e retorna o usuário completo atualizado
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

/* =========================
   PERFIL (GET atual)
   ========================= */
// getMyProfile: retorna o perfil completo do usuário logado (inclui phone/address) para preencher o formulário
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
    // fallback: retorna snapshot mínimo caso não encontre registro completo
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
