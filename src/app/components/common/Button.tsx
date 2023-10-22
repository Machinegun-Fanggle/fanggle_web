import { Button as RadixButton } from '@radix-ui/themes';
import { ButtonProps as RadixButtonProps } from '@radix-ui/themes/dist/cjs/components/button';

type ButtonProps = RadixButtonProps;

const Button = (props: ButtonProps) => {
  return <RadixButton></RadixButton>;
};

export default Button;
