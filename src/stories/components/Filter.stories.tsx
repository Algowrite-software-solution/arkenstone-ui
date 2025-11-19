// stories/Filter.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Filter from '../../lib/components/filter';

const meta: Meta<typeof Filter> = {
  title: 'Components/Filter',
  component: Filter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: 'vertical',
    filters: [
      {
        id: 'size',
        title: 'Size',
        type: 'chip',
        collapsible: true,
        defaultCollapsed: false,
        options: [
          { label: 'S', value: 's' },
          { label: 'M', value: 'm' },
          { label: 'L', value: 'l' },
          { label: 'XL', value: 'xl' },
        ],
      },
      {
        id: 'color',
        title: 'Color',
        type: 'checkbox',
        collapsible: true,
        options: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Black', value: 'black' },
        ],
      },
      {
        id: 'brand',
        title: 'Brand',
        type: 'radio',
        collapsible: false,
        options: [
          { label: 'Nike', value: 'nike' },
          { label: 'Adidas', value: 'adidas' },
          { label: 'Puma', value: 'puma' },
        ],
      },
    ],
  },
};
