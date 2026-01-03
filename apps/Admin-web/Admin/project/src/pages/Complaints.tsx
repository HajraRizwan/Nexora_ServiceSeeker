import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, X } from 'lucide-react';

const Complaints: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'investigate' | 'resolve'>('view');

  const [complaints, setComplaints] = useState([
    {
      id: 'C001',
      complainant: 'Ali Hassan',
      complainantRole: 'Seeker',
      against: 'Ahmad Hassan',
      againstRole: 'Provider',
      jobId: 'J001',
      reason: 'Late Arrival',
      description: 'Provider arrived 2 hours late without prior notice',
      status: 'open',
      priority: 'medium',
      submittedDate: '2024-12-20',
      category: 'Service Quality'
    },
    {
      id: 'C002',
      complainant: 'Fatima Khan',
      complainantRole: 'Provider',
      against: 'Zara Shah',
      againstRole: 'Seeker',
      jobId: 'J002',
      reason: 'Payment Dispute',
      description: 'Seeker refusing to pay agreed amount after job completion',
      status: 'in_progress',
      priority: 'high',
      submittedDate: '2024-12-19',
      category: 'Payment'
    },
    {
      id: 'C003',
      complainant: 'Usman Ali',
      complainantRole: 'Seeker',
      against: 'Sarah Ahmed',
      againstRole: 'Provider',
      jobId: 'J003',
      reason: 'Poor Service',
      description: 'Work was not completed as promised, many issues left unresolved',
      status: 'resolved',
      priority: 'low',
      submittedDate: '2024-12-18',
      category: 'Service Quality'
    },
  ]);

  const handleViewDetails = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalType('view');
    setShowModal(true);
  };

  const handleStartInvestigation = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalType('investigate');
    setShowModal(true);
  };

  const handleMarkResolved = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalType('resolve');
    setShowModal(true);
  };

  const confirmAction = () => {
    if (modalType === 'investigate') {
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: 'in_progress' } : c
      ));
      alert('Investigation started!');
    } else if (modalType === 'resolve') {
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id ? { ...c, status: 'resolved' } : c
      ));
      alert('Complaint marked as resolved!');
    }
    setShowModal(false);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'open':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Complaints & Disputes</h1>
        <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-sm font-medium text-red-800">{complaints.filter(c => c.status === 'open').length} Open Cases</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Complaints</p>
          <p className="text-2xl font-bold" style={{ color: '#19034d' }}>{complaints.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Open</p>
          <p className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'open').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{complaints.filter(c => c.status === 'in_progress').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p>
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
                placeholder="Search complaints..."
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
              <option value="all">All Complaints</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>Complaint {complaint.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)} flex items-center space-x-1`}>
                        {getStatusIcon(complaint.status)}
                        <span>{complaint.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(complaint.priority)}`}>
                        {complaint.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{complaint.reason} • {complaint.category}</p>
                    <p className="text-sm text-gray-500">Job ID: {complaint.jobId} • Submitted: {new Date(complaint.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">{complaint.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: '#19034d' }}>
                      {complaint.complainant.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Complainant</p>
                      <p className="text-sm text-gray-600">{complaint.complainant} ({complaint.complainantRole})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gray-500">
                      {complaint.against.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Against</p>
                      <p className="text-sm text-gray-600">{complaint.against} ({complaint.againstRole})</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:w-64 space-y-3">
                <button 
                  onClick={() => handleViewDetails(complaint)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Details</span>
                </button>

                {complaint.status === 'open' && (
                  <button 
                    onClick={() => handleStartInvestigation(complaint)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" 
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Start Investigation</span>
                  </button>
                )}

                {complaint.status === 'in_progress' && (
                  <button 
                    onClick={() => handleMarkResolved(complaint)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                )}

                <textarea
                  placeholder="Add resolution notes..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>
                  {modalType === 'view' ? 'Complaint Details' :
                   modalType === 'investigate' ? 'Start Investigation' :
                   'Mark as Resolved'} - {selectedComplaint.id}
                </h3>
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
                  <p className="text-sm text-gray-600">Complaint ID</p>
                  <p className="font-medium">{selectedComplaint.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Job ID</p>
                  <p className="font-medium">{selectedComplaint.jobId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complainant</p>
                  <p className="font-medium">{selectedComplaint.complainant} ({selectedComplaint.complainantRole})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Against</p>
                  <p className="font-medium">{selectedComplaint.against} ({selectedComplaint.againstRole})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Reason</p>
                <p className="font-medium">{selectedComplaint.reason}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedComplaint.description}</p>
                </div>
              </div>

              {modalType !== 'view' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === 'investigate' ? 'Investigation Notes' : 'Resolution Notes'}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                    placeholder={`Enter ${modalType === 'investigate' ? 'investigation' : 'resolution'} notes...`}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {modalType !== 'view' && (
                  <button 
                    onClick={confirmAction}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    {modalType === 'investigate' ? 'Start Investigation' : 'Mark Resolved'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;