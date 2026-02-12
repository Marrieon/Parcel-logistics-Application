import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import apiClient from '../../api/apiClient'; // We use apiClient directly for this one-off action
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { HiX } from 'react-icons/hi';
import { fetchAllParcels } from './adminSlice'; // To refresh the list

const UploadProofModal = ({ isOpen, onClose, parcel }) => {
  const [proofImage, setProofImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofImage(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofImage) {
      setError('An image file is required');
      return;
    }
    
    setIsLoading(true);
    const submissionData = new FormData();
    submissionData.append('proof_image', proofImage);

    try {
      await apiClient.post(`/admin/parcels/${parcel.id}/proof`, submissionData);
      Swal.fire('Success!', 'Proof of delivery has been uploaded.', 'success');
      dispatch(fetchAllParcels()); // Refresh the admin dashboard list
      onClose();
    } catch (err) {
      Swal.fire('Error!', err.response?.data?.message || 'Upload failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><HiX size={24} /></button>
        <h2 className="text-xl font-bold text-center text-secondary mb-4">Upload Proof for Order #{parcel.id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Proof of Delivery Photo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange} 
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"
              />
              {error && <p className="text-error text-xs mt-1">{error}</p>}
            </div>
            <Button type="submit" isLoading={isLoading} fullWidth>Upload Proof</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadProofModal;