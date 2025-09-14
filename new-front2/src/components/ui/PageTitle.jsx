// Caminho do arquivo: src/components/ui/PageTitle.jsx

// Componente reutilizável para exibir títulos de página ou seção.
// - `tag`: nível do heading (h1, h2, h3…), default = h2.
// - `align`: alinhamento visual (left, center, right).
// - `size`: tamanho do título (sm, md, lg).
// - `eyebrow`: rótulo acima do título (opcional).
// - `subtitle`: texto abaixo do título (opcional).
// - `divider`: insere linha divisória sob o título.
// - `noMargin`: remove margens extras.
// - Acessibilidade: se `subtitle` existir, associa via aria-describedby.

import '../../styles/components/ui/PageTitle.css';

const PageTitle = ({
  tag: Tag = 'h2',
  children,
  className = '',
  align = 'center',
  size = 'md',
  eyebrow,        // rótulo acima (opcional)
  subtitle,       // texto abaixo (opcional)
  divider = false,
  noMargin = false,
  id,
  ...rest
}) => {
  // Monta classes CSS condicionais
  const classes = [
    'page-title',
    `page-title--${size}`,
    `page-title--align-${align}`,
    divider && 'page-title--divider',
    noMargin && 'is-tight',
    className,
  ].filter(Boolean).join(' ');

  // Garante IDs únicos e acessíveis
  const headingId = id || undefined;
  const subtitleId = subtitle ? `${headingId || 'pt'}-subtitle` : undefined;

  return (
    <div className={classes}>
      {/* Eyebrow: rótulo pequeno acima do título */}
      {eyebrow && (
        <p className="page-title__eyebrow">{eyebrow}</p>
      )}

      {/* Título principal */}
      <Tag
        className="page-title__heading"
        id={headingId}
        aria-describedby={subtitleId}
        {...rest}
      >
        {children}
      </Tag>

      {/* Subtítulo opcional */}
      {subtitle && (
        <p className="page-title__subtitle" id={subtitleId}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
