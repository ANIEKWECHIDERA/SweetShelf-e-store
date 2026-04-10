import { z } from "zod";

export const tagSchema = z.enum(["new", "on_sale"]);
export const stockStatusSchema = z.enum(["in_stock", "out_of_stock"]);
export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
]);
export const paymentStatusSchema = z.enum(["unpaid", "paid", "refunded"]);
export const deliveryTypeSchema = z.enum(["pickup", "delivery"]);

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number(),
});

export const productSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrls: z.array(z.string()),
  stockQuantity: z.number(),
  lowStockThreshold: z.number(),
  status: stockStatusSchema,
  tags: z.array(tagSchema),
  isActive: z.boolean(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number(),
  quantity: z.number().int().positive(),
  subtotal: z.number(),
});

export const orderSchema = z.object({
  id: z.string(),
  paymentReference: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  deliveryType: deliveryTypeSchema,
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  subtotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  status: orderStatusSchema,
  paymentStatus: paymentStatusSchema,
  paymentChannel: z.string().optional(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
});

export const profileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "customer"]),
});

export const favouriteSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  productId: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Favourite = z.infer<typeof favouriteSchema>;

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const checkoutRequestSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.email().optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  deliveryType: deliveryTypeSchema,
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  storeId: z.string().min(1),
  cartItems: z.array(cartLineSchema).min(1),
});

export const checkoutResponseSchema = z.object({
  authorizationUrl: z.string().url(),
  reference: z.string(),
  orderId: z.string(),
});

export const orderReceiptResponseSchema = z.object({
  order: orderSchema,
});

export const paymentExportQuerySchema = z.object({
  searchRef: z.string().optional(),
});

export const paystackChargeSchema = z.object({
  event: z.literal("charge.success"),
  data: z.object({
    reference: z.string(),
    channel: z.string().optional(),
    metadata: z.object({
      orderId: z.string(),
    }),
  }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
export type OrderReceiptResponse = z.infer<typeof orderReceiptResponseSchema>;
export type PaymentExportQuery = z.infer<typeof paymentExportQuerySchema>;
export type WebhookChargeSuccessPayload = z.infer<typeof paystackChargeSchema>;

export const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_STORE_ID: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  INTERNAL_SERVICE_TOKEN: z.string().default("dev-internal-token"),
  COMMERCE_API_URL: z.string().url().default("http://127.0.0.1:4100"),
  NOTIFICATION_WORKER_URL: z.string().url().default("http://127.0.0.1:4200"),
});

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_STORE_ID: z.string().default("store-demo"),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  COMMERCE_API_URL: z.string().url().default("http://127.0.0.1:4100"),
});

export const mockCategories: Category[] = [
  { id: "cat-cakes", name: "Cakes", slug: "cakes", sortOrder: 1 },
  { id: "cat-cookies", name: "Cookies", slug: "cookies", sortOrder: 2 },
  { id: "cat-drinks", name: "Drinks", slug: "drinks", sortOrder: 3 },
  { id: "cat-pastries", name: "Pastries", slug: "pastries", sortOrder: 4 },
  { id: "cat-boxes", name: "Dessert Boxes", slug: "dessert-boxes", sortOrder: 5 },
];

