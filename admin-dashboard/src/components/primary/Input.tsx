import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full group">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 group-focus-within:text-blue-600 transition-colors">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-6 py-4 ${icon ? 'pl-14' : ''} bg-gray-50/50 border-2 rounded-2xl outline-none transition-all duration-300
              font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium
              focus:bg-white focus:border-blue-500 focus:shadow-[0_0_0_8px_rgba(37,99,235,0.05)]
              disabled:bg-gray-100 disabled:text-gray-400
              ${error ? "border-rose-400 bg-rose-50/20" : "border-gray-100/50"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-[10px] text-rose-500 font-black uppercase tracking-tighter px-1 animate-in fade-in slide-in-from-top-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;