import { createHmac } from "node:crypto";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { paystackChargeSchema } from "@sweetshelf/shared-types";

export function createPaystackSignature(rawBody: string, secret: string) {
  return createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");
}

export function buildNotificationWorker() {
  const app = Fastify({ logger: true });

  // Webhook verification belongs here so payment providers never talk directly to browser-facing apps.
  app.register(cors, { origin: true });

  app.get("/health", async () => ({ ok: true, service: "notification-worker" }));

  app.post("/webhooks/paystack", async (request, reply) => {
    const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
    const signature = request.headers["x-paystack-signature"];
    // Using a helper here keeps the HMAC logic testable and avoids duplicate verification code later.
    const expected = createPaystackSignature(rawBody, process.env.PAYSTACK_SECRET_KEY ?? "dev-secret");

    if (signature !== expected) {
      return reply.status(400).send({ error: "Invalid signature" });
    }

    const payload = paystackChargeSchema.parse(
      typeof request.body === "string" ? JSON.parse(request.body) : request.body,
    );

    return reply.send({
      ok: true,
      event: payload.event,
      orderId: payload.data.metadata.orderId,
    });
  });

  return app;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
  const app = buildNotificationWorker();
  app.listen({ port: 4200, host: "0.0.0.0" });
}
