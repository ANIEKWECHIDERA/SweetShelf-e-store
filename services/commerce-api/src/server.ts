import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  checkoutRequestSchema,
  checkoutResponseSchema,
  mockOrders,
  mockProducts,
  orderReceiptResponseSchema,
  paymentExportQuerySchema,
} from "@sweetshelf/shared-types";

export function buildCommerceApi() {
  const app = Fastify({ logger: true });

  // This service owns business-side HTTP workflows so the frontend apps stay focused on UX concerns.
  app.register(cors, { origin: true });

  app.get("/health", async () => ({ ok: true, service: "commerce-api" }));

  app.get("/products", async () => ({ products: mockProducts }));

  app.post("/checkout", async (request, reply) => {
    const parsed = checkoutRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    // Prices are recomputed from our source-of-truth product list instead of trusting browser-submitted amounts.
    const subtotal = parsed.data.cartItems.reduce((sum, item) => {
      const product = mockProducts.find((candidate) => candidate.id === item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    const response = {
      authorizationUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000"}/order-success?reference=pay_demo_001`,
      reference: "pay_demo_001",
      orderId: "order-demo-001",
      subtotal,
    };

    checkoutResponseSchema.parse({
      authorizationUrl: response.authorizationUrl,
      reference: response.reference,
      orderId: response.orderId,
    });

    return reply.send(response);
  });

  app.get("/orders/:reference", async (request, reply) => {
    const { reference } = request.params as { reference: string };
    const order = mockOrders.find((entry) => entry.paymentReference === reference);

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    return reply.send(orderReceiptResponseSchema.parse({ order }));
  });

  app.get("/payments/export", async (request, reply) => {
    const parsed = paymentExportQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const rows = mockOrders
      .filter((order) =>
        parsed.data.searchRef
          ? order.paymentReference.toLowerCase().includes(parsed.data.searchRef.toLowerCase())
          : true,
      )
      .map((order) =>
        [order.paymentReference, order.customerName, order.total, order.paymentStatus, order.createdAt].join(","),
      )
      .join("\n");

    reply.header("Content-Type", "text/csv");
    reply.header("Content-Disposition", "attachment; filename=payments.csv");
    return reply.send(`reference,customer,total,status,created_at\n${rows}`);
  });

  return app;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const app = buildCommerceApi();
  app.listen({ port: 4100, host: "0.0.0.0" });
}
