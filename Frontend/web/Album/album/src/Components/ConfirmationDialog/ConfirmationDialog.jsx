import React from 'react';

const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-project-dark-bg p-6 rounded-lg shadow-lg">
        <p className="text-lg mb-4 text-white">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-project-pink text-white px-4 py-2 rounded hover:bg-project-pink-buttons"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
