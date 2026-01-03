import React, { useState } from 'react';
import { Search, Shield, ShieldX, Eye, Download, X } from 'lucide-react';

const Seekers: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeeker, setSelectedSeeker] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingSeeker, setBlockingSeeker] = useState<any>(null);

  const [seekers, setSeekers] = useState([
    { id: 1, name: 'Ali Hassan', email: 'ali@example.com', phone: '+92-300-1111111', address: 'House A230, Sector1', totalBookings: 12, status: 'active', lastBooking: '2024-12-20' },
    { id: 2, name: 'Zara Khan', email: 'zara@example.com', phone: '+92-301-2222222', address: 'House B120, Sector5', totalBookings: 8, status: 'active', lastBooking: '2024-12-18' },
    { id: 3, name: 'Hassan Ahmed', email: 'hassan@example.com', phone: '+92-302-3333333', address: 'Street 45, Block C', totalBookings: 15, status: 'active', lastBooking: '2024-12-19' },
    { id: 4, name: 'Mariam Shah', email: 'mariam@example.com', phone: '+92-303-4444444', address: 'Flat 22, Tower D', totalBookings: 3, status: 'blocked', lastBooking: '2024-11-15' },
  ]);

  const handleViewSeeker = (seeker: any) => {
    setSelectedSeeker(seeker);
    setShowModal(true);
  };

  const handleBlockSeeker = (seeker: any) => {
    setBlockingSeeker(seeker);
    setShowBlockModal(true);
  };

  const confirmBlock = () => {
    setSeekers(seekers.map(s =>
      s.id === blockingSeeker.id
        ? { ...s, status: s.status === 'blocked' ? 'active' : 'blocked' }
        : s
    ));
    setShowBlockModal(false);
    setBlockingSeeker(null);
  };

  const filteredSeekers = seekers.filter(seeker => {
    const matchesFilter = filter === 'all' || seeker.status === filter;
    const matchesSearch = seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seeker.email.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Stats moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Seekers</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>{seekers.length}</p>
          <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Seekers</p>
          <p className="text-3xl font-bold text-green-600">{seekers.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-gray-500 mt-1">Currently using platform</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Average Bookings</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>
            {Math.round(seekers.reduce((acc, s) => acc + s.totalBookings, 0) / seekers.length)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per seeker</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Service Seekers</h1>
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
                placeholder="Search seekers..."
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
              <option value="all">All Seekers</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seekers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#19034d' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Seeker</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Total Bookings</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Last Booking</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSeekers.map((seeker) => (
                <tr key={seeker.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#05f51d' }}>
                        {seeker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{seeker.name}</div>
                        <div className="text-sm text-gray-500">{seeker.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seeker.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seeker.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seeker.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(seeker.lastBooking).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(seeker.status)}`}>
                      {seeker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSeeker(seeker)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {seeker.status === 'active' ? (
                        <button
                          onClick={() => handleBlockSeeker(seeker)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Block User"
                        >
                          <ShieldX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockSeeker(seeker)}
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

      {/* Seeker Details Modal */}
      {showModal && selectedSeeker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>Seeker Details - {selectedSeeker.name}</h3>
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
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedSeeker.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedSeeker.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedSeeker.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedSeeker.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="font-medium">{selectedSeeker.totalBookings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Booking</p>
                  <p className="font-medium">{new Date(selectedSeeker.lastBooking).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && blockingSeeker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>
                {blockingSeeker.status === 'blocked' ? 'Unblock' : 'Block'} Seeker
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {blockingSeeker.status === 'blocked' ? 'unblock' : 'block'} {blockingSeeker.name}?
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
                    blockingSeeker.status === 'blocked' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {blockingSeeker.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seekers;
