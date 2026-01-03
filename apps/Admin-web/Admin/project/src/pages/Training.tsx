import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Upload, X, Trash2 } from 'lucide-react';
import SuccessModal from '../components/ui/SuccessModal';
import ConfirmModal from '../components/ui/ConfirmModal';

const Training: React.FC = () => {
  const [trainingVideos, setTrainingVideos] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingVideo, setDeletingVideo] = useState<any>(null);
  const [newVideo, setNewVideo] = useState({ 
    title: '', description: '', category: '', duration: '', mandatory: false 
  });

  // ✅ Fetch all training videos from backend
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/training");
        setTrainingVideos(response.data);
      } catch (err) {
        console.error("Failed to load training videos:", err);
      }
    };
    fetchTrainings();
  }, []);

  // ✅ Upload new training video
  const handleUploadVideo = async () => {
    if (!newVideo.title || !newVideo.description) return alert("All fields required!");

    try {
      const response = await axios.post("http://localhost:5001/api/training", newVideo);
      setTrainingVideos([...trainingVideos, response.data.training]);
      setNewVideo({ title: '', description: '', category: '', duration: '', mandatory: false });
      setShowUploadModal(false);
      setSuccessMessage("Video uploaded successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to upload video:", err);
      alert("Failed to upload video. Try again.");
    }
  };

  // ✅ Delete video
  const confirmDeleteVideo = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/training/${deletingVideo._id}`);
      setTrainingVideos(trainingVideos.filter(v => v._id !== deletingVideo._id));
      setSuccessMessage("Video deleted successfully!");
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert("Failed to delete video. Try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: '#19034d' }}>Training Videos</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: '#05f51d' }}
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Video</span>
        </button>
      </div>

      {/* Training List */}
      <div className="space-y-4">
        {trainingVideos.map((video) => (
          <div key={video._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: '#19034d' }}>{video.title}</h3>
              <p className="text-gray-600">{video.description}</p>
              <p className="text-sm text-gray-500">{video.category} | {video.duration}</p>
            </div>
            <button 
              onClick={() => { setDeletingVideo(video); setShowDeleteModal(true); }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#19034d' }}>Upload New Training Video</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <input type="text" placeholder="Title" className="w-full border p-2 rounded mb-2"
              value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} />
            <textarea placeholder="Description" className="w-full border p-2 rounded mb-2"
              value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} />
            <input type="text" placeholder="Category" className="w-full border p-2 rounded mb-2"
              value={newVideo.category} onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })} />
            <input type="text" placeholder="Duration" className="w-full border p-2 rounded mb-2"
              value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} />

            <button onClick={handleUploadVideo} className="w-full text-white py-2 rounded" style={{ backgroundColor: '#05f51d' }}>
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Success + Delete Modals */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Success"
          message={successMessage}
        />
      )}

      {showDeleteModal && deletingVideo && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Video"
          message={`Are you sure you want to delete "${deletingVideo.title}"?`}
          onConfirm={confirmDeleteVideo}
        />
      )}
    </div>
  );
};

export default Training;
