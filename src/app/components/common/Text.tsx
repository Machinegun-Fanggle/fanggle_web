import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type Weight = 'light' | 'regular' | 'medium' | 'bold';
type Color = 'purple' | 'default';
type TextProps = HTMLAttributes<HTMLSpanElement> & {
  accent?: string;
  weight?: Weight;
  color?: Color;
};

const Text = ({ accent, children, ...props }: TextProps) => {
  if (accent) {
    if (typeof children !== 'string') {
      return <TextComp {...props}>{children}</TextComp>;
    }
    const tokens = children.split(accent);

    return (
      <>
        <TextComp {...props}>{tokens[0]}</TextComp>
        <TextComp {...props} className="font-bold">
          {accent}
        </TextComp>
        <TextComp {...props}>{tokens[1]}</TextComp>
      </>
    );
  }

  return <TextComp {...props}>{children}</TextComp>;
};

const TextComp = ({
  children,
  className,
  weight = 'regular',
  color = 'default',
  ...props
}: TextProps) => (
  <span
    {...props}
    className={twMerge(
      clsx(
        'font-pretendard',
        weightDict[weight],
        textColorDict[color],
        className
      )
    )}
  >
    {children}
  </span>
);

const weightDict: Record<Weight, string> = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
};

const textColorDict: Record<Color, string> = {
  purple: 'text-purple',
  default: 'text-default',
};

export default Text;
