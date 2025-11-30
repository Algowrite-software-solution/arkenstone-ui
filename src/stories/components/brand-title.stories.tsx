import type { Meta, StoryObj } from '@storybook/react';
import { BrandTitle } from '../../lib/e-commerce/product/components/product-card/components/brand-title';

const meta: Meta<typeof BrandTitle> = {
  title: 'Components/BrandTitle',
  component: BrandTitle,
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