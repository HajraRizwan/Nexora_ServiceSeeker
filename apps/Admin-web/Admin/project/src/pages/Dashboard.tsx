import React, { useState } from 'react';
import { Users, UserCheck, Clock, AlertTriangle, Eye, CheckCircle, XCircle, FileText,ShoppingBasket, Phone, Mail, MapPin, Calendar, DollarSign, Star, Award, Shield } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SuccessModal from '../components/ui/SuccessModal';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  skills: string[];
  rating: number;
  joinDate: string;
  documents: {
    cnicFront: string;
    cnicBack: string;
    certificate?: string;
    clearance?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

interface Job {
  id: string;
  category: string;
  subcategory: string;
  seekerName: string;
  providerName: string;
  location: string;
  date: string;
  time: string;
  VisitCharge: number;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
}

interface Complaint {
  id: string;
  complainantName: string;
  complainantType: 'seeker' | 'provider';
  jobId: string;
  category: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; message: string; onConfirm: () => void } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Mock data
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+92-300-1234567',
      cnic: '12345-6789012-3',
      skills: ['Plumbing', 'Electrical'],
      rating: 0,
      joinDate: '2024-01-15',
      documents: {
        cnicFront: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
        cnicBack: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
        certificate: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
        clearance: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg'
      },
      status: 'pending'
    },
    {
      id: '2',
      name: 'Sara Khan',
      email: 'sara.khan@email.com',
      phone: '+92-301-2345678',
      cnic: '23456-7890123-4',
      skills: ['Electrical'],
      rating: 0,
      joinDate: '2024-01-16',
      documents: {
        cnicFront: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
        cnicBack: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg',
        certificate: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg'
      },
      status: 'pending'
    }
  ]);

  const recentJobs: Job[] = [
    {
      id: 'J001',
      category: 'Home Services',
      subcategory: 'Plumbing',
      seekerName: 'Ali Ahmed',
      providerName: 'Hassan Plumber',
      location: 'DHA Phase 5, Karachi',
      date: '2024-01-20',
      time: '10:00 AM',
      VisitCharge: 2500,
      status: 'completed',
      description: 'Kitchen sink repair and pipe replacement'
    },
    {
      id: 'J002',
      category: 'Beauty Services',
      subcategory: 'Plumber',
      seekerName: 'Fatima Khan',
      providerName: 'Ayesha Salon',
      location: 'Gulshan-e-Iqbal, Karachi',
      date: '2024-01-20',
      time: '2:00 PM',
      VisitCharge: 3000,
      status: 'ongoing',
      description: 'Bridal Plumber and makeup'
    }
  ];

  const recentComplaints: Complaint[] = [
    {
      id: 'C001',
      complainantName: 'Ali Ahmed',
      complainantType: 'seeker',
      jobId: 'J001',
      category: 'Service Quality',
      reason: 'Poor Service Quality',
      description: 'The plumber arrived late and did not complete the work properly. Water is still leaking.',
      status: 'open',
      date: '2024-01-20',
      priority: 'high'
    },
    {
      id: 'C002',
      complainantName: 'Hassan Plumber',
      complainantType: 'provider',
      jobId: 'J002',
      category: 'Payment Issue',
      reason: 'Payment Dispute',
      description: 'Customer is refusing to pay the agreed amount after service completion.',
      status: 'investigating',
      date: '2024-01-19',
      priority: 'medium'
    }
  ];

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
  };

  const handleApproveProvider = (providerId: string) => {
    setConfirmAction({
      type: 'approve',
      message: 'Are you sure you want to approve this provider?',
      onConfirm: () => {
        setPendingProviders(prev => prev.filter(p => p.id !== providerId));
        setShowProviderModal(false);
        setShowConfirmModal(false);
        setSuccessMessage('Provider approved successfully!');
        setShowSuccessModal(true);
      }
    });
    setShowConfirmModal(true);
  };

  const handleRejectProvider = (providerId: string) => {
    setConfirmAction({
      type: 'reject',
      message: 'Are you sure you want to reject this provider?',
      onConfirm: () => {
        setPendingProviders(prev => prev.filter(p => p.id !== providerId));
        setShowProviderModal(false);
        setShowConfirmModal(false);
        setSuccessMessage('Provider rejected successfully!');
        setShowSuccessModal(true);
      }
    });
    setShowConfirmModal(true);
  };

  const handleStartInvestigation = (complaintId: string) => {
    setConfirmAction({
      type: 'investigate',
      message: 'Start investigation for this complaint?',
      onConfirm: () => {
        setShowComplaintModal(false);
        setShowConfirmModal(false);
        setSuccessMessage('Investigation started successfully!');
        setShowSuccessModal(true);
      }
    });
    setShowConfirmModal(true);
  };

  const handleResolveComplaint = (complaintId: string) => {
    setConfirmAction({
      type: 'resolve',
      message: 'Mark this complaint as resolved?',
      onConfirm: () => {
        setShowComplaintModal(false);
        setShowConfirmModal(false);
        setSuccessMessage('Complaint resolved successfully!');
        setShowSuccessModal(true);
      }
    });
    setShowConfirmModal(true);
  };

  const handleViewDocument = (url: string, title: string) => {
    setSelectedDocument({ url, title });
    setShowDocumentModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#19034d] mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 text-sm">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Seekers"
          value="1,234"
          icon={Users}
          trend="+12%"
         
        />
        <StatCard
          title="Total Providers"
          value="856"
          icon={UserCheck}
          trend="+8%"
          trendUp={true}
        />
         <StatCard
          title="Total Shops"
          value="134"
          icon={ShoppingBasket}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Pending Verifications"
          value={pendingProviders.length.toString()}
          icon={Clock}
          trend="+3"
          trendUp={false}
        />
        {/* <StatCard
          title="Recent Complaints"
          value="23"
          icon={AlertTriangle}
          trend="-5%"
          trendUp={true}
        /> */}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#19034d]">Recent Jobs</h2>
            <span className="text-xs text-gray-500">Last 24 hours</span>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">{job.subcategory}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Seeker: {job.seekerName}</div>
                  <div>Provider: {job.providerName}</div>
                  <div className="flex items-center justify-between">
                    <span>{job.location}</span>
                    <span className="font-medium">Rs. {job.VisitCharge.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#19034d]">Recent Complaints</h2>
            <span className="text-xs text-gray-500">Needs attention</span>
          </div>
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => handleComplaintClick(complaint)}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">{complaint.reason}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>From: {complaint.complainantName} ({complaint.complainantType})</div>
                  <div>Job ID: {complaint.jobId}</div>
                  <div className="truncate">{complaint.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#19034d]">Pending Verifications</h2>
            <span className="text-xs text-gray-500">Requires approval</span>
          </div>
          <div className="space-y-3">
            {pendingProviders.map((provider) => (
              <div
                key={provider.id}
                onClick={() => handleProviderClick(provider)}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-900">{provider.name}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Email: {provider.email}</div>
                  <div>Skills: {provider.skills.join(', ')}</div>
                  <div>Applied: {new Date(provider.joinDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title="Job Details"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Job ID</label>
                <p className="text-sm text-gray-900">{selectedJob.id}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Service</label>
              <p className="text-sm text-gray-900">{selectedJob.category} - {selectedJob.subcategory}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Seeker</label>
                <p className="text-sm text-gray-900">{selectedJob.seekerName}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                <p className="text-sm text-gray-900">{selectedJob.providerName}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
              <p className="text-sm text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {selectedJob.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date & Time</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {selectedJob.date} at {selectedJob.time}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">VisitCharge</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                  Rs. {selectedJob.VisitCharge.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <p className="text-sm text-gray-900">{selectedJob.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Provider Verification Modal */}
      <Modal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        title="Provider Verification"
        size="large"
      >
        {selectedProvider && (
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#19034d] mb-3">Provider Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900">{selectedProvider.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">CNIC</label>
                  <p className="text-sm text-gray-900">{selectedProvider.cnic}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                    {selectedProvider.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                    {selectedProvider.phone}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-[#05f51d] bg-opacity-10 text-[#05f51d] rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[#19034d] mb-3">Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">CNIC Front</span>
                    {selectedProvider.documents.cnicFront ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {selectedProvider.documents.cnicFront && (
                    <button
                      onClick={() => handleViewDocument(selectedProvider.documents.cnicFront, 'CNIC Front')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-xs transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Document
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">CNIC Back</span>
                    {selectedProvider.documents.cnicBack ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {selectedProvider.documents.cnicBack && (
                    <button
                      onClick={() => handleViewDocument(selectedProvider.documents.cnicBack, 'CNIC Back')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-xs transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Document
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Certificate</span>
                    {selectedProvider.documents.certificate ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {selectedProvider.documents.certificate ? (
                    <button
                      onClick={() => handleViewDocument(selectedProvider.documents.certificate!, 'Certificate')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-xs transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Document
                    </button>
                  ) : (
                    <div className="w-full bg-gray-50 text-gray-500 py-2 px-3 rounded text-xs text-center">
                      Not Provided
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Clearance</span>
                    {selectedProvider.documents.clearance ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  {selectedProvider.documents.clearance ? (
                    <button
                      onClick={() => handleViewDocument(selectedProvider.documents.clearance!, 'Clearance Certificate')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-xs transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Document
                    </button>
                  ) : (
                    <div className="w-full bg-gray-50 text-gray-500 py-2 px-3 rounded text-xs text-center">
                      Not Provided
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleRejectProvider(selectedProvider.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleApproveProvider(selectedProvider.id)}
                className="px-4 py-2 bg-[#05f51d] hover:bg-[#04d119] text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        title="Complaint Details"
        size="large"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Complaint ID</label>
                  <p className="text-sm text-gray-900">{selectedComplaint.id}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <p className="text-sm text-gray-900">{selectedComplaint.date}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Complainant</label>
              <p className="text-sm text-gray-900">{selectedComplaint.complainantName} ({selectedComplaint.complainantType})</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Related Job ID</label>
                <p className="text-sm text-gray-900">{selectedComplaint.jobId}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <p className="text-sm text-gray-900">{selectedComplaint.category}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
              <p className="text-sm text-gray-900">{selectedComplaint.reason}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedComplaint.description}</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {selectedComplaint.status === 'open' && (
                <button
                  onClick={() => handleStartInvestigation(selectedComplaint.id)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Investigation
                </button>
              )}
              {selectedComplaint.status !== 'resolved' && (
                <button
                  onClick={() => handleResolveComplaint(selectedComplaint.id)}
                  className="px-4 py-2 bg-[#05f51d] hover:bg-[#04d119] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Document Viewer Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title={selectedDocument?.title || 'Document'}
        size="large"
      >
        {selectedDocument && (
          <div className="text-center">
            <img
              src={selectedDocument.url}
              alt={selectedDocument.title}
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-600 mt-4">Click and drag to zoom, scroll to navigate</p>
          </div>
        )}
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction?.onConfirm || (() => {})}
        title="Confirm Action"
        message={confirmAction?.message || ''}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default Dashboard;