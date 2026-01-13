
import React, { useEffect, useState } from 'react';

interface OrderSummary {
  order_id: number;
  customer_id: number;
  restaurant_id: number;
  restaurant: string;
  status: string;
  total_amount: string;
  created_at: string;
  item_count: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost/api/orders_api.php?customer_id=1');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800';
      case 'On The Way':
        return 'bg-cyan-100 text-cyan-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-12">Loading orders...</div>;
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
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Restaurant</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Items</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede7]">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6 text-sm font-bold text-[#ec8013]">#{order.order_id}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#1b140d]">{order.restaurant}</td>
                    <td className="px-8 py-6 text-sm font-medium text-[#9a734c]">{formatDate(order.created_at)}</td>
                    <td className="px-8 py-6 text-sm font-medium text-[#9a734c]">{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#ec8013]">${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
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
