import { getCartTotals } from "../../apps/storefront-web/lib/cart-store";

describe("cart totals", () => {
  it("calculates total price and item count", () => {
    const result = getCartTotals([
      {
        productId: "a",
        name: "Cake",
        price: 5000,
        quantity: 2,
        imageUrl: "",
        maxQuantity: 5,
      },
      {
        productId: "b",
        name: "Cookie Tin",
        price: 3000,
        quantity: 1,
        imageUrl: "",
        maxQuantity: 5,
      },
    ]);

    expect(result.total).toBe(13000);
    expect(result.itemCount).toBe(3);
  });
});
