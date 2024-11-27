import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentRequest } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { usePaymentRequests } from '../../hooks/usePaymentRequests';
import { beneficiaryService } from '../../services/api';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';
import StatusBadge from '../../components/StatusBadge';
import { X, Edit, Eye } from 'lucide-react';
import PaymentRequestForm from './components/PaymentRequestForm';
import PaymentRequestDetail from './components/PaymentRequestDetail';

const PaymentRequestList = () => {
  const navigate = useNavigate();
  const { artists } = useArtists();
  const { paymentRequests, isLoading, updateStatus, updatePaymentRequest } =
    usePaymentRequests();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );
  const [justification, setJustification] = useState('');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  React.useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        const data = await beneficiaryService.list();
        setBeneficiaries(data);
      } catch (error) {
        console.error('Failed to load beneficiaries:', error);
      }
    };
    loadBeneficiaries();
  }, []);

  const handleStatusUpdate = async (
    newStatus: PaymentRequestStatus,
    justification?: string
  ) => {
    if (!selectedRequest) return;

    try {
      await updateStatus(selectedRequest.id, newStatus, justification);
      setDetailModalOpen(false);
      setSelectedRequest(null);
      setJustification('');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleView = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleEdit = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<PaymentRequest>) => {
    if (!selectedRequest) return;

    try {
      await updatePaymentRequest(selectedRequest.id, data);
      setEditModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to update payment request:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return dateString
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'artistId',
      label: 'Artista',
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || 'Unknown',
    },
    {
      key: 'beneficiaryId',
      label: 'Beneficiário',
      render: (value: string) =>
        beneficiaries.find((b) => b.id === value)?.fullName || 'Unknown',
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'paymentDate',
      label: 'Data Pagamento',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <StatusBadge status={value as PaymentRequestStatus} />
      ),
    },
  ];

  const renderActions = (request: PaymentRequest) => (
    <div className="flex items-center gap-2">
      {request.status === 'pending' && (
        <ActionButton
          onClick={() => handleEdit(request)}
          className="p-1 rounded"
          variant="transparent"
          title="Editar Solicitação"
        >
          <Edit className="h-4 w-4" />
        </ActionButton>
      )}
      <ActionButton
        onClick={() => handleView(request)}
        className="p-1 rounded"
        variant="transparent"
        title="Ver Detalhes"
      >
        <Eye className="h-4 w-4" />
      </ActionButton>
    </div>
  );

  const filterRequests = (data: PaymentRequest[]) => {
    return data.filter((request) => {
      const artist = artists.find((a) => a.id === request.artistId);
      const beneficiary = beneficiaries.find(
        (b) => b.id === request.beneficiaryId
      );

      const searchMatch = searchTerm
        ? request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          beneficiary?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(request.status);

      return searchMatch && statusMatch;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <div className="space-y-4">
          {/* Search and Clear Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID, artista ou beneficiário..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>
            {(searchTerm || selectedStatuses.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatuses([]);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'pending', label: 'Pendente' },
              { value: 'approved', label: 'Aprovado' },
              { value: 'rejected', label: 'Negado' },
              { value: 'paid', label: 'Pago' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  setSelectedStatuses((prev) =>
                    prev.includes(status.value)
                      ? prev.filter((s) => s !== status.value)
                      : [...prev, status.value]
                  );
                }}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedStatuses.includes(status.value)
                    ? 'bg-purple-900 text-white dark:bg-purple-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <DataTable
        columns={columns}
        data={filterRequests(paymentRequests)}
        renderActions={renderActions}
        title="Solicitações de Pagamento"
      />

      {/* Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRequest(null);
          setJustification('');
        }}
        title="Detalhes da Solicitação"
      >
        {selectedRequest && (
          <PaymentRequestDetail
            request={selectedRequest}
            justification={justification}
            onJustificationChange={setJustification}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRequest(null);
        }}
        title="Editar Solicitação de Pagamento"
      >
        {selectedRequest && (
          <PaymentRequestForm
            initialData={selectedRequest}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default PaymentRequestList;