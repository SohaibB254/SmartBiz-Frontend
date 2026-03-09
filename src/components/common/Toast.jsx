import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ success, message, onClose }) => {
  // Auto-dismiss the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Determine styling and icons based on the 'success' prop
  const bgColor = success ? 'bg-green-50' : 'bg-red-50';
  const borderColor = success ? 'border-green-400' : 'border-red-400';
  const textColor = success ? 'text-green-800' : 'text-red-800';
  const Icon = success ? CheckCircle : AlertCircle;
  const iconColor = success ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed top-5 right-5 z-1000 animate-fade-in-down">
      <div
        className={`flex items-center w-full max-w-sm p-4 space-x-3 rounded-lg border shadow-md ${bgColor} ${borderColor} ${textColor}`}
        role="alert"
      >
        {/* Status Icon */}
        <div className="shrink-0">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Message */}
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex h-8 w-8 hover:bg-black/5 ${textColor}`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;