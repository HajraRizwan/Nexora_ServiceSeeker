import React, { useState, useEffect } from 'react';
import { FileText, Edit, X } from 'lucide-react';
import axios from 'axios';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('legal');
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState({
    terms: 'Current version contains platform usage rules, service provider guidelines, payment terms, and user responsibilities...',
    privacy: 'Details data collection practices, user privacy rights, information sharing policies, and GDPR compliance...',
    updatedAtTerms: '',
    updatedAtPrivacy: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch documents from backend on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/documents');
        setDocumentContent(prev => ({
          ...prev,
          terms: res.data.terms || prev.terms,
          privacy: res.data.privacy || prev.privacy,
          updatedAtTerms: res.data.updatedAtTerms || prev.updatedAtTerms,
          updatedAtPrivacy: res.data.updatedAtPrivacy || prev.updatedAtPrivacy
        }));
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocuments();
  }, []);

  // Inside handleSaveDocument
const handleSaveDocument = async (type: "terms" | "privacy") => {
  try {
    const res = await axios.put(`http://localhost:5001/api/settings/${type}`, {
      content: documentContent[type],
    });

    alert(res.data.message);
    setEditingDocument(null);
  } catch (err: any) {
    console.error(err);
    alert("Failed to update document");
  }
};

// Fetch existing documents when component loads
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/settings");
      const data: any = {};
      res.data.forEach((doc: any) => {
        data[doc.type] = doc.content;
      });
      setDocumentContent(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    }
  };

  fetchDocuments();
}, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>System Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'legal' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'legal' ? { backgroundColor: '#05f51d' } : {}}
          >
            <FileText className="w-4 h-4" />
            <span>Legal</span>
          </button>
        </div>
      </div>

      {/* Legal Documents */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold" style={{ color: '#19034d' }}>Legal Documents</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Terms of Service */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>Terms of Service</h3>
                <button 
                  onClick={() => setEditingDocument('terms')}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Last updated: {documentContent.updatedAtTerms || 'December 15, 2024'}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{documentContent.terms}</p>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>Privacy Policy</h3>
                <button 
                  onClick={() => setEditingDocument('privacy')}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Last updated: {documentContent.updatedAtPrivacy || 'December 10, 2024'}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{documentContent.privacy}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {editingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Edit {editingDocument === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button onClick={() => setEditingDocument(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={documentContent[editingDocument]}
                onChange={(e) => setDocumentContent({ ...documentContent, [editingDocument]: e.target.value })}
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              />
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button onClick={() => setEditingDocument(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveDocument(editingDocument as 'terms' | 'privacy')}
                  disabled={loading}
                  className="px-4 py-2 text-white rounded-lg"
                  style={{ backgroundColor: '#05f51d' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
