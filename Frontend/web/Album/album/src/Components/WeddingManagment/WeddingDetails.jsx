import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import WeddingQRCode from "./WeddingQrCode";
import useAuth from '../hooks/useAuth';

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  
  const date = new Date(isoDate);
  const now = new Date();
  
  if (date.getTime() < now.getTime()) {
    return 'Wedding is expired';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} UTC`;
};

const openDatePicker = () => {
  document.getElementById("date").showPicker();
};

const WeddingDetails = ({ weddingId, onUpdate }) => {
  const {auth} = useAuth()
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const EditForm = ({ details, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...details });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center text-white space-y-3 col-span-1 md:col-span-2 lg:col-span-1">
        <h1 className='text-2xl w-full text-center'>Update wedding</h1>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-2 rounded-lg bg-project-dark text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium">Event Date</label>
          <div className="flex items-center w-full">
            <input
              id="date"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="flex-grow px-3 py-2 border border-2 rounded-l-lg bg-project-dark text-white"
            />
            <button
              type="button"
              className="px-3 py-2 bg-project-dark border-2 rounded-r-lg flex items-center justify-center"
              onClick={openDatePicker}
            >
              <CalendarIcon className="w-7 h-[26px] text-white bg-project-dark" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type='text'
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-2 rounded-lg bg-project-dark text-white"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 mx-2 text-sm font-medium bg-gray-600 hover:bg-gray-800 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 mx-2 text-sm font-medium bg-project-yellow hover:bg-project-yellow-buttons text-black rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const handleUpdate = (updatedDetails) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/wedding`,
        {
          "id": updatedDetails.id,
          "name": updatedDetails.name,
          "eventDate": updatedDetails.eventDate,
          "description": updatedDetails.description
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
      .then((response) => {
        setDetails(response.data);
        setIsEditing(false);
        toast.success('Wedding updated successfully!');
        fetchData();
        onUpdate();
      })
      .catch((err) => {
        toast.error('Error updating wedding.');
        console.error('Error updating wedding:', err);
      });
  };
  

  const fetchData = () => {
    if (!weddingId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/wedding/details/?id=${weddingId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        setDetails(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Wedding not found (404).');
        } else {
          setError('Error fetching wedding details.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if(weddingId !== null){
      fetchData();
    }
    else {
      setDetails(null)
    }
  }, [weddingId]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[200px] sm:min-h-[700px] md:min-h-[700px] lg:min-h-[700px] bg-project-dark-bg rounded-lg shadow-lg mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500 text-center col-span-2">{error}</p>
      ) : details ? (
        <>
          {isEditing ? (
            <EditForm
              details={details}
              onSave={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="text-white flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <div className="h-full flex flex-col justify-center">
                <h1 className="text-3xl font-semibold mb-4 text-center">
                  {details.name}
                </h1>
                <p className="mb-2 text-lg">
                  <strong>Date:</strong> {details.eventDate}
                </p>
                <p className="mb-4 text-lg">
                  <strong>Description:</strong> {details.description}
                </p>
                <p className="mb-4 text-lg">
                  <strong>Session key:</strong> {details.sessionKey}
                </p>
                <p className="mb-4 text-lg">
                  <strong>Session Key Expiration Date:</strong>{' '}
                  {formatDate(details.sessionKeyExpirationDate)}
                </p>
                <p className="mb-4 text-lg">
                  <strong>Images count:</strong> {details.imagesCount}
                </p>
                <button
                  className="px-6 py-2 text-sm font-medium bg-project-yellow text-black rounded-lg shadow hover:bg-yellow-400 focus:ring-2 focus:ring-offset-2 focus:ring-project-blue"
                  onClick={() => setIsEditing(true)}
                >
                  Update Wedding
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="justify-center text-white text-center col-span-2 text-xl w-full">
          Click a wedding to see details
          <div className='my-4 w-full'>
            <a
              className="w-full px-6 py-2 text-sm font-medium bg-project-yellow text-black rounded-lg shadow hover:bg-yellow-400 focus:ring-2 focus:ring-offset-2 focus:ring-project-blue"
              href='/createWedding'
            >
              Create Wedding
            </a>
          </div>
        </div>
      )}
      <div className="lg:col-span-1 md:col-span-2 h-full w-full flex flex-col justify-center">
        {weddingId && (
        <WeddingQRCode
          weddingId={weddingId}
          onTokenUpdated={fetchData}
        />
      )}
      </div>
    </div>
  );
}  

export default WeddingDetails;
