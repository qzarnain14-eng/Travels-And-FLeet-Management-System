import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-40 pb-20 px-4 text-center">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 text-lg mb-12">
          Your payment was not completed. No charges were made.
          If you encountered an issue, please try again or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/cars')}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
