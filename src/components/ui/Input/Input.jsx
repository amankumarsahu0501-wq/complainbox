import React, { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(({
    label,
    error,
    className = '',
    id,
    fullWidth = true,
    icon: Icon,
    ...props
}, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const wrapperClass = `input-wrapper ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
        <div className={wrapperClass}>
            {label && <label htmlFor={inputId} className="input-label">{label}</label>}
            <div className="input-container">
                {Icon && <span className="input-icon"><Icon size={18} /></span>}
                <input
                    id={inputId}
                    ref={ref}
                    className={`input-field ${error ? 'input-error' : ''} ${Icon ? 'has-icon' : ''}`}
                    aria-invalid={!!error}
                    {...props}
                />
            </div>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export const Select = forwardRef(({
    label,
    error,
    className = '',
    id,
    fullWidth = true,
    options = [],
    ...props
}, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const wrapperClass = `input-wrapper ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
        <div className={wrapperClass}>
            {label && <label htmlFor={selectId} className="input-label">{label}</label>}
            <select
                id={selectId}
                ref={ref}
                className={`input-field select-field ${error ? 'input-error' : ''}`}
                aria-invalid={!!error}
                {...props}
            >
                <option value="" disabled>Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
});

Select.displayName = 'Select';
