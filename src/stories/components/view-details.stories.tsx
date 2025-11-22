import type { Meta, StoryObj } from '@storybook/react';
import { ViewDetailsButton } from '../../lib/product/components/product-card2/components/view-details-button';

const meta: Meta<typeof ViewDetailsButton> = {
  title: 'Components/ProductCardViewDetails',
  component: ViewDetailsButton,
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