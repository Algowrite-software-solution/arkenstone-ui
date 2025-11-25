import type { Meta, StoryObj } from '@storybook/react-vite';
import {AccessValidation} from '../../lib/components/access-validation';

const meta = {
  title: 'Example/Access Validation',
  component: AccessValidation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    accessor: {
      control: 'text',
    },
    matchAll: {
      control: 'boolean',
    },
    behavior: {
      control: 'radio',
      options: ['hide', 'disable'],
    },
  },
} satisfies Meta<typeof AccessValidation>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        userRoles: ["admin"],
        accessor: "admin",
        matchAll: false,
        behavior: "hide",
        fallback: <div className="px-3 py-1 rounded-lg bg-red-500">Access Denied</div>,
        children: <div className="px-3 py-1 rounded-lg bg-green-500">Access Granted</div>
    }
};
