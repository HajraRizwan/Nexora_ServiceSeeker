import React from 'react';
import Modal from './Modal';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-sm text-gray-600">{message}</p>
        <button 
          onClick={onClose}
          className="px-6 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#05f51d' }}
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal;