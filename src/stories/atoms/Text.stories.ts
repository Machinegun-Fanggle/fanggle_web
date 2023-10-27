import { Meta, StoryObj } from '@storybook/react';
import Text from '@component/common/Text';

const meta = {
  title: 'Atoms/Input',
  component: Text,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '안녕하세요',
  },
};

export const Accent: Story = {
  args: {
    children: '우리 가족을 나타내는 한마디가 있다면?',
    accent: '나타내는 한마디',
  },
};
