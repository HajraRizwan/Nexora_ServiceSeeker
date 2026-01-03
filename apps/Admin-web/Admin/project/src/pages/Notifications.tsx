import React, { useState } from 'react';
import { Send, Users, UserCheck, Bell, Plus, History } from 'lucide-react';
import Modal from '../components/ui/Modal';
import SuccessModal from '../components/ui/SuccessModal';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [message, setMessage] = useState({ title: '', content: '', audience: 'all' });
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 'N001',
      title: 'Platform Maintenance Notice',
      content: 'Scheduled maintenance will occur tonight from 2-4 AM',
      audience: 'All Users',
      sentDate: '2024-12-20',
      sentTime: '6:00 PM',
      recipients: 4081,
      delivered: 4078,
      opened: 3245
    },
    {
      id: 'N002',
      title: 'New Service Categories',
      content: 'We have added Gardening and Pet Care services',
      audience: 'All Seekers',
      sentDate: '2024-12-19',
      sentTime: '2:00 PM',
      recipients: 2847,
      delivered: 2845,
      opened: 2134
    },
    {
      id: 'N003',
      title: 'Training Session Reminder',
      content: 'Mandatory safety training session tomorrow at 3 PM',
      audience: 'All Providers',
      sentDate: '2024-12-18',
      sentTime: '11:00 AM',
      recipients: 1234,
      delivered: 1230,
      opened: 987
    },
  ]);

  const allUsers = [
    { id: '1', name: 'Ali Hassan', email: 'ali@example.com', phone: '+92-300-1111111', type: 'seeker' },
    { id: '2', name: 'Ahmad Hassan', email: 'ahmad@example.com', phone: '+92-300-2222222', type: 'provider' },
    { id: '3', name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92-301-3333333', type: 'seeker' },
    { id: '4', name: 'Usman Ali', email: 'usman@example.com', phone: '+92-302-4444444', type: 'provider' },
    { id: '5', name: 'Zara Shah', email: 'zara@example.com', phone: '+92-303-5555555', type: 'seeker' },
    { id: '6', name: 'Shop A', email: 'shopa@example.com', phone: '+92-310-1111111', type: 'shop' },
    { id: '7', name: 'Shop B', email: 'shopb@example.com', phone: '+92-311-2222222', type: 'shop' },
  ];

  const handleSendNotification = () => {
    const newNotification = {
      id: `N${String(notificationHistory.length + 1).padStart(3, '0')}`,
      title: message.title,
      content: message.content,
      audience:
        message.audience === 'all' ? 'All Users' :
        message.audience === 'seekers' ? 'All Seekers' :
        message.audience === 'providers' ? 'All Providers' :
        message.audience === 'shops' ? 'All Shops' :
        'Selected Users',
      sentDate: new Date().toISOString().split('T')[0],
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipients:
        message.audience === 'all' ? 4081 :
        message.audience === 'seekers' ? 2847 :
        message.audience === 'providers' ? 1234 :
        message.audience === 'shops' ? 500 :
        selectedUsers.length,
      delivered:
        message.audience === 'all' ? 4078 :
        message.audience === 'seekers' ? 2845 :
        message.audience === 'providers' ? 1230 :
        message.audience === 'shops' ? 495 :
        selectedUsers.length,
      opened: 0
    };

    setNotificationHistory([newNotification, ...notificationHistory]);
    setSuccessMessage(`Notification sent successfully to ${newNotification.audience}!`);
    setShowSuccessModal(true);
    setMessage({ title: '', content: '', audience: 'all' });
    setSelectedUsers([]);
  };

  const getAudienceCount = (audience: string) => {
    switch (audience) {
      case 'all': return '4,081 users';
      case 'seekers': return '2,847 seekers';
      case 'providers': return '1,234 providers';
      case 'shops': return '500 shops';
      case 'specific': return `${selectedUsers.length} selected users`;
      default: return '0 users';
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.phone.includes(userSearch)
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#19034d' }}>Notifications</h1>
        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Bell className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Push Notifications Enabled</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'send'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'send' ? { backgroundColor: '#05f51d' } : {}}
          >
            <Send className="w-4 h-4" />
            <span>Send New</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'history' ? { backgroundColor: '#05f51d' } : {}}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {activeTab === 'send' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>Send New Notification</h2>

          <div className="space-y-4">
            {/* Audience Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Target Audience</label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <button
                  onClick={() => setMessage({ ...message, audience: 'all' })}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    message.audience === 'all'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">All Users</span>
                  </div>
                  <p className="text-xs text-gray-500">4,081 users</p>
                </button>

                <button
                  onClick={() => setMessage({ ...message, audience: 'seekers' })}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    message.audience === 'seekers'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">All Seekers</span>
                  </div>
                  <p className="text-xs text-gray-500">2,847 seekers</p>
                </button>

                <button
                  onClick={() => setMessage({ ...message, audience: 'providers' })}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    message.audience === 'providers'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">All Providers</span>
                  </div>
                  <p className="text-xs text-gray-500">1,234 providers</p>
                </button>

                <button
                  onClick={() => setMessage({ ...message, audience: 'shops' })}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    message.audience === 'shops'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">All Shops</span>
                  </div>
                  <p className="text-xs text-gray-500">500 shops</p>
                </button>

                <button
                  onClick={() => {
                    setMessage({ ...message, audience: 'specific' });
                    setShowUserSelector(true);
                  }}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    message.audience === 'specific'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Plus className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Specific Users</span>
                  </div>
                  <p className="text-xs text-gray-500">{selectedUsers.length} selected</p>
                </button>
              </div>
            </div>

            {/* Message Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notification Title</label>
                <input
                  type="text"
                  value={message.title}
                  onChange={(e) => setMessage({ ...message, title: e.target.value })}
                  placeholder="Enter notification title..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message Content</label>
                <textarea
                  value={message.content}
                  onChange={(e) => setMessage({ ...message, content: e.target.value })}
                  placeholder="Enter your message content..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
                />
              </div>
            </div>

            {/* Preview & Send */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">
                    Ready to send to: <span className="text-sm font-medium">{getAudienceCount(message.audience)}</span>
                  </p>
                </div>
                <button
                  onClick={handleSendNotification}
                  disabled={!message.title || !message.content}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#05f51d' }}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {notificationHistory.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: '#19034d' }}>{notification.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{notification.content}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{notification.sentDate}</p>
                      <p className="text-xs text-gray-500">{notification.sentTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {notification.audience}
                    </span>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>📤 {notification.recipients}</span>
                      <span>✅ {notification.delivered}</span>
                      <span>👁️ {notification.opened}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-32 text-right">
                  <div className="text-xs text-gray-600">Open Rate</div>
                  <div className="text-lg font-bold" style={{ color: '#05f51d' }}>
                    {notification.delivered > 0 ? Math.round((notification.opened / notification.delivered) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Selector Modal */}
      <Modal isOpen={showUserSelector} onClose={() => setShowUserSelector(false)} title="Select Specific Users" size="lg">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.type === 'seeker' ? 'bg-blue-100 text-blue-800' :
                  user.type === 'provider' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.type}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">{selectedUsers.length} users selected</p>
            <div className="space-x-3">
              <button
                onClick={() => setShowUserSelector(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUserSelector(false)}
                className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: '#05f51d' }}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Notification Sent"
        message={successMessage}
      />
    </div>
  );
};

export default Notifications;
