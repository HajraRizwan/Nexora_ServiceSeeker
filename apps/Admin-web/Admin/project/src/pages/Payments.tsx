import React, { useState } from 'react';
import { Search, Filter, Download, CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const Payments: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    {
      id: 'P001',
      jobId: 'J001',
      seeker: 'Ali Hassan',
      provider: 'Ahmad Hassan',
      service: 'Electrical Work',
      amount: '₨2,500',
      paymentMode: 'Cash',
      status: 'paid',
      date: '2024-12-20',
      commission: '₨250'
    },
    {
      id: 'P002',
      jobId: 'J002',
      seeker: 'Zara Khan',
      provider: 'Fatima Ali',
      service: 'House Cleaning',
      amount: '₨1,800',
      paymentMode: 'Bank Transfer',
      status: 'paid',
      date: '2024-12-19',
      commission: '₨180'
    },
    {
      id: 'P003',
      jobId: 'J003',
      seeker: 'Hassan Ahmed',
      provider: 'Usman Khan',
      service: 'Plumbing',
      amount: '₨1,200',
      paymentMode: 'Cash',
      status: 'disputed',
      date: '2024-12-18',
      commission: '₨120'
    },
    {
      id: 'P004',
      jobId: 'J004',
      seeker: 'Mariam Shah',
      provider: 'Sarah Ahmed',
      service: 'Cooking',
      amount: '₨3,500',
      paymentMode: 'Online Transfer',
      status: 'paid',
      date: '2024-12-17',
      commission: '₨350'
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.seeker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments.reduce((acc, p) => acc + parseInt(p.amount.replace('₨', '').replace(',', '')), 0);
  const totalCommission = payments.reduce((acc, p) => acc + parseInt(p.commission.replace('₨', '')), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Payment History</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: '#05f51d' }}>
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold" style={{ color: '#19034d' }}>₨{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+18% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#05f51d' }}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-3xl font-bold" style={{ color: '#19034d' }}>₨{totalCommission.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">10% average rate</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#19034d' }}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-3xl font-bold" style={{ color: '#19034d' }}>{payments.length}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="disputed">Disputed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#19034d' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Payment Mode</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                    <div className="text-sm text-gray-500">Job: {payment.jobId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.service}</div>
                    <div className="text-sm text-gray-500">Commission: {payment.commission}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">From: {payment.seeker}</div>
                      <div className="text-sm text-gray-600">To: {payment.provider}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#19034d' }}>
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {payment.paymentMode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
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

export default Payments;