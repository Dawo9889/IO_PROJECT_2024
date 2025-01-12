import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProfileContext } from '../context/ProfileContext';

const SettingsModifyProfile = () => {
  const { profileImage, updateProfileImage } = useProfileContext();

  const authData = JSON.parse(localStorage.getItem("auth"));
  const accessToken = authData?.accessToken;

  const [email, setEmail] = useState(authData?.user || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profileImage ? `data:image/png;base64,${profileImage}` : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!photoPreview && profileImage) {
      setPhotoPreview(`data:image/png;base64,${profileImage}`);
    }
  }, [profileImage]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePhoto) {
      setError("Please select a file before uploading.");
      return;
    }

    if (!accessToken) {
      setError("Authentication failed. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", profilePhoto);

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/identity/upload-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Aktualizacja zdjęcia profilowego w kontekście
      const binary = new Uint8Array(response.data);
      const binaryString = binary.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const base64Image = btoa(binaryString);
      updateProfileImage(base64Image);
      setLoading(false);
      setSuccess(true);
      console.log("Response:", response.data);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      setError("Failed to upload the profile picture. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="p-4 order-1 md:order-1 w-full max-w-md justify-items-end">
        <a
          className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium rounded-lg hover:bg-project-dark-bg sm:p-2 sm:mb-3 md:p-4 md:mb-4"
          href="/settings"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </a>
      </div>

      <div className="order-2 md:order-2 w-full max-w-md mx-auto bg-project-dark-bg rounded-lg shadow-lg p-6">
        <h1 className="text-2xl text-white font-bold text-center mb-4">Modify Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Change Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="block w-full px-4 py-2 bg-project-light-bg text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
            />
          </div>

          <div className="flex items-center mb-6">
            <img
              alt="User Avatar"
              src={photoPreview ? photoPreview : profileImage ? `data:image/png;base64,${profileImage}` : '/login-photo.png'}
              className="w-40 h-40 rounded-full border-2 border-project-blue"
            />
            <div className="ml-4">
              <label
                htmlFor="profilePhoto"
                className="cursor-pointer text-white text-sm font-semibold"
              >
                Change Photo
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-project-yellow text-dark font-semibold rounded-lg hover:bg-project-yellow-buttons focus:outline-none focus:ring-2 focus:ring-project-yellow-buttons"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModifyProfile;
