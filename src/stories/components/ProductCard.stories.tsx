import type { Meta, StoryObj } from '@storybook/react';
import { dummyProducts } from '../../lib/data/products';
import { ProductCard } from '../../lib/product/components/product-card/product-card';


const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'imageHeavy'],
      description: 'Choose the layout type for the product card',
    },
    showImage: {
      control: 'boolean',
      description: 'Show/hide product image',
    },
    showBrandTitle: {
      control: 'boolean',
      description: 'Show/hide brand and title',
    },
    showPrice: {
      control: 'boolean',
      description: 'Show/hide product price',
    },
    showStockAndColor: {
      control: 'boolean',
      description: 'Show/hide stock and color selector',
    },
    showAddToCart: {
      control: 'boolean',
      description: 'Show/hide add to cart button',
    },
    showViewDetails: {
      control: 'boolean',
      description: 'Show/hide view details button',
    },
    showCategories: {
      control: 'boolean',
      description: 'Show/hide product categories',
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Layout - Full Featured
export const DefaultLayout: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Default Layout - Minimal
export const DefaultMinimal: Story = {
  args: {
    product: dummyProducts[1],
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: false,
    showAddToCart: false,
    showViewDetails: false,
    showCategories: false,
  },
};

// Default Layout - No Actions
export const DefaultWithoutActions: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: false,
    showViewDetails: false,
    showCategories: true,
  },
};

// Image Heavy Layout - Full Featured
export const ImageHeavyLayout: Story = {
  args: {
    product: dummyProducts[2],
    layout: 'imageHeavy',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Image Heavy Layout - With Colors
export const ImageHeavyWithColors: Story = {
  args: {
    product: dummyProducts[2], // Smart Fitness Watch with colors
    layout: 'imageHeavy',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Product with Discount
export const ProductWithDiscount: Story = {
  args: {
    product: dummyProducts[0], // Wireless Headphones with 15% discount
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Product with Multiple Colors
export const ProductWithMultipleColors: Story = {
  args: {
    product: dummyProducts[5], // Yoga Mat with multiple colors
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Product with Low Stock
export const ProductLowStock: Story = {
  args: {
    product: dummyProducts[3], // Leather Messenger Bag with low stock (15 items)
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
};

// Product Grid - Default Layout
export const GridDefaultLayout: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'default',

  },
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '1.5rem', 
      maxWidth: '1200px',
      padding: '1rem'
    }}>
      {dummyProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="default"

        />
      ))}
    </div>
  ),
};

// Product Grid - Image Heavy Layout
export const GridImageHeavyLayout: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'imageHeavy',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '1.5rem', 
      maxWidth: '1200px',
      padding: '1rem'
    }}>
      {dummyProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="imageHeavy"
          showImage={true}
          showBrandTitle={true}
          showPrice={true}
          showStockAndColor={true}
          showAddToCart={true}
          showViewDetails={true}
          showCategories={true}
        />
      ))}
    </div>
  ),
};

// Compact Grid - Minimal Cards
export const GridCompact: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: false,
    showAddToCart: false,
    showViewDetails: false,
    showCategories: false,
  },
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
      gap: '1rem', 
      maxWidth: '1200px',
      padding: '1rem'
    }}>
      {dummyProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="default"
          showImage={true}
          showBrandTitle={true}
          showPrice={true}
          showStockAndColor={false}
          showAddToCart={false}
          showViewDetails={false}
          showCategories={false}
        />
      ))}
    </div>
  ),
};

// Two Column Grid
export const GridTwoColumn: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'imageHeavy',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '2rem', 
      maxWidth: '800px',
      padding: '1rem'
    }}>
      {dummyProducts.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          layout="imageHeavy"
          showImage={true}
          showBrandTitle={true}
          showPrice={true}
          showStockAndColor={true}
          showAddToCart={true}
          showViewDetails={true}
          showCategories={true}
        />
      ))}
    </div>
  ),
};

// Single Card - Showcase
export const SingleCardShowcase: Story = {
  args: {
    product: dummyProducts[2],
    layout: 'imageHeavy',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
  render: (args) => (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <ProductCard {...args} />
    </div>
  ),
};

// Comparison View
export const ComparisonView: Story = {
  args: {
    product: dummyProducts[0],
    layout: 'default',
    showImage: true,
    showBrandTitle: true,
    showPrice: true,
    showStockAndColor: true,
    showAddToCart: true,
    showViewDetails: true,
    showCategories: true,
  },
  render: (args) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '1rem', 
      maxWidth: '1000px',
      padding: '1rem'
    }}>
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Default Layout</h3>
        <ProductCard
          {...args}
          layout="default"
        />
      </div>
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Image Heavy</h3>
        <ProductCard
          {...args}
          layout="imageHeavy"
        />
      </div>
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Minimal</h3>
        <ProductCard
          {...args}
          showStockAndColor={false}
          showAddToCart={false}
          showViewDetails={false}
          showCategories={false}
        />
      </div>
    </div>
  ),
};