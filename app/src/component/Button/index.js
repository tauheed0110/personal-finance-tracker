import React from 'react';
import './styles.css';

function Button({text, onClick, blue, disabled}) {
  return (
    <div disabled={disabled} className={blue ? 'btn blue-btn': 'btn'} onClick={onClick}>{text}</div>
  );
}

export default Button;