import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJSON, putJSON, deleteRequest } from '../api/http';

interface OrderItem {
  dish_id: number;
  dish_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDetail {
  orders_id: number;
  customer_id: number;
  restaurant_id: number;
  restaurant_name: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderDetailProps {
  orderId: number;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onBack }) => {
  const { isLoggedIn } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuantities, setEditingQuantities] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrderDetail();
    }
  }, [orderId, isLoggedIn]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await getJSON<OrderDetail>(`user/orders/${orderId}`);
      setOrder(data);
      const qty: Record<number, number> = {};
      data.items.forEach(item => {
        qty[item.dish_id] = item.quantity;
      });
      setQuantities(qty);
      setError(null);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuantities = async () => {
    try {
      setIsSaving(true);
      // Just refresh the data since auto-save already saved everything
      await fetchOrderDetail();
      setEditingQuantities(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quantities');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (dishId: number) => {
    if (!window.confirm('Are you sure you want to remove this item?')) {
      return;
    }

    try {
      setDeletingItemId(dishId);
      await deleteRequest(`user/orders/${orderId}/items/${dishId}`);
      // Refresh the order data
      await fetchOrderDetail();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({
      ...prev,
      [dishId]: newQuantity
    }));

    // Auto-save with debounce
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        await putJSON(`user/orders/${orderId}/items/${dishId}`, { quantity: newQuantity });
        // Refresh order data to ensure consistency
        await fetchOrderDetail();
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Save after 1 second of no changes

    setAutoSaveTimeout(timeout);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'on the way':
      case 'delivering':
        return 'bg-cyan-100 text-cyan-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteRequest(`user/orders/${orderId}`);
      onBack();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete order');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec8013] mx-auto mb-4"></div>
          <p className="text-[#1b140d]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#ec8013] text-white rounded-lg hover:bg-[#d47310]"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#ec8013] hover:text-[#d47310] font-semibold"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-[#1b140d]">Order #{order.orders_id}</h1>
          {order.status.toLowerCase() === 'pending' && (
            <button
              onClick={handleDeleteOrder}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Order'}
            </button>
          )}
        </div>

        {/* Order Header Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Restaurant</p>
              <p className="text-lg font-semibold text-[#1b140d]">{order.restaurant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-lg font-semibold text-[#1b140d]">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-bold text-[#ec8013]">${order.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1b140d]">Order Items</h2>
            {order.status === 'Pending' && !editingQuantities && (
              <button
                onClick={() => setEditingQuantities(true)}
                className="px-4 py-2 bg-[#ec8013] text-white rounded-lg hover:bg-[#d47310] font-semibold text-sm"
              >
                Edit Quantities
              </button>
            )}
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.dish_id} className="flex items-center justify-between border-b border-[#f3ede7] pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-[#1b140d]">{item.dish_name}</p>
                  <p className="text-sm text-gray-600">${item.unit_price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  {editingQuantities ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.dish_id, quantities[item.dish_id] - 1)}
                        disabled={isSaving}
                        className="w-8 h-8 rounded-lg bg-[#f3ede7] text-[#1b140d] hover:bg-[#ec8013] hover:text-white disabled:opacity-50 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{quantities[item.dish_id]}</span>
                      <button
                        onClick={() => handleQuantityChange(item.dish_id, quantities[item.dish_id] + 1)}
                        disabled={isSaving}
                        className="w-8 h-8 rounded-lg bg-[#f3ede7] text-[#1b140d] hover:bg-[#ec8013] hover:text-white disabled:opacity-50 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="w-12 text-center font-semibold text-[#1b140d]">{quantities[item.dish_id]}x</span>
                  )}
                  <p className="w-24 text-right font-bold text-[#ec8013]">
                    ${(item.unit_price * quantities[item.dish_id]).toFixed(2)}
                  </p>
                  {editingQuantities && (
                    <button
                      onClick={() => handleDeleteItem(item.dish_id)}
                      disabled={deletingItemId === item.dish_id}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editingQuantities && order.status === 'Pending' && (
            <div className="flex gap-2 mt-6 pt-6 border-t border-[#f3ede7]">
              <button
                onClick={handleSaveQuantities}
                disabled={isSaving}
                className="px-4 py-2 bg-[#ec8013] text-white rounded-lg hover:bg-[#d47310] font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditingQuantities(false);
                  setQuantities({});
                  if (order) {
                    const qty: Record<number, number> = {};
                    order.items.forEach(item => {
                      qty[item.dish_id] = item.quantity;
                    });
                    setQuantities(qty);
                  }
                }}
                className="px-4 py-2 bg-gray-300 text-[#1b140d] rounded-lg hover:bg-gray-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Note about modifications */}
        {order.status !== 'Pending' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <p className="font-semibold">Note:</p>
            <p>You can only modify quantities for pending orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
