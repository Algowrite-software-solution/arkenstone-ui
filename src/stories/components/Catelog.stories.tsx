import type { Meta, StoryObj } from '@storybook/react';
import DefaultCatelogPage from '../../lib/product/components/catelog/pages/default-catelog';

const meta: Meta<typeof DefaultCatelogPage> = {
  title: 'Components/Catelog',
  component: DefaultCatelogPage,
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