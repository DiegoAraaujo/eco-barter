// Caminho do arquivo: src/mocks/db.js

// Este módulo simula um "banco de dados" usando localStorage.
// - Armazena tabelas (arrays de objetos) sob uma chave namespaceada.
// - Fornece funções utilitárias para carregar, salvar, inserir/atualizar e remover linhas.
// - Também possui um seed inicial para garantir a existência de um usuário demo.

const NS = "ecobarter_mockdb"; // namespace para evitar conflito de chaves no localStorage

// Monta a chave completa no localStorage para uma tabela
function keyFor(table) {
  return `${NS}:${table}`;
}

// Carrega uma tabela do localStorage (retorna array)
export function loadTable(table) {
  try {
    const raw = localStorage.getItem(keyFor(table));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Salva uma tabela inteira no localStorage
export function saveTable(table, rows) {
  localStorage.setItem(keyFor(table), JSON.stringify(rows));
}

// Insere ou atualiza (upsert) uma linha na tabela
// - matchFn define a condição de equivalência (ex.: por id ou email)
export function upsertRow(table, row, matchFn) {
  const rows = loadTable(table);
  const idx = rows.findIndex(matchFn);
  if (idx >= 0) {
    rows[idx] = { ...rows[idx], ...row }; // atualiza se já existir
  } else {
    rows.push(row); // insere se não existir
  }
  saveTable(table, rows);
  return row;
}

// Remove uma ou mais linhas da tabela com base em matchFn
export function removeRow(table, matchFn) {
  const rows = loadTable(table);
  const next = rows.filter((r) => !matchFn(r));
  saveTable(table, next);
}

// Apaga completamente uma tabela
export function resetTable(table) {
  localStorage.removeItem(keyFor(table));
}

/** 
 * Seed inicial: garante um usuário demo para testes
 * - Se não existir um usuário com email demo@ecobarter.com,
 *   cria um com id fixo "user_me".
 */
export function seedDemo() {
  const users = loadTable("users");
  const exists = users.some((u) => u.email?.toLowerCase() === "demo@ecobarter.com");
  if (!exists) {
    users.push({
      id: "user_me",
      name: "Você",
      email: "demo@ecobarter.com",
      password: "123456", // apenas para mock local
      phone: "(85) 99999-9999",
      address: "Rua das Trocas, 123",
      city: "Fortaleza",
      state: "CE",
      createdAt: Date.now(),
    });
    saveTable("users", users);
  }
}
