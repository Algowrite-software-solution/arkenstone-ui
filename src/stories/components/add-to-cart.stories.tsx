import type { Meta, StoryObj } from '@storybook/react';
import { AddToCart } from '../../lib/product/components/product-card/components/add-to-cart-button';

const meta: Meta<typeof AddToCart> = {
  title: 'Components/ProductCardAddToCart',
  component: AddToCart,
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