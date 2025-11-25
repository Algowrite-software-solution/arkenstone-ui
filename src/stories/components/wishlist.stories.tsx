import type { Meta, StoryObj } from '@storybook/react';
import { WishlistButton } from '../../lib/product/components/product-card/components/wishlist-button';

const meta: Meta<typeof WishlistButton> = {
  title: 'Components/WishlistButton',
  component: WishlistButton,
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