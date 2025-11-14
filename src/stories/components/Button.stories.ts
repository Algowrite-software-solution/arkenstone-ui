import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../lib/components/button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button Primary',
    active: true,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button Secondary',
    active: false,
  },
};
