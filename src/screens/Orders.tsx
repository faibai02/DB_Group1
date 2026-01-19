
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJSON } from '../api/http';
import { deleteOrder, updateOrderAddress } from '../api/ordersApi';
import OrderDetail from './OrderDetail';

interface OrderData {
  orders_id: number;
  customer_id: number;
  restaurant_id: number;
  courier_id?: number;
  status: string;
  total_amount: number;
  delivery_address: string;
  created_at?: string;
}

const Orders: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      fetchOrders();
    } else if (!authLoading && !isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getJSON<OrderData[]>('user/orders');
      console.log('Orders received:', data);
      // Handle null/undefined response
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const canModifyOrder = (status: string) => {
    return status.toLowerCase() === 'pending';
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      setIsDeleting(orderId);
      await deleteOrder(orderId);
      await fetchOrders(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete order');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditOrder = (orderId: number, currentAddress: string) => {
    setEditingOrderId(orderId);
    setNewAddress(currentAddress);
  };

  const handleSaveAddress = async (orderId: number) => {
    if (!newAddress.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    try {
      await updateOrderAddress(orderId, newAddress);
      setEditingOrderId(null);
      await fetchOrders(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setNewAddress('');
  };

  if (selectedOrderId !== null) {
    return (
      <OrderDetail 
        orderId={selectedOrderId} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-icons-round text-6xl text-gray-400 animate-spin block mb-4">
            autorenew
          </span>
          <p className="text-[#9a734c] font-bold">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 p-8">
          <span className="material-icons-round text-8xl text-[#ec8013]">lock</span>
          <h2 className="text-3xl font-black text-[#1b140d]">Please Sign In</h2>
          <p className="text-[#9a734c] text-lg">You need to be logged in to view your orders</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">My Orders</h1>
        <p className="text-[#9a734c] mt-2">You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#f3ede7]">
          <span className="material-icons-round text-6xl text-[#9a734c] opacity-50">shopping_bag</span>
          <p className="text-[#9a734c] mt-4">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fcfaf8] border-b border-[#f3ede7]">
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Address</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede7]">
                {orders.map((order) => (
                  <tr 
                    key={order.orders_id} 
                    onClick={() => setSelectedOrderId(order.orders_id)}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6 text-sm font-bold text-[#ec8013]">#{order.orders_id}</td>
                    <td className="px-8 py-6 text-sm font-medium text-[#9a734c]">{formatDate(order.created_at)}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#ec8013]">${order.total_amount.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {editingOrderId === order.orders_id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="flex-1 px-3 py-2 border border-[#f3ede7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ec8013]"
                            placeholder="Enter new address"
                          />
                          <button
                            onClick={() => handleSaveAddress(order.orders_id)}
                            className="px-3 py-2 bg-[#ec8013] text-white rounded-lg text-xs font-bold hover:bg-[#d47012] transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-[#9a734c]">{order.delivery_address || 'N/A'}</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      {canModifyOrder(order.status) ? (
                        <div className="flex gap-2">
                          {editingOrderId !== order.orders_id && (
                            <>
                              <button
                                onClick={() => handleEditOrder(order.orders_id, order.delivery_address)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit address"
                              >
                                <span className="material-icons-round text-xl">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.orders_id)}
                                disabled={isDeleting === order.orders_id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete order"
                              >
                                <span className="material-icons-round text-xl">
                                  {isDeleting === order.orders_id ? 'hourglass_empty' : 'delete'}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Cannot modify</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
