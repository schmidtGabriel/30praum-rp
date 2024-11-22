import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { useArtists } from "../../hooks/useArtists";
import { useCatalogs } from "../../hooks/useCatalogs";
import { useDistributors } from "../../hooks/useDistributors";
import { Catalog } from "../../types";
import CatalogForm from "./CatalogForm";

const Catalogs = () => {
  const {
    catalogs,
    isLoading: catalogsLoading,
    error: catalogsError,
    createCatalog,
    updateCatalog,
    deleteCatalog,
  } = useCatalogs();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { distributors, isLoading: distributorsLoading } = useDistributors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const navigate = useNavigate();

  const columns = [
    {
      key: "artistId",
      label: "Artist",
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || "Desconhecido",
    },
    {
      key: "distributor",
      label: "Distributor",
      render: (_: any, item: Catalog) =>
        distributors.find((p) => p.id === item.distributorId)?.name ||
        "Desconhecido",
    },
    {
      key: "percentage",
      label: "Percentage",
      render: (_: any, item: Catalog) =>
        `${
          distributors.find((p) => p.id === item.distributorId)?.percentage ?? 0
        }%`,
    },
    {
      key: "playExpectation",
      label: "Expected Plays",
      render: (value: number) => value.toLocaleString(),
    },
  ];

  const handleAdd = () => {
    setSelectedCatalog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setIsModalOpen(true);
  };

  const handleView = (catalog: Catalog) => {
    navigate(`/catalogs/${catalog.id}`);
  };

  const handleDelete = async (catalog: Catalog) => {
    if (window.confirm("Tem certeza que deseja excluir este catálogo?")) {
      await deleteCatalog(catalog.id);
    }
  };

  const handleSubmit = async (data: Omit<Catalog, "id">) => {
    try {
      if (selectedCatalog) {
        await updateCatalog(selectedCatalog.id, data);
      } else {
        await createCatalog(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Falha ao salvar catálogo:", error);
    }
  };

  if (catalogsError) {
    return <div className="text-red-600">Erro: {catalogsError.message}</div>;
  }

  const isLoading = catalogsLoading || artistsLoading || distributorsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={catalogs}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        title="Catálogos"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCatalog ? "Editar Catálogo" : "Adicionar Catálogo"}
      >
        <CatalogForm
          catalog={selectedCatalog}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Catalogs;
