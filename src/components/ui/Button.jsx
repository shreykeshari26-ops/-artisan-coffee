import React from 'react';

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  // Mapping our custom "rounded-full" variant from the brand guidelines
  const variantClasses = variant === 'rounded-full' 
    ? 'glass-btn rounded-full' 
    : 'glass-btn';

  return (
    <button
      className={`${variantClasses} ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };
