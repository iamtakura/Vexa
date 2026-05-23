import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '', 
  ...props 
}) {
  const baseStyles = "min-h-[48px] min-w-[120px] px-6 py-3 rounded-full font-nunito text-[14px] font-bold text-center flex items-center justify-center transition-all select-none shadow-md cursor-pointer";
  
  const variants = {
    primary: "bg-coral text-white hover:bg-[#FF8363] active:scale-95 shadow-[0_4px_12px_rgba(255,107,71,0.25)] border-none",
    secondary: "bg-purple-light text-white hover:bg-[#5E42A6] active:scale-95 border border-dim",
    ghost: "bg-transparent text-muted hover:text-white border-none shadow-none min-h-[44px]",
    disabled: "bg-[#4E3494]/45 text-muted cursor-not-allowed border-none shadow-none"
  };

  const selectedVariant = disabled ? variants.disabled : variants[variant];

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.96 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
