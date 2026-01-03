import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, Home, X } from 'lucide-react';

const Jobs: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const jobs = [
    {
      id: 'J001',
      category: 'Home Cleaning',
      subcategory: 'Deep Cleaning',
      seeker: 'Ali Hassan',
      seekerAddress: 'House A230, Sector 1, Lahore',
      provider: 'Fatima Khan',
      shop: null, // no shop
      date: '2024-12-21',
      time: '10:00 AM',
      visitcharges: '₨ 1000',
      status: 'ongoing'
    },
    {
      id: 'J002',
      category: 'Electrical',
      subcategory: 'Wiring Repair',
      seeker: 'Zara Shah',
      seekerAddress: 'Flat 22, DHA Phase 5, Karachi',
      provider: 'Ahmad Hassan',
      shop: 'PowerFix Electricals', // job came from a shop
      date: '2024-12-20',
      time: '2:00 PM',
      visitcharges: '₨ 1000',
      status: 'completed'
    },
    {
      id: 'J003',
      category: 'Plumbing',
      subcategory: 'Pipe Repair',
      seeker: 'Hassan Ali',
      seekerAddress: 'Street 45, Model Town, Lahore',
      provider: 'Usman Khan',
      shop: null,
      date: '2024-12-22',
      time: '9:00 AM',
      visitcharges: '₨ 1000',
      status: 'scheduled'
    },
    {
      id: 'J004',
      category: 'Cooking',
      subcategory: 'Party Catering',
      seeker: 'Ayesha Ahmed',
      seekerAddress: 'Block C, Johar Town, Lahore',
      provider: 'Samina Begum',
      shop: 'Foodies Catering', // from shop
      date: '2024-12-19',
      time: '6:00 PM',
      visitcharges: '₨ 1000',
      status: 'cancelled'
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch =
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.seeker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.shop && job.shop.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Job Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Jobs</p>
          <p className="text-3xl font-bold" style={{ color: '#19034d' }}>{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-bold text-green-600">{jobs.filter(j => j.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Ongoing</p>
          <p className="text-3xl font-bold text-blue-600">{jobs.filter(j => j.status === 'ongoing').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{jobs.filter(j => j.status === 'cancelled').length}</p>
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
                placeholder="Search jobs..."
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
              <option value="all">All Jobs</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#19034d' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Seeker Address</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Visit Charges</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.id}</div>
                      <div className="text-sm text-gray-600">{job.category}</div>
                      <div className="text-xs text-gray-500">{job.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">👤 {job.seeker}</div>
                      <div className="text-sm text-gray-600">🔧 {job.provider}</div>
                      {job.shop && <div className="text-sm text-purple-600">🏬 {job.shop}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{job.date}</div>
                        <div className="text-sm text-gray-600">{job.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span>{job.seekerAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.visitcharges}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewJob(job)}
                        className="text-blue-600 hover:text-blue-800 transition-colors" 
                        title="View Details"
                      >
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

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>Job Details - {selectedJob.id}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Job ID</p>
                  <p className="font-medium">{selectedJob.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{selectedJob.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subcategory</p>
                  <p className="font-medium">{selectedJob.subcategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Visit Charges</p>
                  <p className="font-medium">{selectedJob.visitcharges}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seeker</p>
                  <p className="font-medium">{selectedJob.seeker}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium">{selectedJob.provider}</p>
                </div>
                {selectedJob.shop && (
                  <div>
                    <p className="text-sm text-gray-600">Shop</p>
                    <p className="font-medium">{selectedJob.shop}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Seeker Address</p>
                  <p className="font-medium">{selectedJob.seekerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">{selectedJob.date} at {selectedJob.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedJob.status)}`}>
                    {selectedJob.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
