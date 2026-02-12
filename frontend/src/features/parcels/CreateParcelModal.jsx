import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createNewParcel, selectCreateStatus, resetCreateStatus } from './parcelsSlice';
import apiClient from '../../api/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm'; // You will need to create this component
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { HiX } from 'react-icons/hi';
import { FaCalculator } from 'react-icons/fa';

// --- Stripe Setup ---
// Load Stripe with your publishable key outside of the component to avoid re-creating it on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const initialFormState = {
  recipient_name: '', pickup_location: '', destination: '', weight: '',
  sender_phone: '', recipient_phone: '', estimated_cost: '', // Insured Value
};

const CreateParcelModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [parcelImage, setParcelImage] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const createStatus = useSelector(selectCreateStatus);

  // State for the multi-step flow
  const [quote, setQuote] = useState(null);
  const [quoteStatus, setQuoteStatus] = useState('idle');
  const [clientSecret, setClientSecret] = useState(''); // This controls which step is shown

  // This useEffect handles the final step: creating the parcel after a successful payment.
  useEffect(() => {
    if (createStatus === 'succeeded') {
      Swal.fire('Success!', 'Your parcel order has been created and paid for.', 'success');
      dispatch(resetCreateStatus());
      // Reset everything and close the modal
      setFormData(initialFormState);
      setParcelImage(null);
      setQuote(null);
      setClientSecret('');
      onClose();
    } else if (createStatus === 'failed') {
      Swal.fire('Order Creation Failed', 'Your payment was successful, but we failed to create your order. Please contact support.', 'error');
      dispatch(resetCreateStatus());
    }
  }, [createStatus, dispatch, onClose]);
  
  if (!isOpen) return null;

  const handleChange = (e) => {
    setQuote(null); // Reset quote if details change
    setClientSecret(''); // Go back to step 1 if details change
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setParcelImage(e.target.files[0]);
    }
  };

  const handleGetQuote = async () => {
    // Basic validation for quote
    const quoteErrors = {};
    if (!formData.pickup_location) quoteErrors.pickup_location = 'Required for quote';
    if (!formData.destination) quoteErrors.destination = 'Required for quote';
    if (!formData.weight || +formData.weight <= 0) quoteErrors.weight = 'Valid weight required for quote';
    setErrors(quoteErrors);
    if (Object.keys(quoteErrors).length > 0) return;

    setQuoteStatus('loading');
    try {
      const response = await apiClient.post('/api/quote', {
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        weight: formData.weight,
      });
      setQuote(response.data);
      setQuoteStatus('succeeded');
    } catch (error) {
      setQuoteStatus('failed');
      Swal.fire('Quote Error', error.response?.data?.message || 'Could not calculate a quote.', 'error');
    }
  };

  const handleProceedToPayment = async () => {
    // Full validation before proceeding to payment
    const allErrors = {};
    if (!formData.recipient_name) allErrors.recipient_name = 'Recipient name is required';
    if (!formData.sender_phone) allErrors.sender_phone = 'Sender phone is required';
    if (!parcelImage) allErrors.image = 'A parcel image is required';
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    try {
      const response = await apiClient.post('/api/create-payment-intent', { cost: quote.calculated_cost });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      Swal.fire('Payment Error', 'Could not initialize payment. Please try again.', 'error');
    }
  };

  const handleSuccessfulPayment = () => {
    // This is called by the PaymentForm child component on success.
    // Now, we dispatch the action to create the parcel in our own database.
    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append('parcel_image', parcelImage);
    submissionData.append('shipping_cost', quote.calculated_cost);
    
    dispatch(createNewParcel(submissionData));
  };
  
  const handleClose = () => {
      setFormData(initialFormState);
      setParcelImage(null);
      setQuote(null);
      setClientSecret('');
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><HiX size={24} /></button>
        <h2 className="text-2xl font-bold text-center text-secondary mb-6">Create New Parcel Order</h2>
        
        {/* STEP 2: PAYMENT FORM */}
        {clientSecret ? (
          <div>
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">Complete Your Payment</h3>
            <p className="text-center text-primary font-bold text-2xl mb-4">${quote.calculated_cost.toFixed(2)}</p>
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <PaymentForm clientSecret={clientSecret} onSuccess={handleSuccessfulPayment} />
            </Elements>
          </div>
        ) : (
        /* STEP 1: DETAILS & QUOTE FORM */
          <form noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="recipient_name" placeholder="Recipient Name" value={formData.recipient_name} onChange={handleChange} error={errors.recipient_name} />
              <Input name="recipient_phone" type="tel" placeholder="Recipient's Phone" value={formData.recipient_phone} onChange={handleChange} />
              <Input name="sender_phone" type="tel" placeholder="Your Phone Number" value={formData.sender_phone} onChange={handleChange} error={errors.sender_phone} />
              <Input name="estimated_cost" type="number" placeholder="Insured Value (USD)" value={formData.estimated_cost} onChange={handleChange} />

              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Details</h3>
                <Input name="pickup_location" placeholder="Pickup Location" value={formData.pickup_location} onChange={handleChange} error={errors.pickup_location} />
              </div>
              <Input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} error={errors.destination} />
              <Input name="weight" type="number" placeholder="Weight (in kg)" value={formData.weight} onChange={handleChange} error={errors.weight} />

              <div className="md:col-span-2">
                <Button type="button" onClick={handleGetQuote} isLoading={quoteStatus === 'loading'} fullWidth>
                  <FaCalculator className="mr-2"/> Get Shipping Quote
                </Button>
              </div>
              
              {quote && quoteStatus === 'succeeded' && (
                <div className="md:col-span-2 text-center p-4 bg-teal-50 rounded-lg">
                  <p className="font-semibold text-gray-700">Distance: {quote.distance_km} km</p>
                  <p className="text-2xl font-bold text-primary mt-2">Shipping Cost: ${quote.calculated_cost.toFixed(2)}</p>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Parcel Photo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 cursor-pointer"/>
                {errors.image && <p className="text-error text-xs mt-1">{errors.image}</p>}
              </div>

              <div className="md:col-span-2">
                <Button type="button" onClick={handleProceedToPayment} fullWidth disabled={quoteStatus !== 'succeeded'}>
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default CreateParcelModal;
