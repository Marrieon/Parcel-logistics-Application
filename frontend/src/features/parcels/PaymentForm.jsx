import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '../../components/common/Button';
import Swal from 'sweetalert2';

const PaymentForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We don't need a return_url as we handle success/failure manually
      },
      redirect: "if_required" // Prevents immediate redirection
    });

    if (error) {
      Swal.fire('Payment Failed', error.message, 'error');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment was successful!
      onSuccess(); // Call the parent component's success handler
    } else {
      Swal.fire('Payment Pending', 'Your payment is being processed.', 'info');
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="mt-6">
        <Button type="submit" isLoading={isLoading} disabled={!stripe} fullWidth>
          Pay Now
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;