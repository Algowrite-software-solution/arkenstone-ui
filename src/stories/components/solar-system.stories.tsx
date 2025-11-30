import type { Meta, StoryObj } from '@storybook/react';
import { SolarSystemPreview } from '../../test/solar-system-preview';

const meta: Meta<typeof SolarSystemPreview> = {
  title: 'Components/SolarSystemPreview',
  component: SolarSystemPreview,
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