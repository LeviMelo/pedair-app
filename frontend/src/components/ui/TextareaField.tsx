import React from 'react';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        className={`form-input ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextareaField; 