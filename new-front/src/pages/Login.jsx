import { useState, useRef, useEffect, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import AuthSwitch from "../components/ui/AuthSwitch";

import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const abortRef = useRef(null);

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

  const [form, setForm] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const emailRef = useRef(null);
  const pwdRef = useRef(null);

  const emailId = useId();
  const senhaId = useId();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  }

  function validate() {
    const next = {};
    if (!form.email) next.email = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "E-mail inválido.";
    if (!form.senha) next.senha = "Informe sua senha.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      abortRef.current?.abort?.();
      abortRef.current = new AbortController();

      const loginData = { email: form.email, password: form.senha };
      const { token, user } = await loginUser(loginData, {
        signal: abortRef.current.signal,
      });

      login(user, token);
      console.log("Usuário logado:", user);
      console.log("Token salvo:", token);

      navigate(from, { replace: true });
    } catch (err) {
      const body = err?.body || {};
      const fieldErrors = body.errors || {};
      const message =
        body.message || err?.message || "Não foi possível entrar.";

      if (Object.keys(fieldErrors).length) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setFormError(message);
      }

      if (fieldErrors.email) {
        emailRef.current?.focus({ preventScroll: true });
        emailRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      } else if (fieldErrors.senha) {
        pwdRef.current?.focus({ preventScroll: true });
        pwdRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => abortRef.current?.abort?.();
  }, []);

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <main className="login-page" aria-busy={loading}>
      <Container>
        <div className="login-box">
          <div
            className="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
          >
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
            aria-describedby={
              hasErrors || formError ? "form-errors" : undefined
            }
            aria-busy={loading}
          >
            <PageTitle tag="h1">Acesse sua conta</PageTitle>

            {!!formError && (
              <p
                id="form-errors"
                className="field-error"
                role="alert"
                style={{ marginBottom: "0.8rem" }}
              >
                {formError}
              </p>
            )}

            <div className="field">
              <label htmlFor={emailId} className="sr-only">
                E-mail
              </label>
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

            <div className="field">
              <label htmlFor={senhaId} className="sr-only">
                Senha
              </label>
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
                  aria-describedby={
                    errors.senha ? `${senhaId}-error` : undefined
                  }
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

            <ButtonLarge
              type="submit"
              disabled={loading}
              className="login-submit"
              aria-disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </ButtonLarge>

            <AuthSwitch
              prefix="Ainda não tem conta?"
              to="/signup"
              label="Cadastre-se"
            />
          </form>
        </div>
      </Container>
    </main>
  );
}
