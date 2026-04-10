import { createPaystackSignature } from "../../services/notification-worker/src/server";

describe("paystack webhook signature", () => {
  it("creates deterministic signatures", () => {
    const body = JSON.stringify({
      event: "charge.success",
      data: { reference: "pay_demo_001", metadata: { orderId: "order-demo-001" } },
    });

    const signature = createPaystackSignature(body, "dev-secret");

    expect(signature).toBe(createPaystackSignature(body, "dev-secret"));
    expect(signature).not.toBe(createPaystackSignature(body, "different-secret"));
  });
});
