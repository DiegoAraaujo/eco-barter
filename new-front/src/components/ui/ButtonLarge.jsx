// Caminho do arquivo: src/components/ui/ButtonLarge.jsx

// Botão reutilizável de grande porte.
// - Aceita tanto `button` quanto `Link` (quando recebe a prop `to`).
// - Suporta variantes visuais (primary, ghost, accent, secondary).
// - Ajusta tamanhos (sm, md, lg).
// - Pode ocupar largura total (`block`).
// - Gera estados visuais e atributos de acessibilidade para loading/disabled.
// - Se for Link e estiver desabilitado, renderiza como <span> para evitar navegação.

import '../../styles/components/ui/ButtonLarge.css';
import { Link } from 'react-router-dom';

const ButtonLarge = ({
  children,
  to,
  type = 'button',
  variant = 'primary',           // estilo visual
  size = 'md',                   // tamanho: sm | md | lg
  block = false,                 // largura total opcional
  loading = false,               // estado de carregamento
  disabled = false,              // estado de desabilitado
  className = '',
  ...props
}) => {
  // Classe por variante
  const variantClass = {
    primary: 'btn--primary',
    ghost: 'btn--ghost',
    accent: 'btn--accent',
    secondary: 'btn--ghost',     // alias para compatibilidade
  }[variant] || 'btn--primary';

  // Classe por tamanho
  const sizeClass =
    size === 'sm' ? 'btn--sm' :
    size === 'lg' ? 'btn--lg' : 'btn--md';

  // Classes finais
  const classes = [
    'btn',               // base global
    'btn-large',         // alias p/ retrocompat
    variantClass,
    sizeClass,
    block && 'btn--block',
    (disabled || loading) && 'is-disabled',
    loading && 'is-loading',
    className,
  ].filter(Boolean).join(' ');

  // Props de acessibilidade
  const ariaProps = {
    'aria-disabled': disabled || loading ? 'true' : undefined,
    'aria-busy': loading || undefined,
  };

  // Caso use `to`, decide entre Link ou span (se desabilitado)
  if (to) {
    if (disabled || loading) {
      return (
        <span className={classes} {...ariaProps} {...props}>
          {children}
        </span>
      );
    }
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  // Caso botão normal
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...ariaProps}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonLarge;
