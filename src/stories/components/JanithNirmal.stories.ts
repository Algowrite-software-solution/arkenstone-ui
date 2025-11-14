import type { Meta, StoryObj } from '@storybook/react-vite';
import { JanithNirmal } from '../../lib/components/janith-nirmal';

const meta = {
  title: 'Example/JanithNirmal',
  component: JanithNirmal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JanithNirmal>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'Button Primary',
  },
};

export const Secondary: Story = {
  args: {
    name: 'Button Secondary',
  },
};
