// app/admin/organizations/page.tsx
// Page principale pour la gestion des organisations, similaire à EventsPage.

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Organization } from '../types/organization';
import OrganizationTable from './components/OrganizationTable';
import OrganizationFilter from './components/OrganizationFilter';
import OrganizationForm from './components/OrganizationForm';
import DeleteOrganizationModal from './components/DeleteOrganizationModal';
import OrganizationDetailsModal from './components/OrganizationDetailsModal';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Organization | null>(null);
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<string[]>([]);
  const [filterParams, setFilterParams] = useState<{
    search: string;
    sex: string | null;
  }>({ search: '', sex: null });

  const userId = typeof window !== 'undefined' ? localStorage.getItem('managerId') : null;

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (userId) {
          headers['x-user-id'] = userId;
        }
        const res = await fetch('/api/admin/organizations', { headers });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des organisations.');
        }
        const data = await res.json();
        setOrganizations(data);
        setFilteredOrganizations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    loadOrganizations();
  }, []);

  const handleFilterChange = useCallback(
    (search: string, sex: string | null) => {
      setFilterParams({ search, sex });
      let filtered = organizations;
      if (sex) {
        filtered = filtered.filter((org) => org.sex === sex);
      }
      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          (org) =>
            org.firstName.toLowerCase().includes(lowerSearch) ||
            org.lastName.toLowerCase().includes(lowerSearch)
        );
      }
      setFilteredOrganizations(filtered);
    },
    [organizations]
  );

  const handleCreate = async (data: {
    firstName: string;
    lastName: string;
    sex: string;
    logo: string;
  }) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch(`/api/admin/organizations/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'organisation.");
      }
      const response = await res.json();
      window.location.reload();
      setOrganizations([...organizations, response.organization]);
      handleFilterChange(filterParams.search, filterParams.sex);
      setSuccess('Organisation créée avec succès');
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleUpdate = async (data: {
    firstName: string;
    lastName: string;
    sex: string;
    logo: string;
  }) => {
    if (!editingOrganization) return;
    try {
      const updatedData = { ...data, id: editingOrganization.id };
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/organizations/update', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'organisation.");
      }
      const response = await res.json();
      const updatedOrganizations = organizations.map((o) => (o.id === editingOrganization.id ? response : o));
      window.location.reload();
      setOrganizations(updatedOrganizations);
      handleFilterChange(filterParams.search, filterParams.sex);
      setSuccess('Organisation mise à jour avec succès');
      setEditingOrganization(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrganizationIds.length === 0) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['x-user-id'] = userId;
      }
      const res = await fetch('/api/admin/organizations/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ ids: selectedOrganizationIds }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression des organisations.');
      }
      const updatedOrganizations = organizations.filter((o) => !selectedOrganizationIds.includes(o.id));
      setOrganizations(updatedOrganizations);
      handleFilterChange(filterParams.search, filterParams.sex);
      setSuccess('Organisation(s) supprimée(s) avec succès');
      setShowDeleteModal(false);
      setSelectedOrganizationIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleViewDetails = (organization: Organization) => {
    setShowDetailsModal(organization);
  };

  const handleSelectOrganizations = (ids: string[]) => {
    setSelectedOrganizationIds(ids);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="inline-block bg-blue-100 text-red-600 rounded-full p-2">
              <svg width="24" height="24" fill="none">
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Gestion des organisations
          </h1>
          <p className="text-gray-500 mt-1">Ajoutez, modifiez ou supprimez les organisations de la plateforme.</p>
        </div>
        <button
          onClick={() => {
            setEditingOrganization(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
          aria-label="Ajouter une organisation"
        >
          <svg width="20" height="20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter une organisation
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"
              fill="currentColor"
            />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-100 text-green-700 p-4 rounded mb-4 animate-fade-in">
          <svg width="20" height="20" fill="none">
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l-3-3 1.41-1.41L9 11.17l4.59-4.59L15 8l-6 6z"
              fill="currentColor"
            />
          </svg>
          {success}
        </div>
      )}

      {selectedOrganizationIds.length > 0 && (
        <div className="sticky top-0 z-10 flex justify-end mb-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
            aria-label={`Supprimer ${selectedOrganizationIds.length} organisation(s)`}
          >
            <svg width="18" height="18" fill="none">
              <path
                d="M6 6v6m6-6v6M4 4h10v10H4V4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Supprimer la sélection ({selectedOrganizationIds.length})
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <OrganizationFilter onFilterChange={handleFilterChange} />
        <OrganizationTable
          organizations={filteredOrganizations}
          onEdit={(org) => {
            setEditingOrganization(org);
            setShowForm(true);
          }}
          onDelete={(org) => {
            setSelectedOrganizationIds([org.id]);
            setShowDeleteModal(true);
          }}
          onViewDetails={handleViewDetails}
          onSelectOrganizations={handleSelectOrganizations}
          isLoading={loading}
        />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
            <OrganizationForm
              organization={editingOrganization ?? undefined}
              onSubmit={editingOrganization ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteOrganizationModal
          organization={null}
          selectedOrganizationCount={selectedOrganizationIds.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedOrganizationIds([]);
          }}
        />
      )}

      {showDetailsModal && (
        <OrganizationDetailsModal
          organization={showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
        />
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
}