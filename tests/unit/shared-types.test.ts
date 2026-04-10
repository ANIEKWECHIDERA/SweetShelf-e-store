import { checkoutRequestSchema, formatCurrency, slugify } from "@sweetshelf/shared-types";

describe("shared types", () => {
  it("accepts a valid checkout payload", () => {
    const result = checkoutRequestSchema.safeParse({
      customerName: "Ada Okafor",
      customerEmail: "ada@example.com",
      deliveryType: "pickup",
      storeId: "store-demo",
      cartItems: [{ productId: "prod-red-velvet", quantity: 1 }],
    });

    expect(result.success).toBe(true);
  });

  it("formats naira values predictably", () => {
    expect(formatCurrency(6500)).toContain("6,500");
  });

  it("creates a slug from free text", () => {
    expect(slugify(" Salted Caramel Cupcake Box ")).toBe("salted-caramel-cupcake-box");
  });
});
