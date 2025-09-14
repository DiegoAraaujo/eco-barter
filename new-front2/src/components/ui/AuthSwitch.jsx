// Caminho do arquivo: src/components/ui/AuthSwitch.jsx
// Texto + link para alternar entre telas de autenticação (login/signup).

import { Link } from "react-router-dom";
import "../../styles/components/ui/AuthSwitch.css";

export default function AuthSwitch({ prefix = "", to, label, className = "" }) {
  return (
    <p className={`auth-switch ${className}`}>
      {prefix && <span className="auth-switch__prefix">{prefix}</span>}
      <Link
        to={to}
        className="auth-switch__link"
        aria-label={`Ir para ${label}`}
      >
        {label}
      </Link>
    </p>
  );
}
