function Button({ children, type, onClick, classNames, disabled }) {
  return (
    <button
      className={type ? `btn btn-${type} ${classNames}` : `btn ${classNames}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
