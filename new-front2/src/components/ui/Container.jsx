// Caminho do arquivo: src/components/ui/Container.jsx

// Este componente é um wrapper de layout baseado na classe .container global (index.css).
// - Fornece variações de tamanho (sm, md, lg, xl).
// - Suporta modos: bleed (100% viewport), fluid (100% útil com gutter), full (100% sem gutter).
// - Permite remover gutters (noGutter).
// - Aceita sobrescrever o tamanho máximo via prop "max".
// - Suporta troca da tag (div, section, main, etc.).
// - Útil para manter consistência visual entre diferentes seções da aplicação.

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/ui/Container.css';

const Container = forwardRef(function Container(
  {
    as: Tag = 'div',      // define a tag do container (div, section, etc.)
    children,
    className = '',
    size = 'lg',          // tamanho padrão
    bleed = false,        // ocupa largura total da viewport
    fluid = false,        // 100% da largura útil (com gutters)
    full = false,         // 100% sem gutters
    noGutter = false,     // remove gutters do container
    max,                  // sobrescreve --container-max
    style,
    ...props
  },
  ref
) {
  // Define classes condicionais com base nas props
  const sizeClass = size ? `container--${size}` : '';
  const classes = [
    'container',
    'container-padrao',              // legado (mantido por compatibilidade)
    sizeClass,
    bleed && 'container--bleed',
    fluid && 'container--fluid',
    full && 'container--full',
    noGutter && 'container--no-gutter',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Aplica estilo dinâmico para --container-max
  const styleVar =
    max != null
      ? { '--container-max': typeof max === 'number' ? `${max}px` : String(max), ...style }
      : style;

  return (
    <Tag ref={ref} className={classes} style={styleVar} {...props}>
      {children}
    </Tag>
  );
});

// Validação das props para documentação e debug
Container.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', null]),
  bleed: PropTypes.bool,
  fluid: PropTypes.bool,
  full: PropTypes.bool,
  noGutter: PropTypes.bool,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
};

export default Container;
