import React, { useState } from 'react';
import { Search, Shield, ShieldX, Eye, Download, X } from 'lucide-react';

const Shops: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingShop, setBlockingShop] = useState<any>(null);

  // ✅ updated data: added ownerName + shopName separately
  const [shops, setShops] = useState([
    { id: 1, ownerName: 'Ali Hassan', shopName: 'Ali Auto Works', email: 'ali@example.com', phone: '+92-300-1111111', totalBookings: 12, status: 'active', lastBooking: '2024-12-20' },
    { id: 2, ownerName: 'Zara Khan', shopName: 'Zara Beauty Salon', email: 'zara@example.com', phone: '+92-301-2222222', totalBookings: 8, status: 'active', lastBooking: '2024-12-18' },
    { id: 3, ownerName: 'Hassan Ahmed', shopName: 'Hassan Car Care', email: 'hassan@example.com', phone: '+92-302-3333333', totalBookings: 15, status: 'active', lastBooking: '2024-12-19' },
    { id: 4, ownerName: 'Mariam Shah', shopName: 'Mariam Boutique', email: 'mariam@example.com', phone: '+92-303-4444444', totalBookings: 3, status: 'blocked', lastBooking: '2024-11-15' },
  ]);

  const handleViewShop = (shop: any) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const handleBlockShop = (shop: any) => {
    setBlockingShop(shop);
    setShowBlockModal(true);
  };

  const confirmBlock = () => {
    setShops(shops.map(s => 
      s.id === blockingShop.id 
        ? { ...s, status: s.status === 'blocked' ? 'active' : 'blocked' }
        : s
    ));
    setShowBlockModal(false);
    setBlockingShop(null);
  };

  const filteredShops = shops.filter(shop => {
    const matchesFilter = filter === 'all' || shop.status === filter;
    const matchesSearch =
      shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Shops</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>{shops.length}</p>
          <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Shops</p>
          <p className="text-3xl font-bold text-green-600">{shops.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-gray-500 mt-1">Currently using platform</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Average Bookings</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>
            {Math.round(shops.reduce((acc, s) => acc + s.totalBookings, 0) / shops.length)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per Shop</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Service Shops</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:border-transparent"
            >
              <option value="all">All Shops</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#19034d' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Owner Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Total Bookings</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Last Booking</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#05f51d' }}>
                        {shop.ownerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{shop.ownerName}</div>
                        <div className="text-sm text-gray-500">{shop.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.shopName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.totalBookings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(shop.lastBooking).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(shop.status)}`}>
                      {shop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewShop(shop)}
                        className="text-blue-600 hover:text-blue-800 transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {shop.status === 'active' ? (
                        <button 
                          onClick={() => handleBlockShop(shop)}
                          className="text-red-600 hover:text-red-800 transition-colors" 
                          title="Block User"
                        >
                          <ShieldX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBlockShop(shop)}
                          className="text-green-600 hover:text-green-800 transition-colors" 
                          title="Unblock User"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shop Details Modal */}
      {showModal && selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>
                  Shop Details - {selectedShop.ownerName}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Owner Name</p>
                  <p className="font-medium">{selectedShop.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shop Name</p>
                  <p className="font-medium">{selectedShop.shopName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedShop.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedShop.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="font-medium">{selectedShop.totalBookings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Booking</p>
                  <p className="font-medium">{new Date(selectedShop.lastBooking).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && blockingShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>
                {blockingShop.status === 'blocked' ? 'Unblock' : 'Block'} Shop
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {blockingShop.status === 'blocked' ? 'unblock' : 'block'} {blockingShop.ownerName}?
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmBlock}
                  className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${
                    blockingShop.status === 'blocked' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {blockingShop.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shops;
