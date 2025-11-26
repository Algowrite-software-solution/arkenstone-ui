import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZustendStorePreview } from '../../lib/components/zustund-store-preview';

const meta = {
  title: 'Example/Zustend Store Preview',
  component: ZustendStorePreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZustendStorePreview>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
