import type { Meta, StoryObj } from '@storybook/react';
import { ProductCardListing } from '../../lib/e-commerce/product/components/product-card/page/product-card-listing';

const meta: Meta<typeof ProductCardListing> = {
  title: 'Components/DefaultProductImage',
  component: ProductCardListing,
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