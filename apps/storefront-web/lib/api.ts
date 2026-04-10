import {
  checkoutRequestSchema,
  type CheckoutRequest,
  type CheckoutResponse,
  mockCategories,
  mockOrders,
  mockProducts,
  type OrderReceiptResponse,
} from "@sweetshelf/shared-types";
import { publicEnv } from "./env";

export async function getCatalog() {
  return {
    categories: mockCategories,
    products: mockProducts,
  };
}

export async function createCheckoutSession(payload: CheckoutRequest): Promise<CheckoutResponse> {
  const parsed = checkoutRequestSchema.parse(payload);

  try {
    const response = await fetch(`${publicEnv.COMMERCE_API_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      throw new Error("Checkout service unavailable");
    }

    return (await response.json()) as CheckoutResponse;
  } catch {
    return {
      authorizationUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/order-success?reference=pay_demo_001`,
      reference: "pay_demo_001",
      orderId: "order-demo-001",
    };
  }
}

export async function getOrderByReference(reference: string): Promise<OrderReceiptResponse> {
  try {
    const response = await fetch(`${publicEnv.COMMERCE_API_URL}/orders/${reference}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Order lookup failed");
    }
    return (await response.json()) as OrderReceiptResponse;
  } catch {
    return {
      order: mockOrders.find((order) => order.paymentReference === reference) ?? mockOrders[0],
    };
  }
}
