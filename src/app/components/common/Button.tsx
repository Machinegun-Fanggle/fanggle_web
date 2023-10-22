import { Button as RadixButton } from '@radix-ui/themes';
import { ButtonProps as RadixButtonProps } from '@radix-ui/themes/dist/cjs/components/button';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type RadixVariant = Pick<RadixButtonProps, 'variant'>;
type ButtonType = 'blue' | 'blue-outline' | 'gray' | 'gray-outline' | 'none';
type ButtonProps = Omit<RadixButtonProps, 'variant' | 'color'> & {
  variant: ButtonType;
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
      {...props}
      className={twMerge(
        clsx(
          variantClassNames,
          'w-[300px] h-[50px] font-bold rounded-lg',
          className
        )
      )}
      variant={radixVariant?.variant}
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
  none: null,
};

export default Button;
