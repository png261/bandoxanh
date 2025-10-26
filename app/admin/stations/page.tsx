'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';


interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours: string;
  wasteTypes: string;
  imageUrl?: string | null;
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<Station | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    try {
      const res = await fetch('/api/stations');
      const data = await res.json();
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this station?')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/stations/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStations(stations.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete station');
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      alert('Error deleting station');
    } finally {
      setDeleting(null);
    }
  }

  async function handleEdit(station: Station) {
    setEditing(station);
  }

  async function handleSave() {
    if (!editing) return;

    setSaving(true);
    try {
      const wasteTypes = JSON.parse(editing.wasteTypes || '[]');
      
      const res = await fetch(`/api/admin/stations/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          address: editing.address,
          latitude: editing.latitude,
          longitude: editing.longitude,
          hours: editing.hours,
          wasteTypes: wasteTypes,
          image: editing.imageUrl,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStations(stations.map((s) => (s.id === updated.id ? updated : s)));
        setEditing(null);
      } else {
        alert('Failed to update station');
      }
    } catch (error) {
      console.error('Error updating station:', error);
      alert('Error updating station');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recycling Stations
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage all recycling station locations
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Waste Types
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No stations found
                  </td>
                </tr>
              ) : (
                stations.map((station) => {
                  const wasteTypes = JSON.parse(station.wasteTypes || '[]');
                  return (
                    <tr key={station.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {station.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {station.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {station.hours}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {wasteTypes.slice(0, 3).map((type: string) => (
                            <span
                              key={type}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            >
                              {type}
                            </span>
                          ))}
                          {wasteTypes.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{wasteTypes.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(station)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          disabled={deleting === station.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          {deleting === station.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Station
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editing.address}
                    onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={editing.latitude}
                      onChange={(e) => setEditing({ ...editing, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={editing.longitude}
                      onChange={(e) => setEditing({ ...editing, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hours
                  </label>
                  <input
                    type="text"
                    value={editing.hours}
                    onChange={(e) => setEditing({ ...editing, hours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Waste Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={JSON.parse(editing.wasteTypes || '[]').join(', ')}
                    onChange={(e) => {
                      const types = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                      setEditing({ ...editing, wasteTypes: JSON.stringify(types) });
                    }}
                    placeholder="Plastic, Glass, Paper, Metal"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <ImageUpload
                  currentUrl={editing.imageUrl || ''}
                  onUploadSuccess={(url) => setEditing({ ...editing, imageUrl: url })}
                  label="Station Image"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
