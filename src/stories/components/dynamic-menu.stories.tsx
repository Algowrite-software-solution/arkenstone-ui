import type { Meta, StoryObj } from '@storybook/react-vite';
import {DynamicMenuTest} from '../../test/test-dynamic-menu';

const meta = {
  title: 'Components/Dyanmic Menu',
  component: DynamicMenuTest,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    
  },
} satisfies Meta<typeof DynamicMenuTest>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { };
