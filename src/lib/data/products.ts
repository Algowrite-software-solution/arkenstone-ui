import { Product } from "../product/types";

export const dummyProducts: Product[] = [
  {
    id: 1,
    brand_id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
    sku: "WBH-001",
    is_active: true,
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-11-10 14:20:00",
    price: 149.99,
    discount_type: "percentage",
    discount_value: 15,
    quantity: 45,
    final_price: 127.49,
    categories: [
      { id: 1, name: "Electronics", slug: "electronics" },
      { id: 5, name: "Audio", slug: "audio" }
    ],
    brand: {
      id: 1,
      name: "SoundWave",
      slug: "soundwave",
      logo: "https://picsum.photos/seed/brand1/200/100"
    },
    images: [
      {
        product_id: 1,
        url: "https://picsum.photos/seed/product1/400/400",
        alt_text: "Wireless headphones front view",
        is_primary: true,
        order: 0
      },
      {
        product_id: 1,
        url: "https://picsum.photos/seed/product1b/400/400",
        alt_text: "Wireless headphones side view",
        is_primary: false,
        order: 1
      }
    ],
    taxonomies: [
      {
        id: 1,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products and devices",
        sort_order: 0,
        meta: { featured: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 10,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Premium",
        slug: "premium",
        description: "Premium quality products",
        sort_order: 1,
        meta: { color: "gold" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 2,
    brand_id: 2,
    name: "Organic Green Tea - 100 Bags",
    description: "Premium organic green tea sourced from high-altitude tea gardens. Rich in antioxidants.",
    sku: "TEA-GT-100",
    is_active: true,
    created_at: "2024-02-20 09:15:00",
    updated_at: "2024-11-12 11:45:00",
    price: 24.99,
    discount_type: null,
    discount_value: null,
    quantity: 120,
    final_price: 24.99,
    categories: [
      { id: 10, name: "Food & Beverages", slug: "food-beverages" },
      { id: 15, name: "Tea", slug: "tea" }
    ],
    brand: {
      id: 2,
      name: "Nature's Leaf",
      slug: "natures-leaf",
      logo: "https://picsum.photos/seed/brand2/200/100"
    },
    images: [
      {
        product_id: 2,
        url: "https://picsum.photos/seed/product2/400/400",
        alt_text: "Organic green tea box",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 2,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Food & Beverages",
        slug: "food-beverages",
        description: "Food and beverage products",
        sort_order: 1,
        meta: { icon: "utensils" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 11,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Organic",
        slug: "organic",
        description: "Certified organic products",
        sort_order: 2,
        meta: { certified: true, color: "green" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 12,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Health & Wellness",
        slug: "health-wellness",
        description: "Health and wellness products",
        sort_order: 3,
        meta: { icon: "heart" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 3,
    brand_id: 3,
    name: "Smart Fitness Watch Pro",
    description: "Track your fitness goals with heart rate monitoring, GPS, and 50+ sport modes",
    sku: "SFW-PRO-001",
    is_active: true,
    created_at: "2024-03-10 14:00:00",
    updated_at: "2024-11-13 16:30:00",
    price: 299.99,
    discount_type: "fixed",
    discount_value: 50,
    quantity: 28,
    final_price: 249.99,
    categories: [
      { id: 1, name: "Electronics", slug: "electronics" },
      { id: 20, name: "Wearables", slug: "wearables" }
    ],
    brand: {
      id: 3,
      name: "FitTech",
      slug: "fittech",
      logo: "https://picsum.photos/seed/brand3/200/100"
    },
    images: [
      {
        product_id: 3,
        url: "https://picsum.photos/seed/product3/400/400",
        alt_text: "Smart fitness watch on wrist",
        is_primary: true,
        order: 0
      },
      {
        product_id: 3,
        url: "https://picsum.photos/seed/product3b/400/400",
        alt_text: "Smart fitness watch display",
        is_primary: false,
        order: 1
      }
    ],
    taxonomies: [
      {
        id: 1,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products and devices",
        sort_order: 0,
        meta: { featured: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 13,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Smart Device",
        slug: "smart-device",
        description: "Smart connected devices",
        sort_order: 4,
        meta: { icon: "wifi" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 14,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Fitness",
        slug: "fitness",
        description: "Fitness related products",
        sort_order: 5,
        meta: { color: "blue" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 4,
    brand_id: 4,
    name: "Leather Messenger Bag",
    description: "Handcrafted genuine leather messenger bag with laptop compartment. Perfect for professionals.",
    sku: "LMB-BRN-001",
    is_active: true,
    created_at: "2024-04-05 11:20:00",
    updated_at: "2024-11-11 09:10:00",
    price: 189.99,
    discount_type: "percentage",
    discount_value: 20,
    quantity: 15,
    final_price: 151.99,
    categories: [
      { id: 25, name: "Fashion", slug: "fashion" },
      { id: 30, name: "Bags", slug: "bags" }
    ],
    brand: {
      id: 4,
      name: "Heritage Leather Co.",
      slug: "heritage-leather-co",
      logo: "https://picsum.photos/seed/brand4/200/100"
    },
    images: [
      {
        product_id: 4,
        url: "https://picsum.photos/seed/product4/400/400",
        alt_text: "Brown leather messenger bag",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 3,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Fashion & Accessories",
        slug: "fashion-accessories",
        description: "Fashion items and accessories",
        sort_order: 2,
        meta: { trending: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 15,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Handcrafted",
        slug: "handcrafted",
        description: "Handmade products",
        sort_order: 6,
        meta: { artisan: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 16,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Professional",
        slug: "professional",
        description: "Professional use products",
        sort_order: 7,
        meta: { business: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 5,
    brand_id: 5,
    name: "Stainless Steel Water Bottle 1L",
    description: "Double-walled insulated water bottle keeps drinks cold for 24hrs, hot for 12hrs",
    sku: "WSB-1L-BLK",
    is_active: true,
    created_at: "2024-05-12 08:45:00",
    updated_at: "2024-11-14 07:30:00",
    price: 34.99,
    discount_type: null,
    discount_value: null,
    quantity: 200,
    final_price: 34.99,
    categories: [
      { id: 35, name: "Home & Kitchen", slug: "home-kitchen" },
      { id: 40, name: "Drinkware", slug: "drinkware" }
    ],
    brand: {
      id: 5,
      name: "HydroLife",
      slug: "hydrolife",
      logo: "https://picsum.photos/seed/brand5/200/100"
    },
    images: [
      {
        product_id: 5,
        url: "https://picsum.photos/seed/product5/400/400",
        alt_text: "Black stainless steel water bottle",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 4,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen products",
        sort_order: 3,
        meta: { icon: "home" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 17,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Eco-Friendly",
        slug: "eco-friendly",
        description: "Environmentally friendly products",
        sort_order: 8,
        meta: { sustainable: true, color: "green" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 6,
    brand_id: 6,
    name: "Yoga Mat Premium Plus",
    description: "Extra thick 8mm yoga mat with carrying strap. Non-slip surface for all yoga styles.",
    sku: "YM-PP-PRP",
    is_active: true,
    created_at: "2024-06-18 13:00:00",
    updated_at: "2024-11-09 15:20:00",
    price: 49.99,
    discount_type: "percentage",
    discount_value: 25,
    quantity: 75,
    final_price: 37.49,
    categories: [
      { id: 45, name: "Sports & Fitness", slug: "sports-fitness" },
      { id: 50, name: "Yoga", slug: "yoga" }
    ],
    brand: {
      id: 6,
      name: "ZenFit",
      slug: "zenfit",
      logo: "https://picsum.photos/seed/brand6/200/100"
    },
    images: [
      {
        product_id: 6,
        url: "https://picsum.photos/seed/product6/400/400",
        alt_text: "Purple yoga mat rolled",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 5,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Sports & Fitness",
        slug: "sports-fitness",
        description: "Sports and fitness equipment",
        sort_order: 4,
        meta: { popular: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 14,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Fitness",
        slug: "fitness",
        description: "Fitness related products",
        sort_order: 5,
        meta: { color: "blue" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 18,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Yoga",
        slug: "yoga",
        description: "Yoga products and accessories",
        sort_order: 9,
        meta: { wellness: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 7,
    brand_id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
    sku: "WBH-001",
    is_active: true,
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-11-10 14:20:00",
    price: 149.99,
    discount_type: "percentage",
    discount_value: 15,
    quantity: 45,
    final_price: 127.49,
    categories: [
      { id: 1, name: "Electronics", slug: "electronics" },
      { id: 5, name: "Audio", slug: "audio" }
    ],
    brand: {
      id: 1,
      name: "SoundWave",
      slug: "soundwave",
      logo: "https://picsum.photos/seed/brand1/200/100"
    },
    images: [
      {
        product_id: 1,
        url: "https://picsum.photos/seed/product1/400/400",
        alt_text: "Wireless headphones front view",
        is_primary: true,
        order: 0
      },
      {
        product_id: 1,
        url: "https://picsum.photos/seed/product1b/400/400",
        alt_text: "Wireless headphones side view",
        is_primary: false,
        order: 1
      }
    ],
    taxonomies: [
      {
        id: 1,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products and devices",
        sort_order: 0,
        meta: { featured: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 18,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Premium",
        slug: "premium",
        description: "Premium quality products",
        sort_order: 1,
        meta: { color: "gold" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 8,
    brand_id: 2,
    name: "Organic Green Tea - 100 Bags",
    description: "Premium organic green tea sourced from high-altitude tea gardens. Rich in antioxidants.",
    sku: "TEA-GT-100",
    is_active: true,
    created_at: "2024-02-20 09:15:00",
    updated_at: "2024-11-12 11:45:00",
    price: 24.99,
    discount_type: null,
    discount_value: null,
    quantity: 120,
    final_price: 24.99,
    categories: [
      { id: 10, name: "Food & Beverages", slug: "food-beverages" },
      { id: 15, name: "Tea", slug: "tea" }
    ],
    brand: {
      id: 2,
      name: "Nature's Leaf",
      slug: "natures-leaf",
      logo: "https://picsum.photos/seed/brand2/200/100"
    },
    images: [
      {
        product_id: 2,
        url: "https://picsum.photos/seed/product2/400/400",
        alt_text: "Organic green tea box",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 2,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Food & Beverages",
        slug: "food-beverages",
        description: "Food and beverage products",
        sort_order: 1,
        meta: { icon: "utensils" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 11,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Organic",
        slug: "organic",
        description: "Certified organic products",
        sort_order: 2,
        meta: { certified: true, color: "green" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 12,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Health & Wellness",
        slug: "health-wellness",
        description: "Health and wellness products",
        sort_order: 3,
        meta: { icon: "heart" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 9,
    brand_id: 3,
    name: "Smart Fitness Watch Pro",
    description: "Track your fitness goals with heart rate monitoring, GPS, and 50+ sport modes",
    sku: "SFW-PRO-001",
    is_active: true,
    created_at: "2024-03-10 14:00:00",
    updated_at: "2024-11-13 16:30:00",
    price: 299.99,
    discount_type: "fixed",
    discount_value: 50,
    quantity: 28,
    final_price: 249.99,
    categories: [
      { id: 1, name: "Electronics", slug: "electronics" },
      { id: 20, name: "Wearables", slug: "wearables" }
    ],
    brand: {
      id: 3,
      name: "FitTech",
      slug: "fittech",
      logo: "https://picsum.photos/seed/brand3/200/100"
    },
    images: [
      {
        product_id: 3,
        url: "https://picsum.photos/seed/product3/400/400",
        alt_text: "Smart fitness watch on wrist",
        is_primary: true,
        order: 0
      },
      {
        product_id: 3,
        url: "https://picsum.photos/seed/product3b/400/400",
        alt_text: "Smart fitness watch display",
        is_primary: false,
        order: 1
      }
    ],
    taxonomies: [
      {
        id: 1,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products and devices",
        sort_order: 0,
        meta: { featured: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 13,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Smart Device",
        slug: "smart-device",
        description: "Smart connected devices",
        sort_order: 4,
        meta: { icon: "wifi" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 14,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Fitness",
        slug: "fitness",
        description: "Fitness related products",
        sort_order: 5,
        meta: { color: "blue" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 10,
    brand_id: 4,
    name: "Leather Messenger Bag",
    description: "Handcrafted genuine leather messenger bag with laptop compartment. Perfect for professionals.",
    sku: "LMB-BRN-001",
    is_active: true,
    created_at: "2024-04-05 11:20:00",
    updated_at: "2024-11-11 09:10:00",
    price: 189.99,
    discount_type: "percentage",
    discount_value: 20,
    quantity: 15,
    final_price: 151.99,
    categories: [
      { id: 25, name: "Fashion", slug: "fashion" },
      { id: 30, name: "Bags", slug: "bags" }
    ],
    brand: {
      id: 4,
      name: "Heritage Leather Co.",
      slug: "heritage-leather-co",
      logo: "https://picsum.photos/seed/brand4/200/100"
    },
    images: [
      {
        product_id: 4,
        url: "https://picsum.photos/seed/product4/400/400",
        alt_text: "Brown leather messenger bag",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 3,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Fashion & Accessories",
        slug: "fashion-accessories",
        description: "Fashion items and accessories",
        sort_order: 2,
        meta: { trending: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 15,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Handcrafted",
        slug: "handcrafted",
        description: "Handmade products",
        sort_order: 6,
        meta: { artisan: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 16,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Professional",
        slug: "professional",
        description: "Professional use products",
        sort_order: 7,
        meta: { business: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 11,
    brand_id: 5,
    name: "Stainless Steel Water Bottle 1L",
    description: "Double-walled insulated water bottle keeps drinks cold for 24hrs, hot for 12hrs",
    sku: "WSB-1L-BLK",
    is_active: true,
    created_at: "2024-05-12 08:45:00",
    updated_at: "2024-11-14 07:30:00",
    price: 34.99,
    discount_type: null,
    discount_value: null,
    quantity: 200,
    final_price: 34.99,
    categories: [
      { id: 35, name: "Home & Kitchen", slug: "home-kitchen" },
      { id: 40, name: "Drinkware", slug: "drinkware" }
    ],
    brand: {
      id: 5,
      name: "HydroLife",
      slug: "hydrolife",
      logo: "https://picsum.photos/seed/brand5/200/100"
    },
    images: [
      {
        product_id: 5,
        url: "https://picsum.photos/seed/product5/400/400",
        alt_text: "Black stainless steel water bottle",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 4,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Home and kitchen products",
        sort_order: 3,
        meta: { icon: "home" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 17,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Eco-Friendly",
        slug: "eco-friendly",
        description: "Environmentally friendly products",
        sort_order: 8,
        meta: { sustainable: true, color: "green" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  },
  {
    id: 12,
    brand_id: 6,
    name: "Yoga Mat Premium Plus",
    description: "Extra thick 8mm yoga mat with carrying strap. Non-slip surface for all yoga styles.",
    sku: "YM-PP-PRP",
    is_active: true,
    created_at: "2024-06-18 13:00:00",
    updated_at: "2024-11-09 15:20:00",
    price: 49.99,
    discount_type: "percentage",
    discount_value: 25,
    quantity: 75,
    final_price: 37.49,
    categories: [
      { id: 45, name: "Sports & Fitness", slug: "sports-fitness" },
      { id: 50, name: "Yoga", slug: "yoga" }
    ],
    brand: {
      id: 6,
      name: "ZenFit",
      slug: "zenfit",
      logo: "https://picsum.photos/seed/brand6/200/100"
    },
    images: [
      {
        product_id: 6,
        url: "https://picsum.photos/seed/product6/400/400",
        alt_text: "Purple yoga mat rolled",
        is_primary: true,
        order: 0
      }
    ],
    taxonomies: [
      {
        id: 5,
        taxonomy_type_id: 1,
        parent_id: null,
        name: "Sports & Fitness",
        slug: "sports-fitness",
        description: "Sports and fitness equipment",
        sort_order: 4,
        meta: { popular: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 1,
          name: "Categories",
          slug: "categories",
          description: "Product categories",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 14,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Fitness",
        slug: "fitness",
        description: "Fitness related products",
        sort_order: 5,
        meta: { color: "blue" },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      },
      {
        id: 18,
        taxonomy_type_id: 2,
        parent_id: null,
        name: "Yoga",
        slug: "yoga",
        description: "Yoga products and accessories",
        sort_order: 9,
        meta: { wellness: true },
        created_at: "2024-01-01T12:00:00.000000Z",
        updated_at: "2024-01-01T12:00:00.000000Z",
        type: {
          id: 2,
          name: "Tags",
          slug: "tags",
          description: "Product tags",
          created_at: "2024-01-01T12:00:00.000000Z",
          updated_at: "2024-01-01T12:00:00.000000Z"
        },
        parent: null,
        children: []
      }
    ],
  }
];