export const mockProducts: Product[] = [
  {
    id: "prod-red-velvet",
    categoryId: "cat-cakes",
    categoryName: "Cakes",
    name: "Red Velvet Slice",
    slug: "red-velvet-slice",
    description: "A cocoa-kissed red velvet slice finished with light cream cheese frosting.",
    price: 6500,
    imageUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 8,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-caramel-cupcake",
    categoryId: "cat-cakes",
    categoryName: "Cakes",
    name: "Salted Caramel Cupcake Box",
    slug: "salted-caramel-cupcake-box",
    description: "Six caramel cupcakes with whipped buttercream and crisp caramel drizzle.",
    price: 12000,
    imageUrls: ["https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 3,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: ["on_sale"],
    isActive: true,
  },
  {
    id: "prod-choco-cookie",
    categoryId: "cat-cookies",
    categoryName: "Cookies",
    name: "Dark Chocolate Cookie Tin",
    slug: "dark-chocolate-cookie-tin",
    description: "Chunky chocolate cookies baked soft inside and crackled at the edge.",
    price: 9000,
    imageUrls: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 0,
    lowStockThreshold: 2,
    status: "out_of_stock",
    tags: [],
    isActive: true,
  },
  {
    id: "prod-iced-latte",
    categoryId: "cat-drinks",
    categoryName: "Drinks",
    name: "Vanilla Iced Latte",
    slug: "vanilla-iced-latte",
    description: "Cold-brewed espresso, vanilla cream, and rich milk over ice.",
    price: 4500,
    imageUrls: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 10,
    lowStockThreshold: 4,
    status: "in_stock",
    tags: [],
    isActive: true,
  },
  {
    id: "prod-pistachio-tart",
    categoryId: "cat-pastries",
    categoryName: "Pastries",
    name: "Pistachio Berry Tart",
    slug: "pistachio-berry-tart",
    description: "Buttery tart shell layered with pistachio cream and fresh berries.",
    price: 8500,
    imageUrls: ["https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 6,
    lowStockThreshold: 2,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-mini-eclair",
    categoryId: "cat-pastries",
    categoryName: "Pastries",
    name: "Mini Eclair Trio",
    slug: "mini-eclair-trio",
    description: "Three petite eclairs with coffee, vanilla, and chocolate fillings.",
    price: 7800,
    imageUrls: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 9,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: ["on_sale"],
    isActive: true,
  },
  {
    id: "prod-brunch-box",
    categoryId: "cat-boxes",
    categoryName: "Dessert Boxes",
    name: "Weekend Brunch Dessert Box",
    slug: "weekend-brunch-dessert-box",
    description: "A shareable box with croissants, brownies, cookies, and petite pastries.",
    price: 18500,
    imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 4,
    lowStockThreshold: 2,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-matcha-cheesecake",
    categoryId: "cat-cakes",
    categoryName: "Cakes",
    name: "Matcha Cheesecake Jar",
    slug: "matcha-cheesecake-jar",
    description: "Silky no-bake cheesecake with matcha cream and biscuit crumble.",
    price: 7000,
    imageUrls: ["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 7,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: ["on_sale"],
    isActive: true,
  },
  {
    id: "prod-cinnamon-roll",
    categoryId: "cat-pastries",
    categoryName: "Pastries",
    name: "Brown Butter Cinnamon Roll",
    slug: "brown-butter-cinnamon-roll",
    description: "Soft laminated roll glazed with brown butter icing and toasted pecans.",
    price: 5200,
    imageUrls: ["https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 12,
    lowStockThreshold: 4,
    status: "in_stock",
    tags: [],
    isActive: true,
  },
  {
    id: "prod-strawberry-shortcake",
    categoryId: "cat-cakes",
    categoryName: "Cakes",
    name: "Strawberry Shortcake Jar",
    slug: "strawberry-shortcake-jar",
    description: "Layered vanilla sponge, fresh strawberries, and whipped cream in a gift-ready jar.",
    price: 7200,
    imageUrls: ["https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 11,
    lowStockThreshold: 4,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-macaron-box",
    categoryId: "cat-boxes",
    categoryName: "Dessert Boxes",
    name: "Parisian Macaron Gift Box",
    slug: "parisian-macaron-gift-box",
    description: "Twelve crisp-shell macarons in vanilla, raspberry, pistachio, and chocolate.",
    price: 16500,
    imageUrls: ["https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 5,
    lowStockThreshold: 2,
    status: "in_stock",
    tags: ["on_sale"],
    isActive: true,
  },
  {
    id: "prod-croissant-box",
    categoryId: "cat-pastries",
    categoryName: "Pastries",
    name: "Butter Croissant Breakfast Box",
    slug: "butter-croissant-breakfast-box",
    description: "A flaky breakfast box with butter croissants, jam pots, and whipped mascarpone.",
    price: 14200,
    imageUrls: ["https://images.unsplash.com/photo-1555507036-ab794f4afe5a?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 6,
    lowStockThreshold: 2,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-iced-mocha",
    categoryId: "cat-drinks",
    categoryName: "Drinks",
    name: "Hazelnut Iced Mocha",
    slug: "hazelnut-iced-mocha",
    description: "Chocolate espresso, hazelnut cream, and chilled milk topped with cocoa dust.",
    price: 5200,
    imageUrls: ["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 13,
    lowStockThreshold: 5,
    status: "in_stock",
    tags: [],
    isActive: true,
  },
  {
    id: "prod-lemon-madeleine",
    categoryId: "cat-cookies",
    categoryName: "Cookies",
    name: "Lemon Madeleine Pack",
    slug: "lemon-madeleine-pack",
    description: "Soft French shell cakes glazed with bright lemon icing and candied zest.",
    price: 6800,
    imageUrls: ["https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 8,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: ["new"],
    isActive: true,
  },
  {
    id: "prod-brownie-sampler",
    categoryId: "cat-boxes",
    categoryName: "Dessert Boxes",
    name: "Brownie Sampler Box",
    slug: "brownie-sampler-box",
    description: "An indulgent box of fudge brownies in salted caramel, red velvet, and espresso flavours.",
    price: 15400,
    imageUrls: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 7,
    lowStockThreshold: 2,
    status: "in_stock",
    tags: ["on_sale"],
    isActive: true,
  },
  {
    id: "prod-mango-parfait",
    categoryId: "cat-drinks",
    categoryName: "Drinks",
    name: "Mango Yogurt Parfait",
    slug: "mango-yogurt-parfait",
    description: "Chilled mango yogurt layered with granola clusters and tropical fruit compote.",
    price: 6100,
    imageUrls: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"],
    stockQuantity: 9,
    lowStockThreshold: 3,
    status: "in_stock",
    tags: [],
    isActive: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-demo-001",
    paymentReference: "pay_demo_001",
    customerName: "Ada Okafor",
    customerEmail: "ada@example.com",
    customerPhone: "+2348012345678",
    deliveryType: "delivery",
    deliveryAddress: "15 Admiralty Way, Lekki, Lagos",
    notes: "Please add extra napkins.",
    subtotal: 18500,
    deliveryFee: 2500,
    total: 21000,
    status: "confirmed",
    paymentStatus: "paid",
    paymentChannel: "card",
    createdAt: new Date("2026-04-09T10:00:00.000Z").toISOString(),
    items: [
      {
        id: "item-demo-001",
        productId: "prod-red-velvet",
        productName: "Red Velvet Slice",
        productPrice: 6500,
        quantity: 1,
        subtotal: 6500,
      },
      {
        id: "item-demo-002",
        productId: "prod-caramel-cupcake",
        productName: "Salted Caramel Cupcake Box",
        productPrice: 12000,
        quantity: 1,
        subtotal: 12000,
      },
    ],
  },
];

export const mockAdminProfile: Profile = {
  id: "profile-admin-1",
  fullName: "SweetShelf Admin",
  email: "admin@sweetshelf.dev",
  role: "admin",
};

export const mockCustomerProfile: Profile = {
  id: "profile-customer-1",
  fullName: "Amara James",
  email: "amara@example.com",
  role: "customer",
};

export const storefrontContact = {
  whatsappNumber: "+2348106258080",
};

export function getWhatsAppHref(message: string) {
  const normalizedNumber = storefrontContact.whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
