import '../../styles/components/ui/ButtonLarge.css';

const Button = ({ 
  children, 
  type = 'button', 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;