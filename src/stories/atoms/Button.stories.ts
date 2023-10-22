import { Meta, StoryObj } from '@storybook/react';
import Button from '@component/common/Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'blue',
  },
};
