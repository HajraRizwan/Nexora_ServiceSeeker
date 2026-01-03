import React, { useState } from 'react';
import { Search, Filter, Eye, Shield, ShieldX, Download, X } from 'lucide-react';

const Providers: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; data: any } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [providers, setProviders] = useState([
    { id: 1, name: 'Ahmad Hassan', email: 'ahmad@example.com', phone: '+92-300-1234567', service: 'Electrician', serviceType: 'Wiring', status: 'approved', rating: 4.8, jobs: 45 },
    { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92-301-2345678', service: 'Electrician', serviceType: 'Switch Repair', status: 'pending', rating: 0, jobs: 0 },
    { id: 3, name: 'Usman Ali', email: 'usman@example.com', phone: '+92-302-3456789', service: 'Plumbing', serviceType: 'Pipe Fixing', status: 'approved', rating: 4.5, jobs: 32 },
    { id: 4, name: 'Aisha Malik', email: 'aisha@example.com', phone: '+92-303-4567890', service: 'Plumbing', serviceType: 'Drain Cleaning', status: 'blocked', rating: 3.2, jobs: 12 },
  ]);

  const handleViewProvider = (provider: any) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleBlockProvider = (provider: any) => {
    setConfirmAction({ 
      type: provider.status === 'blocked' ? 'unblock' : 'block', 
      data: provider 
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      setProviders(providers.map(p => 
        p.id === confirmAction.data.id 
          ? { ...p, status: p.status === 'blocked' ? 'approved' : 'blocked' }
          : p
      ));
      setSuccessMessage(`Provider ${confirmAction.data.name} has been ${confirmAction.type}ed successfully!`);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setConfirmAction(null);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesFilter = filter === 'all' || provider.status === filter;
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Providers</p>
          <p className="text-2xl font-bold" style={{ color: '#19034d' }}>{providers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{providers.filter(p => p.status === 'approved').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{providers.filter(p => p.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Blocked</p>
          <p className="text-2xl font-bold text-red-600">{providers.filter(p => p.status === 'blocked').length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Service Providers</h1>
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
                placeholder="Search providers..."
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
              <option value="all">All Providers</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#19034d' }}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jobs</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                      <div className="text-sm text-gray-500">{provider.email}</div>
                      <div className="text-sm text-gray-500">{provider.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {provider.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.rating > 0 ? `⭐ ${provider.rating}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.jobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProvider(provider)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {provider.status === 'approved' ? (
                        <button 
                          onClick={() => handleBlockProvider(provider)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <ShieldX className="w-4 h-4" />
                        </button>
                      ) : provider.status === 'blocked' ? (
                        <button 
                          onClick={() => handleBlockProvider(provider)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Details Modal */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>Provider Details - {selectedProvider.name}</h3>
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
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedProvider.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedProvider.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedProvider.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-medium">{selectedProvider.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium">{selectedProvider.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-medium">{selectedProvider.rating > 0 ? `⭐ ${selectedProvider.rating}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="font-medium">{selectedProvider.jobs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProvider.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedProvider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedProvider.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>
              {confirmAction.type === 'block' ? 'Block Provider' : 'Unblock Provider'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {confirmAction.type} {confirmAction.data.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${
                  confirmAction.type === 'block' ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {confirmAction.type === 'block' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Success</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;


// import React, { useState } from 'react';
// import { Search, Filter, Eye, Shield, ShieldX, Download, X } from 'lucide-react';

// const Providers: React.FC = () => {
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState<any>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState<{ type: string; data: any } | null>(null);
//   const [successMessage, setSuccessMessage] = useState('');

//   const [providers, setProviders] = useState([
//     { id: 1, name: 'Ahmad Hassan', email: 'ahmad@example.com', phone: '+92-300-1234567', service: 'Electrician', status: 'approved', rating: 4.8, jobs: 45, earnings: '₨125,000' },
//     { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92-301-2345678', service: 'Electrician', status: 'pending', rating: 0, jobs: 0, earnings: '₨0' },
//     { id: 3, name: 'Usman Ali', email: 'usman@example.com', phone: '+92-302-3456789', service: 'Plumbing', status: 'approved', rating: 4.5, jobs: 32, earnings: '₨98,000' },
//     { id: 4, name: 'Aisha Malik', email: 'aisha@example.com', phone: '+92-303-4567890', service: 'Plumbing', status: 'blocked', rating: 3.2, jobs: 12, earnings: '₨25,000' },
//   ]);

//   const handleViewProvider = (provider: any) => {
//     setSelectedProvider(provider);
//     setShowModal(true);
//   };

//   const handleBlockProvider = (provider: any) => {
//     setConfirmAction({ 
//       type: provider.status === 'blocked' ? 'unblock' : 'block', 
//       data: provider 
//     });
//     setShowConfirmModal(true);
//   };

//   const handleConfirmAction = () => {
//     if (confirmAction) {
//       setProviders(providers.map(p => 
//         p.id === confirmAction.data.id 
//           ? { ...p, status: p.status === 'blocked' ? 'approved' : 'blocked' }
//           : p
//       ));
//       setSuccessMessage(`Provider ${confirmAction.data.name} has been ${confirmAction.type}ed successfully!`);
//       setShowConfirmModal(false);
//       setShowSuccessModal(true);
//       setConfirmAction(null);
//     }
//   };

//   const filteredProviders = providers.filter(provider => {
//     const matchesFilter = filter === 'all' || provider.status === filter;
//     const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          provider.service.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'blocked':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Stats moved to top */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-600">Total Providers</p>
//           <p className="text-2xl font-bold" style={{ color: '#19034d' }}>{providers.length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-600">Approved</p>
//           <p className="text-2xl font-bold text-green-600">{providers.filter(p => p.status === 'approved').length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-600">Pending</p>
//           <p className="text-2xl font-bold text-yellow-600">{providers.filter(p => p.status === 'pending').length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <p className="text-sm text-gray-600">Blocked</p>
//           <p className="text-2xl font-bold text-red-600">{providers.filter(p => p.status === 'blocked').length}</p>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Service Providers</h1>
//         <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//           <Download className="w-4 h-4" />
//           <span>Export Data</span>
//         </button>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search providers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-transparent"
//               />
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3">
//             <Filter className="w-4 h-4 text-gray-400" />
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:border-transparent"
//             >
//               <option value="all">All Providers</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="blocked">Blocked</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Providers Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead style={{ backgroundColor: '#19034d' }}>
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Provider</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jobs</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Earnings</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProviders.map((provider) => (
//                 <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{provider.name}</div>
//                       <div className="text-sm text-gray-500">{provider.email}</div>
//                       <div className="text-sm text-gray-500">{provider.phone}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                       {provider.service}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(provider.status)}`}>
//                       {provider.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {provider.rating > 0 ? `⭐ ${provider.rating}` : 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {provider.jobs}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {provider.earnings}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button 
//                         onClick={() => handleViewProvider(provider)}
//                         className="text-blue-600 hover:text-blue-800 transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       {provider.status === 'approved' ? (
//                         <button 
//                           onClick={() => handleBlockProvider(provider)}
//                           className="text-red-600 hover:text-red-800 transition-colors"
//                         >
//                           <ShieldX className="w-4 h-4" />
//                         </button>
//                       ) : provider.status === 'blocked' ? (
//                         <button 
//                           onClick={() => handleBlockProvider(provider)}
//                           className="text-green-600 hover:text-green-800 transition-colors"
//                         >
//                           <Shield className="w-4 h-4" />
//                         </button>
//                       ) : null}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Provider Details Modal */}
//       {showModal && selectedProvider && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>Provider Details - {selectedProvider.name}</h3>
//                 <button 
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Name</p>
//                   <p className="font-medium">{selectedProvider.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Email</p>
//                   <p className="font-medium">{selectedProvider.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Phone</p>
//                   <p className="font-medium">{selectedProvider.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Service</p>
//                   <p className="font-medium">{selectedProvider.service}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Rating</p>
//                   <p className="font-medium">⭐ {selectedProvider.rating}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Jobs</p>
//                   <p className="font-medium">{selectedProvider.jobs}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Earnings</p>
//                   <p className="font-medium">{selectedProvider.earnings}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Status</p>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     selectedProvider.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     selectedProvider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {selectedProvider.status}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Modal */}
//       {showConfirmModal && confirmAction && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//             <h3 className="text-lg font-semibold mb-4" style={{ color: '#19034d' }}>
//               {confirmAction.type === 'block' ? 'Block Provider' : 'Unblock Provider'}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to {confirmAction.type} {confirmAction.data.name}?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button 
//                 onClick={() => setShowConfirmModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 text-white rounded-lg hover:opacity-90 ${
//                   confirmAction.type === 'block' ? 'bg-red-500' : 'bg-green-500'
//                 }`}
//               >
//                 {confirmAction.type === 'block' ? 'Block' : 'Unblock'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
//             <h3 className="text-lg font-semibold mb-4 text-green-600">Success</h3>
//             <p className="text-gray-600 mb-6">{successMessage}</p>
//             <button 
//               onClick={() => setShowSuccessModal(false)}
//               className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Providers;