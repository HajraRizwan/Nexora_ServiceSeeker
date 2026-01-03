                   import React, { useState } from 'react';
import { Plus, Edit, Trash2, HelpCircle, ThumbsUp, Eye } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import SuccessModal from '../components/ui/SuccessModal';

const FAQs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Admin' | 'System'>('Admin'); // Tab state

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFAQ, setDeletingFAQ] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: '' });

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'How do I update my service rates?',
      answer: 'Go to Profile → Service Settings → Update your hourly rates for each service category.',
      category: 'Provider',
      helpful: 245,
      views: 1834,
      lastUpdated: '2024-12-15'
    },
    {
      id: 2,
      question: 'What payment methods are accepted?',
      answer: 'We accept cash payments, bank transfers, and digital wallet payments through the app.',
      category: 'Payment',
      helpful: 189,
      views: 1456,
      lastUpdated: '2024-12-10'
    },
    {
      id: 3,
      question: 'How do I cancel a booking?',
      answer: 'Go to My Bookings → Select the booking → Cancel Booking. Note: Cancellation fees may apply.',
      category: 'Seeker',
      helpful: 156,
      views: 987,
      lastUpdated: '2024-12-08'
    },
    {
      id: 4,
      question: 'How to verify my account?',
      answer: 'Upload your CNIC, certificates, and clearance documents in the verification section.',
      category: 'Provider',
      helpful: 298,
      views: 2156,
      lastUpdated: '2024-12-12'
    },
    {
      id: 5,
      question: 'How can I track my order?',
      answer: '',
      category: 'Shop',
      helpful: 0,
      views: 0,
      lastUpdated: '2024-12-18'
    },
  ]);

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer && newFAQ.category) {
      setFaqs([...faqs, {
        id: Date.now(),
        ...newFAQ,
        helpful: 0,
        views: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      }]);
      setNewFAQ({ question: '', answer: '', category: '' });
      setShowAddModal(false);
      setSuccessMessage('FAQ added successfully!');
      setShowSuccessModal(true);
    }
  };

  const handleEditFAQ = (faq: any) => setEditingFAQ({ ...faq });
  const handleSaveEdit = () => {
    setFaqs(faqs.map(faq =>
      faq.id === editingFAQ.id
        ? { ...editingFAQ, lastUpdated: new Date().toISOString().split('T')[0] }
        : faq
    ));
    setEditingFAQ(null);
    setSuccessMessage('FAQ updated successfully!');
    setShowSuccessModal(true);
  };
  const handleDeleteFAQ = (faq: any) => { setDeletingFAQ(faq); setShowDeleteModal(true); };
  const confirmDeleteFAQ = () => {
    setFaqs(faqs.filter(faq => faq.id !== deletingFAQ.id));
    setSuccessMessage('FAQ deleted successfully!');
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    setDeletingFAQ(null);
  };

  // Filter system FAQs (submitted by Seeker/Provider/Shop) for the second tab
  const systemFaqs = faqs.filter(faq => faq.category === 'Seeker' || faq.category === 'Shop' || faq.category === 'Provider');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#19034d' }}>FAQ Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('Admin')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Admin' ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
          >
            Admin FAQs
          </button>
          <button
            onClick={() => setActiveTab('System')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'System' ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
          >
            System Answers
          </button>
        </div>
      </div>

      {/* ===== Admin Tab ===== */}
      {activeTab === 'Admin' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">Total FAQs</p>
              <p className="text-2xl font-bold" style={{ color: '#19034d' }}>{faqs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">
                {faqs.reduce((acc, faq) => acc + faq.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">Helpful Votes</p>
              <p className="text-2xl font-bold text-green-600">
                {faqs.reduce((acc, faq) => acc + faq.helpful, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">Avg Helpful Rate</p>
              <p className="text-2xl font-bold" style={{ color: '#19034d' }}>
                {Math.round(faqs.reduce((acc, faq) => acc + (faq.helpful / faq.views), 0) / faqs.length * 100)}%
              </p>
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                {editingFAQ?.id === faq.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={editingFAQ.question}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        value={editingFAQ.answer}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editingFAQ.category}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                      >
                        <option value="">Select category</option>
                        <option value="Provider">Provider</option>
                        <option value="Seeker">Seeker</option>
                        <option value="Payment">Payment</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                   <div className="flex space-x-3">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
                        style={{ backgroundColor: '#05f51d' }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingFAQ(null)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5" style={{ color: '#19034d' }} />
                          <h3 className="text-sm font-semibold" style={{ color: '#19034d' }}>{faq.question}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 ml-8">{faq.answer}</p>
                      <div className="flex items-center space-x-6 text-xs text-gray-500 ml-8">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{faq.views.toLocaleString()} views</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{faq.helpful} helpful</span>
                        </span>
                        <span>{faq.views ? Math.round((faq.helpful / faq.views) * 100) : 0}% helpful rate</span>
                        <span>Updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="lg:w-32 space-y-2">
                      <button
                        onClick={() => handleEditFAQ(faq)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== System Answers Tab ===== */}
      {activeTab === 'System' && (
        <div className="space-y-4">
          {/* {systemFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5" style={{ color: '#19034d' }} />
                      <h3 className="text-sm font-semibold" style={{ color: '#19034d' }}>{faq.question}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {faq.category} Query
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = systemFaqs.map(f =>
                        f.id === faq.id ? { ...f, answer: e.target.value } : f
                      );
                      setFaqs(faqs.map(f => updated.find(u => u.id === f.id) || f));
                    }}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 mb-2"
                    placeholder="Write system answer here..."
                  />
                  <button
                    onClick={() => {
                      setSuccessMessage('System answer submitted successfully!');
                      setShowSuccessModal(true);
                    }}
                    className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          ))} */}
          {systemFaqs.map((faq) => (
  <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5" style={{ color: '#19034d' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#19034d' }}>{faq.question}</h3>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {faq.category} Query
            </span>
          </div>
        </div>
        <textarea
          value={faq.answer}
          onChange={(e) => {
            const updated = systemFaqs.map(f =>
              f.id === faq.id ? { ...f, answer: e.target.value } : f
            );
            setFaqs(faqs.map(f => updated.find(u => u.id === f.id) || f));
          }}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 mb-2"
          placeholder="Write system answer here..."
        />
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSuccessMessage('System answer submitted successfully!');
              setShowSuccessModal(true);
            }}
            className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: '#05f51d' }}
          >
            Submit Answer
          </button>
          <button
            onClick={() => handleDeleteFAQ(faq)}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
))}

          {systemFaqs.length === 0 && <p className="text-gray-500">No system FAQs available.</p>}
        </div>
      )}

      {/* Add FAQ Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New FAQ" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
            <input
              type="text"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Enter the question"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
            <textarea
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Enter the answer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newFAQ.category}
              onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
            >
              <option value="">Select category</option>
              <option value="Provider">Provider</option>
              <option value="Seeker">Seeker</option>
              <option value="Payment">Payment</option>
              <option value="Shop">Shop</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFAQ}
              className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: '#05f51d' }}
            >
              Add FAQ
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteFAQ}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ: "${deletingFAQ?.question}"?`}
        type="danger"
        confirmText="Delete"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message={successMessage}
      />
    </div>
  );
};

export default FAQs;
