import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentRequests } from '../../hooks/usePaymentRequests';
import PaymentRequestForm from './components/PaymentRequestForm';
import Card from '../../components/Card';

const PaymentRequestCreate = () => {
  const navigate = useNavigate();
  const { createPaymentRequest, isLoading } = usePaymentRequests();

  const handleSubmit = async (data: PaymentRequest) => {
    try {
      await createPaymentRequest(data);
      navigate('/requests');
    } catch (error) {
      console.error('Failed to create payment request:', error);
    }
  };

  const handleCancel = () => {
    navigate('/requests');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Nova Solicitação de Pagamento
        </h1>
        <PaymentRequestForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default PaymentRequestCreate;