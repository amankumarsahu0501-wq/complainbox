import React from 'react';
import './Button.css';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    isLoading = false,
    disabled,
    ...props
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'w-full' : '',
        isLoading ? 'btn-loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="loader"></span> : null}
            <span className="btn-content">{children}</span>
        </button>
    );
};
