import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllAdminParcels, selectAdminStatus } from './adminSlice';
import Spinner from '../../components/common/Spinner';
import { FaFileUpload } from 'react-icons/fa';

// The component now receives all filter state and setters as props
const AdminDashboard = ({ 
  statusFilter, setStatusFilter, searchTerm, setSearchTerm,
  onEditStatus, onEditLocation, onUploadProof 
}) => {
  const parcels = useSelector(selectAllAdminParcels);
  const status = useSelector(selectAdminStatus);

  const statusOptions = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];

  // Handlers now just call the setter functions passed down from AdminPage
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* --- FILTER AND SEARCH UI --- */}
      <div className="p-4 bg-gray-50 border-b grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-1">
          <input
            type="text"
            placeholder="Search by Recipient Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="md:col-span-1">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Filter by Status (All)</option>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {/* --- NEW, SIMPLIFIED DISPLAY LOGIC --- */}
      {status === 'loading' && <div className="flex justify-center p-10"><Spinner /></div>}
      
      {status === 'failed' && (
        <p className="text-center text-error p-10">Failed to load parcel data.</p>
      )}

      {status === 'succeeded' && parcels.length === 0 && (
        <p className="text-center text-gray-500 p-10">
          No parcel orders match your current filters.
        </p>
      )}

      {status === 'succeeded' && parcels.length > 0 && (
        <div className="overflow-x-auto">
          {/* Table for Desktop */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{parcel.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.recipient_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{parcel.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          parcel.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {parcel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.present_location || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => onEditStatus(parcel)} className="text-primary hover:text-teal-700">Edit Status</button>
                        <button onClick={() => onEditLocation(parcel)} className="text-secondary hover:text-slate-700">Edit Location</button>
                        {parcel.status === 'Delivered' && !parcel.proof_of_delivery_image_url && (
                          <button onClick={() => onUploadProof(parcel)} className="text-green-600 hover:text-green-800 flex items-center">
                            <FaFileUpload className="mr-1"/> Upload Proof
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* List for Mobile */}
          <div className="md:hidden">
            <ul className="divide-y divide-gray-200">
              {parcels.map((parcel) => (
                <li key={parcel.id} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-secondary">Order #{parcel.id}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parcel.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        parcel.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {parcel.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600"><strong>To:</strong> {parcel.recipient_name}</p>
                  <p className="text-sm text-gray-600 truncate"><strong>Destination:</strong> {parcel.destination}</p>
                  <p className="text-sm text-gray-600"><strong>Location:</strong> {parcel.present_location || 'N/A'}</p>
                  <div className="mt-4 flex justify-end space-x-4">
                     <button onClick={() => onEditStatus(parcel)} className="text-primary hover:text-teal-700 text-sm font-medium">Edit Status</button>
                     <button onClick={() => onEditLocation(parcel)} className="text-secondary hover:text-slate-700 text-sm font-medium">Edit Location</button>
                     {parcel.status === 'Delivered' && !parcel.proof_of_delivery_image_url && (
                        <button onClick={() => onUploadProof(parcel)} className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                          <FaFileUpload className="mr-1"/> Upload Proof
                        </button>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;