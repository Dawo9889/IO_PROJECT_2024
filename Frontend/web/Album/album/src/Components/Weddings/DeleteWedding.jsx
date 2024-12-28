import { useState, useEffect } from 'react';

const DeleteWedding = ({ weddingId, weddingName, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleConfirm = () => {
    if (inputValue === weddingName) {
      onConfirm(weddingId);
    } else {
      setError('Entered name does not match. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-project-dark p-6 rounded-lg shadow-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg text-white font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-2 text-white">
          To delete the wedding <strong>{weddingName}</strong>, please type its name below:
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-project-yellow rounded px-3 py-2 w-full mb-4 bg-project-dark-bg text-white"
        />
        {error && <p className="text-project-pink text-sm mb-4">{error}</p>}
        <div className="flex justify-center gap-4">
          <button
            className="bg-project-blue px-4 py-2 rounded-lg hover:bg-project-blue-buttons"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-project-pink text-white px-4 py-2 rounded-lg hover:bg-project-pink-buttons"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWedding;
