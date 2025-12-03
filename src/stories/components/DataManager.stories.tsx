import type { Meta, StoryObj } from '@storybook/react-vite';
import EmployeePage from '../../test/test-data-manager-preview';

const meta = {
  title: 'Example/Data Manager',
  component: EmployeePage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    accessor: {
      control: 'select',
      options: ['admin', 'manager', 'editor', 'guest'],
    },
    matchAll: {
      control: 'boolean',
    },
    behavior: {
      control: 'radio',
      options: ['hide', 'disable'],
    },
  },
} satisfies Meta<typeof EmployeePage>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { };
