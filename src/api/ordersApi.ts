import { deleteRequest, putJSON } from './http';

export const deleteOrder = async (orderId: number): Promise<void> => {
  await deleteRequest(`user/orders/${orderId}`);
};

export const updateOrderAddress = async (orderId: number, deliveryAddress: string): Promise<void> => {
  await putJSON(`user/orders/${orderId}`, { delivery_address: deliveryAddress });
};
