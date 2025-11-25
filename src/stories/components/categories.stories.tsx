import type { Meta, StoryObj } from '@storybook/react';
import { CategoriesBadgeList } from '../../lib/product/components/product-card/components/categories';

const meta: Meta<typeof CategoriesBadgeList> = {
  title: 'Components/CategoriesBadgeList',
  component: CategoriesBadgeList,
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