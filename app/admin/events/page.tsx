'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';


interface Event {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  organizer: string;
  description: string;
  imageUrl?: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    } finally {
      setDeleting(null);
    }
  }

  async function handleEdit(event: Event) {
    setEditing(event);
  }

  async function handleSave() {
    if (!editing) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          address: editing.address,
          latitude: editing.latitude,
          longitude: editing.longitude,
          date: editing.date,
          time: editing.time,
          organizer: editing.organizer,
          description: editing.description,
          imageUrl: editing.imageUrl,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
        setEditing(null);
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
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
            Recycling Events
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage all recycling events and activities
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No events found
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {event.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p>📅 {event.date}</p>
                  <p>🕐 {event.time}</p>
                  <p>📍 {event.address}</p>
                  <p>👤 {event.organizer}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {event.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {deleting === event.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Event
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Name
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editing.date}
                      onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                      placeholder="e.g., 15/11/2024"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={editing.time}
                      onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                      placeholder="e.g., 8:00 - 12:00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={editing.organizer}
                    onChange={(e) => setEditing({ ...editing, organizer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <ImageUpload
                  currentUrl={editing.imageUrl || ''}
                  onUploadSuccess={(url) => setEditing({ ...editing, imageUrl: url })}
                  label="Event Image"
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
