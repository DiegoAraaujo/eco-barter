import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/ui/Container.css';

const Container = ({ children, className = '' }) => {
  const combinedClass = `container-padrao ${className}`.trim();

  return <div className={combinedClass}>{children}</div>;
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Container;
