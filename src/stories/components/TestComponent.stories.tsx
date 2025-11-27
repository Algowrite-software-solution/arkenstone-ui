import type { Meta, StoryObj } from '@storybook/react';
import  TestComponents  from "../../lib/test/components/test-components";


const meta = {
  title: 'Components/TestComponent',
  component: TestComponents,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'imageHeavy'],
      description: 'Choose the layout type for the test component',
    },
  },
} satisfies Meta<typeof TestComponents>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Layout - Full Featured
export const DefaultState: Story = {
  args: {
    layout: 'default',
  },
};