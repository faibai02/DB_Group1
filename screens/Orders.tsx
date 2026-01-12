
import React from 'react';
import { MOCK_ORDERS } from '../constants';

const Orders: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-black text-[#1b140d] tracking-tight">Past Orders</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-[#f3ede7] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf8] border-b border-[#f3ede7]">
                <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Order Date</th>
                <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Restaurant</th>
                <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Items</th>
                <th className="px-8 py-5 text-sm font-black text-[#1b140d] uppercase tracking-widest">Total</th>
                <th className="px-8 py-5 text-sm font-black text-[#9a734c] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede7]">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-medium text-[#9a734c]">{order.date}</td>
                  <td className="px-8 py-6 text-sm font-black text-[#1b140d]">{order.restaurant}</td>
                  <td className="px-8 py-6 text-sm font-medium text-[#9a734c]">{order.items} {order.items === 1 ? 'item' : 'items'}</td>
                  <td className="px-8 py-6 text-sm font-black text-[#ec8013]">${order.total.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <button className="text-sm font-black text-[#1b140d] uppercase tracking-widest hover:text-[#ec8013] transition-colors flex items-center gap-1">
                      View Details
                      <span className="material-icons-round text-lg">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
