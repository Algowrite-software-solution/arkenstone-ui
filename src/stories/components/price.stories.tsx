import type { Meta, StoryObj } from '@storybook/react';
import { PriceCard } from '../../lib/e-commerce/product/components/product-card/components/price-card';

const meta: Meta<typeof PriceCard> = {
  title: 'Components/PriceCard',
  component: PriceCard,
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