// stories/Filters.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import Filters from "../../lib/components/filter";
import { Star, Heart, Image as ImageIcon } from "lucide-react";

const meta: Meta<typeof Filters> = {
  title: "Components/Filters",
  component: Filters,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullTest: Story = {
  args: {
    direction: "vertical",
    filters: [
      // -------------------------------
      // CHECKBOX
      // -------------------------------
      {
        id: "sizes",
        title: "Sizes",
        type: "checkbox",
        collapsible: true,
        defaultCollapsed: false,
        options: [
          { label: "XS", value: "xs" },
          { label: "S", value: "s" },
          { label: "M", value: "m" },
          { label: "L", value: "l" },
          { label: "XL", value: "xl" },
        ],
      },

      // -------------------------------
      // RADIO
      // -------------------------------
      {
        id: "brand",
        title: "Brand",
        type: "radio",
        collapsible: false,
        options: [
          { label: "Nike", value: "nike" },
          { label: "Adidas", value: "adidas" },
          { label: "Puma", value: "puma" },
        ],
      },

      // -------------------------------
      // CHIP SELECTOR
      // -------------------------------
      {
        id: "gender",
        title: "Gender",
        type: "chip",
        collapsible: true,
        options: [
          { label: "Men", value: "men" },
          { label: "Women", value: "women" },
          { label: "Unisex", value: "unisex" },
        ],
      },

      // -------------------------------
      // TOGGLE
      // -------------------------------
      {
        id: "stock",
        title: "In Stock Only",
        type: "toggle",
        collapsible: false,
        options: [{ label: "Enable", value: true }],
      },

      // -------------------------------
      // SWITCH
      // -------------------------------
      {
        id: "express",
        title: "Express Delivery",
        type: "switch",
        collapsible: true,
        options: [{ label: "Enable", value: true }],
      },

      // -------------------------------
      // COLOR SWATCHES
      // -------------------------------
      {
        id: "colors",
        title: "Colors",
        type: "color",
        collapsible: true,
        defaultCollapsed: true,
        options: [
          { label: "Red", value: "red", color: "red" },
          { label: "Blue", value: "blue", color: "blue" },
          { label: "Green", value: "green", color: "green" },
          { label: "Black", value: "black", color: "black" },
        ],
      },

      // -------------------------------
      // IMAGE CHOOSER
      // -------------------------------
      {
        id: "pattern",
        title: "Pattern",
        type: "image",
        collapsible: true,
        options: [
          {
            label: "Pattern A",
            value: "a",
            image:
              "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=40&w=200",
          },
          {
            label: "Pattern B",
            value: "b",
            image:
              "https://images.unsplash.com/photo-1530845641149-07f5fcd0d79f?q=40&w=200",
          },
          {
            label: "Plain",
            value: "plain",
            image: "",
          },
        ],
      },

      // -------------------------------
      // RATING
      // -------------------------------
      {
        id: "minRating",
        title: "Minimum Rating",
        type: "rating",
        collapsible: true,
        options: [
          { label: "1 Star", value: 1, rating: 1 },
          { label: "2 Stars", value: 2, rating: 2 },
          { label: "3 Stars", value: 3, rating: 3 },
          { label: "4 Stars", value: 4, rating: 4 },
          { label: "5 Stars", value: 5, rating: 5 },
        ],
      },

      // -------------------------------
      // TAGS (multi-select chips)
      // -------------------------------
      {
        id: "tags",
        title: "Tags",
        type: "tag",
        collapsible: true,
        defaultCollapsed: false,
        options: [
          { label: "New", value: "new" },
          { label: "Trending", value: "trending" },
          { label: "Sale", value: "sale" },
          { label: "Limited", value: "limited" },
        ],
      },

      // -------------------------------
      // ICON SELECTOR
      // -------------------------------
      {
        id: "style",
        title: "Style",
        type: "icon",
        collapsible: true,
        options: [
          { label: "Classic", value: "classic", icon: <Star size={16} /> },
          { label: "Modern", value: "modern", icon: <Heart size={16} /> },
          { label: "Abstract", value: "abstract", icon: <ImageIcon size={16} /> },
        ],
      },

      // -------------------------------
      // RANGE SLIDER
      // -------------------------------
      {
        id: "price",
        title: "Price Range",
        type: "range",
        collapsible: true,
        defaultCollapsed: false,
        options: [
          {
            label: "Price",
            value: "price",
            min: 0,
            max: 500,
            step: 10,
          },
        ],
      },
    ],
  },
};
