import '../../styles/components/ui/PageTitle.css';

const PageTitle = ({ children, className = '' }) => {
  return (
    <h2 className={`page-title ${className}`.trim()}>
      {children}
    </h2>
  );
};

export default PageTitle;