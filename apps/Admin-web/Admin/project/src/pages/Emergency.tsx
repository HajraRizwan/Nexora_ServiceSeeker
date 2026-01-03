import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Edit, Plus, X } from 'lucide-react';

const Emergency: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [helplineNumbers, setHelplineNumbers] = useState<any[]>([]);
  const [currentHelpline, setCurrentHelpline] = useState<any>(null);
  const [formData, setFormData] = useState({ service: '', number: '', city: '', backup: '' });

  // ✅ Fetch helplines from backend
  useEffect(() => {
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/helplines");
      setHelplineNumbers(response.data);
    } catch (error) {
      console.error("Failed to fetch helplines:", error);
    }
  };

  // ✅ Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // ✅ Add new helpline
  const handleAddHelpline = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/helplines", formData);
      setHelplineNumbers([...helplineNumbers, response.data.helpline]);
      setFormData({ service: '', number: '', city: '', backup: '' });
      setShowModal(false);
      alert("Helpline added successfully!");
    } catch (error) {
      console.error("Failed to add helpline:", error);
      alert("Failed to add helpline. Please try again.");
    }
  };

  // ✅ Edit button click (opens modal pre-filled)
  const handleEditClick = (helpline: any) => {
    setCurrentHelpline(helpline);
    setFormData({
      service: helpline.service,
      number: helpline.number,
      city: helpline.city,
      backup: helpline.backup,
    });
    setShowModal(true);
  };

  // ✅ Update existing helpline
  const handleUpdateHelpline = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/helplines/${currentHelpline._id}`,
        formData
      );

      // update frontend list
      setHelplineNumbers(
        helplineNumbers.map((h) =>
          h._id === currentHelpline._id ? response.data.helpline : h
        )
      );

      setCurrentHelpline(null);
      setFormData({ service: '', number: '', city: '', backup: '' });
      setShowModal(false);
      alert("Helpline updated successfully!");
    } catch (error) {
      console.error("Failed to update helpline:", error);
      alert("Failed to update helpline. Please try again.");
    }
  };

  // ✅ Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentHelpline(null);
    setFormData({ service: '', number: '', city: '', backup: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>
          Emergency Helplines
        </h1>
        <button
          onClick={() => {
            setCurrentHelpline(null);
            setFormData({ service: '', number: '', city: '', backup: '' });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#05f51d' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Number</span>
        </button>
      </div>

      {/* ✅ Helpline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helplineNumbers.map((helpline, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>
                  {helpline.service}
                </h3>
                <p className="text-sm text-gray-600">{helpline.city}</p>
              </div>
              <button
                onClick={() => handleEditClick(helpline)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Primary Number</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <p className="text-xl font-bold" style={{ color: '#19034d' }}>
                    {helpline.number}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Backup Number</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-gray-900">{helpline.backup}</p>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold" style={{ color: '#19034d' }}>
                {currentHelpline ? "Edit Helpline" : "Add New Helpline"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {['service', 'number', 'city', 'backup'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={(formData as any)[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                {currentHelpline ? (
                  <button
                    onClick={handleUpdateHelpline}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#19034d' }}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={handleAddHelpline}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                    style={{ backgroundColor: '#05f51d' }}
                  >
                    Add Helpline
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

export default Emergency;
