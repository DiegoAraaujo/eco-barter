// Caminho do arquivo: src/services/auth.js
//
// Serviço de autenticação e perfil (persistência em localStorage via services/storage).
// - seedDemo(): garante um usuário demo no "banco" local para testes.
// - mapSignupPayload(form) / mapProfilePayload(form): mapeiam o formulário para o formato salvo.
// - getSessionUser(): lê do localStorage o usuário da sessão atual (AuthContext salva).
// - registerUser(form, { signal }): valida duplicidade, cria usuário, retorna { token, user(min) }.
// - loginUser({ email, senha }, { signal }): confere credenciais e retorna { token, user(min) }.
// - updateProfile(form, { token, signal }): atualiza e retorna perfil completo.
// - getMyProfile({ token, signal }): retorna perfil completo do usuário logado.

import { loadTable, saveTable } from "../services/storage";

/* =========================
   Seed demo (opcional)
   ========================= */
function seedDemo() {
  try {
    const users = loadTable("users");
    const hasDemo = users.some((u) => u.email === "demo@ecobarter.dev");
    if (!hasDemo) {
      const now = Date.now();
      users.push({
        id: `user_${now.toString(36)}`,
        name: "Usuário Demo",
        email: "demo@ecobarter.dev",
        password: "123456",
        phone: "(11) 99999-9999",
        address: "Rua Exemplo, 123",
        city: "São Paulo",
        state: "SP",
        createdAt: now,
      });
      saveTable("users", users);
    }
  } catch {
    // no-op
  }
}
try { seedDemo(); } catch {}

/* =========================
   Mapeamentos de payload
   ========================= */
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

/* =========================
   Helpers de sessão
   ========================= */
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
export async function registerUser(form, { signal } = {}) {
  const payload = mapSignupPayload(form);

  // simula latência (suporta AbortController)
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
