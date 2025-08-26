// Caminho do arquivo: src/pages/Login.jsx
// Página de login do usuário.
// - Formulário com campos de e-mail e senha, validação básica e feedback de erros.
// - Usa o AuthContext para persistir a sessão globalmente (login).
// - Suporta query param ?from= para redirecionar após autenticação.
// - Acessibilidade: mensagens de erro com role="alert", aria-describedby e aria-busy.
// - Inclui AuthSwitch para alternar para a tela de cadastro.

import { useState, useRef, useEffect, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import AuthSwitch from "../components/ui/AuthSwitch";

import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext"; // <<< usa o AuthContext
import "../styles/pages/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // <<< função do contexto para salvar sessão
  const abortRef = useRef(null);

  // Sanitiza o retorno após login (?from=)
  const sanitizeReturnPath = (p) => {
    if (!p) return "/my-area";
    try {
      const url = new URL(p, window.location.origin);
      if (url.origin !== window.location.origin) return "/my-area";
      const path = url.pathname + url.search + url.hash;
      if (/^\/(login|logout)/.test(path)) return "/my-area";
      return path;
    } catch {
      return "/my-area";
    }
  };
  const qs = new URLSearchParams(location.search);
  const from = sanitizeReturnPath(qs.get("from"));

  // Estado do formulário
  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(""); // erro geral

  // Refs para foco nos inputs
  const emailRef = useRef(null);
  const pwdRef = useRef(null);

  // IDs estáveis e únicos (para labels/erros)
  const emailId = useId();
  const senhaId = useId();

  // Atualiza campos
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  }

  // Validação simples
  function validate() {
    const next = {};
    if (!form.email) next.email = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "E-mail inválido.";
    if (!form.senha) next.senha = "Informe sua senha.";
    return next;
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      // aborta requisição anterior se houver
      abortRef.current?.abort?.();
      abortRef.current = new AbortController();

      // Chama serviço de login
      const { token, user } = await loginUser(form, { signal: abortRef.current.signal });

      // <<< persiste sessão global via AuthContext
      login(user, token);

      navigate(from, { replace: true });
    } catch (err) {
      const body = err?.body || {};
      const fieldErrors = body.errors || {};
      const message = body.message || err?.message || "Não foi possível entrar.";

      // Aplica erros de campo ou erro geral
      if (Object.keys(fieldErrors).length) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setFormError(message);
      }

      // Foca no primeiro campo com erro
      if (fieldErrors.email) {
        emailRef.current?.focus({ preventScroll: true });
        emailRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (fieldErrors.senha) {
        pwdRef.current?.focus({ preventScroll: true });
        pwdRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  }

  // cleanup de requests pendentes ao desmontar
  useEffect(() => {
    return () => abortRef.current?.abort?.();
  }, []);

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <main className="login-page" aria-busy={loading}>
      <Container>
        <div className="login-box">
          {/* Região viva para anunciar estados a leitores de tela */}
          <div className="visually-hidden" aria-live="polite" aria-atomic="true">
            {loading ? "Entrando..." : "Pronto"}
          </div>

          <div className="login-logo">
            <img
              src="/img/logo2.png"
              alt="EcoBarter"
              loading="lazy"
              width="160"
              height="48"
              draggable="false"
              decoding="async"
            />
          </div>

          <form
            className="login-form"
            method="post"
            autoComplete="on"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={hasErrors || formError ? "form-errors" : undefined}
            aria-busy={loading}
          >
            <PageTitle tag="h1">Acesse sua conta</PageTitle>

            {/* Erro geral do formulário */}
            {!!formError && (
              <p id="form-errors" className="field-error" role="alert" style={{ marginBottom: "0.8rem" }}>
                {formError}
              </p>
            )}

            {/* Campo de e-mail */}
            <div className="field">
              <label htmlFor={emailId} className="sr-only">E-mail</label>
              <input
                ref={emailRef}
                type="email"
                id={emailId}
                name="email"
                placeholder="Digite seu e-mail"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                required
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                autoFocus
              />
              {errors.email && (
                <p id={`${emailId}-error`} className="field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo de senha com toggle mostrar/ocultar */}
            <div className="field">
              <label htmlFor={senhaId} className="sr-only">Senha</label>
              <div className="pwd-wrap">
                <input
                  ref={pwdRef}
                  type={showPwd ? "text" : "password"}
                  id={senhaId}
                  name="senha"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  value={form.senha}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={Boolean(errors.senha)}
                  aria-describedby={errors.senha ? `${senhaId}-error` : undefined}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-pressed={showPwd}
                  aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                  disabled={loading}
                >
                  {showPwd ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.senha && (
                <p id={`${senhaId}-error`} className="field-error" role="alert">
                  {errors.senha}
                </p>
              )}
            </div>

            {/* Botão de submit */}
            <ButtonLarge
              type="submit"
              disabled={loading}
              className="login-submit"
              aria-disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </ButtonLarge>

            {/* Link para cadastro */}
            <AuthSwitch prefix="Ainda não tem conta?" to="/signup" label="Cadastre-se" />
          </form>
        </div>
      </Container>
    </main>
  );
}
