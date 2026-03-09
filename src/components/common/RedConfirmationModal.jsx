import React from 'react';

const RedConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  note,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-white/20 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm p-6 relative border border-gray-200">

        {/* Main Message Prop */}
        <p className="text-gray-800 text-sm mb-4 leading-relaxed font-medium">
          {message}
        </p>

        {/* Optional Note Prop */}
        {note && (
          <p className="text-gray-500 text-xs mb-6">
            <span className="font-bold text-black">Note:</span> <span className="italic">{note}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-6 py-2 rounded-full bg-[#e04524] hover:bg-[#c93a1c] text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RedConfirmationModal;