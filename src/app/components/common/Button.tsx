import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HTMLAttributes } from 'react';

type ButtonType = 'blue' | 'blue-outline' | 'gray' | 'gray-outline' | 'ghost';
type ButtonProps = {
  variant?: ButtonType;
} & HTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant, className, ...props }: ButtonProps) => {
  const variantClassNames = variantDict[variant];
  return (
    <button
      className={twMerge(
        clsx(
          variantClassNames,
          'font-bold rounded-lg',
          'min-w-[100px] h-[50px]',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const variantDict: Record<ButtonType, string> = {
  blue: 'bg-primary text-white',
  'blue-outline': 'bg-white text-primary border-[1px]',
  gray: 'bg-secondary text-white',
  'gray-outline': 'bg-white text-secondary border-[1px]',
  ghost: '!bg-transparent',
};

export default Button;
