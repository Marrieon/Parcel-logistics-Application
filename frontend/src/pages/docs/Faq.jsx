import React from 'react';

const Faq = () => {
  const faqs = [
    {
      question: 'How is my shipping cost calculated?',
      answer: 'The shipping cost is calculated dynamically using a formula that includes a base fee, the parcel\'s weight (price per kg), and the travel distance (price per km). You will always see the final, transparent cost before making a payment.',
    },
    {
      question: 'What does "Insured Value" mean?',
      answer: 'The insured value is the monetary value of your parcel\'s contents that you declare during order creation. In the rare case of loss or damage, this value is used for compensation purposes, providing you with financial protection.',
    },
    {
      question: 'Is my payment information safe?',
      answer: 'Yes, 100%. We use Stripe, a world-leading payment processor, to handle all transactions. Your card details are encrypted and sent directly to Stripe. We never see or store your sensitive financial information.',
    },
    {
      question: 'How do I track my delivery?',
      answer: 'Tracking is simple. Log in to your dashboard and click on the parcel you wish to track. The details page will show you its current status, updated location, and a live map of the delivery route.',
    },
  ];

  return (
    <article className="prose prose-lg max-w-none text-base-text">
      <h1 className="text-secondary">Frequently Asked Questions</h1>
      <p className="lead">
        Have questions? We've got answers. Here are some of the most common queries we receive.
      </p>
      <div className="mt-12 divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-6">
            <dt className="text-lg">
              <p className="font-bold text-secondary">{faq.question}</p>
            </dt>
            <dd className="mt-2">
              <p className="text-base text-gray-600">{faq.answer}</p>
            </dd>
          </div>
        ))}
      </div>
    </article>
  );
};

export default Faq;