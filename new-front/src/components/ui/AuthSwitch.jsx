// Caminho do arquivo: src/components/ui/AuthSwitch.jsx

// Componente auxiliar para telas de autenticação (login/signup).
// - Mostra um pequeno texto com prefixo e um link para alternar entre páginas.
//   Ex.: "Já tem conta? Entrar" ou "Não tem conta? Cadastre-se".
// - Props:
//   • prefix: texto inicial exibido antes do link
//   • to: rota de destino do <Link>
//   • label: texto do link (ex.: "Entrar")
//   • className: classes extras opcionais

import { Link } from "react-router-dom";
import "../../styles/components/ui/AuthSwitch.css";

export default function AuthSwitch({ prefix, to, label, className = "" }) {
  return (
    <p className={`auth-switch ${className}`}>
      <span>{prefix}</span>{" "}
      <Link to={to} className="auth-switch__link">
        {label}
      </Link>
    </p>
  );
}
