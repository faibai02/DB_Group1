import { postJSON } from "./http";

export interface OrderItem {
  dish_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderRequest {
  restaurant_id: number;
  total_amount: number;
  delivery_address?: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: number;
  message: string;
}

export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
  return postJSON<CreateOrderResponse>("user/orders", orderData);
}
