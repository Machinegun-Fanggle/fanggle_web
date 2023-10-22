import { Button as RadixButton } from '@radix-ui/themes';
import { ButtonProps as RadixButtonProps } from '@radix-ui/themes/dist/cjs/components/button';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type RadixVariant =
  | 'classic'
  | 'solid'
  | 'soft'
  | 'surface'
  | 'outline'
  | 'ghost';
type ButtonType = 'blue' | 'blue-outline' | 'gray' | 'gray-outline' | 'ghost';
type ButtonProps = Omit<RadixButtonProps, 'variant' | 'color'> & {
  variant?: ButtonType;
  radixVariant?: RadixVariant;
};

const Button = ({
  children,
  variant,
  radixVariant,
  className,
  ...props
}: ButtonProps) => {
  const variantClassNames = variantDict[variant];
  return (
    <RadixButton
      className={twMerge(
        clsx(
          !radixVariant && variantClassNames,
          'w-fit h-fit font-bold rounded-lg',
          className
        )
      )}
      {...props}
      variant={radixVariant}
    >
      {children}
    </RadixButton>
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
