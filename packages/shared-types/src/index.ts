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
