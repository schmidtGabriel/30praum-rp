import React from 'react';
import { PaymentRequest, PaymentRequestStatus } from '../../../types';
import { useArtists } from '../../../hooks/useArtists';
import { useBeneficiary } from '../../../hooks/useBeneficiary';
import ActionButton from '../../../components/ActionButton';

interface PaymentRequestDetailProps {
  request: PaymentRequest;
  justification: string;
  onJustificationChange: (value: string) => void;
  onStatusUpdate: (status: PaymentRequestStatus, justification?: string) => void;
}

const PaymentRequestDetail: React.FC<PaymentRequestDetailProps> = ({
  request,
  justification,
  onJustificationChange,
  onStatusUpdate,
}) => {
  const { artists } = useArtists();
  const { beneficiaries } = useBeneficiary();

  const artist = artists.find((a) => a.id === request.artistId);
  const beneficiary = beneficiaries.find((b) => b.id === request.beneficiaryId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Informações da Solicitação
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              ID
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {request.id}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Artista
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {artist?.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Valor
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {formatCurrency(request.amount)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Status
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {request.status}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Data de Pagamento
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {new Date(request.paymentDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Data de Competência
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {new Date(request.competenceDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
            Descrição
          </label>
          <p className="mt-1 text-sm text-slate-900 dark:text-white">
            {request.description}
          </p>
        </div>

        {request.justification && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
              Justificativa
            </label>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {request.justification}
            </p>
          </div>
        )}
      </div>

      {/* Beneficiary Details */}
      {beneficiary && (
        <div className="border-t pt-6 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Informações do Beneficiário
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Nome Completo
              </label>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {beneficiary.fullName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                CPF/CNPJ
              </label>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {beneficiary.document}
              </p>
            </div>
            {beneficiary.companyName && (
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                  Razão Social
                </label>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {beneficiary.companyName}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Chave PIX
              </label>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {beneficiary.pixKey}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                Telefone
              </label>
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                {beneficiary.phone}
              </p>
            </div>
            {beneficiary.description && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                  Observações
                </label>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">
                  {beneficiary.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approval/Rejection Section */}
      {request.status === 'pending' && (
        <div className="border-t pt-6 dark:border-slate-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Justificativa (em caso de negação)
              </label>
              <textarea
                value={justification}
                onChange={(e) => onJustificationChange(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <ActionButton
                onClick={() => onStatusUpdate('rejected', justification)}
                variant="danger"
                disabled={!justification}
              >
                Negar
              </ActionButton>
              <ActionButton onClick={() => onStatusUpdate('approved')}>
                Aprovar
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestDetail;