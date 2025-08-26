// Caminho do arquivo: src/pages/PersonalData.jsx
// Página de cadastro ou edição de dados pessoais.
// - Se `mode="signup"`: formulário de cadastro de usuário.
// - Caso contrário: edição do perfil existente.
// - Valida campos (nome, e-mail, senha/confirmar, telefone, endereço, cidade, estado).
// - Formata telefone automaticamente enquanto digita.
// - Integra com AuthContext para login (no signup) e atualização do perfil (no profile).
// - No signup: chama `registerUser`, salva token+usuário no contexto e vai para /my-area.
// - No profile: chama `updateProfileService` e sincroniza com o contexto.
// - Exibe erros por campo, erro geral e mensagem de status.
// - Alternância de visibilidade de senha e confirmação.
// - Correção: adicionados `abortRef` e `firstInvalidRef` (usados mas não declarados).

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/PersonalData.css";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import Container from "../components/ui/Container";
import AuthSwitch from "../components/ui/AuthSwitch";
import {
  registerUser,
  updateProfile as updateProfileService,
  getMyProfile,
} from "../services/auth";
import { useAuth } from "../context/AuthContext";

// Lista fixa de opções de estados (UFs)
const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

const PersonalData = ({ mode = "profile" }) => {
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  // Contexto de autenticação (login e atualização do perfil no contexto)
  const { user: authUser, login, updateProfile: setAuthProfile } = useAuth();

  // Refs necessários (correção)
  const abortRef = useRef(null);
  const firstInvalidRef = useRef(null);

  // Estado inicial do formulário
  const initialFormState = {
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
  };

  // Estado do formulário e controle de erros
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  /* =============================
     EFEITOS
     ============================= */

  // Reidrata formulário em modo "perfil"
  useEffect(() => {
    if (isSignup) return;
    (async () => {
      try {
        const token = localStorage.getItem("authToken") || "";
        const full = await getMyProfile({ token });
        setFormData((prev) => ({
          ...prev,
          nome: full.name || "",
          email: full.email || "",
          telefone: full.phone || "",
          endereco: full.address || "",
          cidade: full.city || "",
          estado: full.state || "",
        }));
      } catch {
        // falha silenciosa → usuário pode preencher manualmente
      }
    })();
  }, [isSignup]);

  // Cleanup de requisições pendentes
  useEffect(() => () => abortRef.current?.abort?.(), []);

  /* =============================
     HELPERS DE VALIDAÇÃO
     ============================= */

  const isValidPhone = (masked) => {
    const digits = masked.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Validação por campo
  const validateField = (name, value, current = formData) => {
    const v = (value ?? "").trim();

    // obrigatoriedade: sempre no signup; no profile só valida senha/confirmar se preenchidas
    const required =
      isSignup ||
      !["senha", "confirmarSenha"].includes(name) ||
      (["senha", "confirmarSenha"].includes(name) && v);

    if (required && !v) return "Campo obrigatório";

    if (name === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "E-mail inválido";

    if (name === "senha" && v.length && v.length < 6)
      return "A senha deve ter ao menos 6 caracteres";

    if (name === "confirmarSenha" && v !== current.senha)
      return "As senhas não coincidem";

    if (name === "telefone" && v && !isValidPhone(v))
      return "Telefone inválido";

    return "";
  };

  /* =============================
     HANDLERS
     ============================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nextVal = name === "telefone" ? formatPhone(value) : value;
      const next = { ...prev, [name]: nextVal };

      const err = validateField(name, nextVal, next);
      // revalida confirmação quando senha/confirmar mudarem
      let confirmErrPatch = {};
      if (["senha", "confirmarSenha"].includes(name)) {
        confirmErrPatch.confirmarSenha = validateField("confirmarSenha", next.confirmarSenha, next);
      }

      setErrors((prevErr) => ({ ...prevErr, [name]: err, ...confirmErrPatch }));
      setStatusMsg("");
      setFormError("");
      return next;
    });
  };

  const focusFirstInvalid = (errs) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const el = document.getElementById(first);
    if (el) el.focus();
    else firstInvalidRef.current?.querySelector?.(`#${first}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError("");
    setStatusMsg("");

    // Valida todos os campos
    const fields = Object.keys(formData);
    const newErrors = {};
    for (const k of fields) {
      const skipPwdOnProfile = !isSignup && (k === "senha" || k === "confirmarSenha") && !formData[k];
      if (skipPwdOnProfile) continue;

      const msg = validateField(k, formData[k]);
      if (msg) newErrors[k] = msg;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setIsSubmitting(false);
      focusFirstInvalid(newErrors);
      return;
    }

    try {
      abortRef.current?.abort?.();
      abortRef.current = new AbortController();

      if (isSignup) {
        const { token, user } = await registerUser(formData, { signal: abortRef.current.signal });
        login(user, token); // sincroniza contexto
        navigate("/my-area", { replace: true });
      } else {
        const token = localStorage.getItem("authToken") || "";
        const updated = await updateProfileService(formData, { token, signal: abortRef.current.signal });
        setAuthProfile(updated); // atualiza contexto
        setStatusMsg("Dados salvos com sucesso!");
      }
    } catch (err) {
      const body = err?.body || {};
      const fieldErrors = body.errors || {};
      const message = body.message || err?.message || "Não foi possível concluir a operação.";
      if (Object.keys(fieldErrors).length) setErrors((prev) => ({ ...prev, ...fieldErrors }));
      else setFormError(message);
      if (Object.keys(fieldErrors).length) focusFirstInvalid(fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =============================
       RENDER
       ============================= */

  return (
    <Container className={`personal-data ${isSignup ? "signup" : "profile"}`} size="md">
      <PageTitle tag="h1">{isSignup ? "Crie sua conta" : "Dados Pessoais"}</PageTitle>

      <div className="dados-box" ref={firstInvalidRef}>
        <form className="dados-form" onSubmit={handleSubmit} noValidate aria-live="polite">
          <fieldset className="grupo-campos">
            <legend>{isSignup ? "Informações para cadastro" : "Informações Pessoais"}</legend>

            {/* Nome */}
            <div className="campo">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                autoComplete="name"
                autoCapitalize="words"
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={errors.nome ? "nome-error" : undefined}
              />
              {errors.nome && <span id="nome-error" className="erro-validacao" role="alert">{errors.nome}</span>}
            </div>

            {/* Email */}
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={!isSignup}
                aria-readonly={!isSignup || undefined}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <span id="email-error" className="erro-validacao" role="alert">{errors.email}</span>}
            </div>

            {/* Senha / Confirmar */}
            <div className="grid-duas-colunas">
              <div className="campo campo-senha">
                <label htmlFor="senha">Senha{isSignup ? "" : " (deixe em branco para não alterar)"}</label>
                <div className="input-com-botao">
                  <input
                    type={showPwd ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required={isSignup}
                    minLength={6}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.senha)}
                    aria-describedby={errors.senha ? "senha-error" : undefined}
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.senha && <span id="senha-error" className="erro-validacao" role="alert">{errors.senha}</span>}
              </div>

              <div className="campo campo-senha">
                <label htmlFor="confirmarSenha">Confirmar senha{isSignup ? "" : " (se alterar)"}</label>
                <div className="input-com-botao">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required={isSignup}
                    minLength={6}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.confirmarSenha)}
                    aria-describedby={errors.confirmarSenha ? "confirmarSenha-error" : undefined}
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    aria-label={showConfirmPwd ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                  >
                    {showConfirmPwd ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <span id="confirmarSenha-error" className="erro-validacao" role="alert">
                    {errors.confirmarSenha}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Contato e Endereço</legend>

            {/* Telefone */}
            <div className="campo">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                inputMode="numeric"
                placeholder="(99) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                required
                autoComplete="tel"
                maxLength={16}
                pattern="^\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}$"
                aria-invalid={Boolean(errors.telefone)}
                aria-describedby={errors.telefone ? "telefone-error" : undefined}
              />
              {errors.telefone && <span id="telefone-error" className="erro-validacao" role="alert">{errors.telefone}</span>}
            </div>

            {/* Endereço, Cidade, Estado */}
            {["endereco", "cidade", "estado"].map((campo) => (
              <div className="campo" key={campo}>
                <label htmlFor={campo}>
                  {campo === "endereco" ? "Endereço" : campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>

                {campo === "estado" ? (
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.estado)}
                    aria-describedby={errors.estado ? "estado-error" : undefined}
                  >
                    <option value="">Selecione...</option>
                    {UF_OPTIONS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={campo}
                    name={campo}
                    value={formData[campo]}
                    onChange={handleChange}
                    required
                    autoComplete={
                      campo === "endereco" ? "street-address"
                        : campo === "cidade" ? "address-level2"
                          : undefined
                    }
                    aria-invalid={Boolean(errors[campo])}
                    aria-describedby={errors[campo] ? `${campo}-error` : undefined}
                  />
                )}

                {errors[campo] && (
                  <span id={`${campo}-error`} className="erro-validacao" role="alert">
                    {errors[campo]}
                  </span>
                )}
              </div>
            ))}
          </fieldset>

          {!!formError && <p className="erro-validacao" role="alert">{formError}</p>}

          <div className="botoes-acao">
            <ButtonLarge type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isSignup ? "Cadastrando..." : "Salvando..."
                : isSignup ? "Cadastrar" : "Salvar Dados"}
            </ButtonLarge>
          </div>

          {isSignup && <AuthSwitch prefix="Já tem conta?" to="/login" label="Entrar" />}

          {statusMsg && <p className="status-msg" role="status">{statusMsg}</p>}
        </form>
      </div>
    </Container>
  );
};

export default PersonalData;
