import type { Meta, StoryObj } from '@storybook/react';
import { DiscountBadge } from '../../lib/product/components/product-card2/components/discount-badge';

const meta: Meta<typeof DiscountBadge> = {
  title: 'Components/DiscountBadge',
  component: DiscountBadge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};