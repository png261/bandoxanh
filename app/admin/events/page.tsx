'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import SearchBar from '@/components/admin/SearchBar';
import StatsCards from '@/components/admin/StatsCards';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/ImageUpload';
import MapPicker from '@/components/MapPicker';

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
  image?: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 10.762622,
    longitude: 106.660172,
    date: '',
    time: '09:00',
    organizer: '',
    description: '',
    image: '',
  });

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
      toast.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      address: '',
      latitude: 10.762622,
      longitude: 106.660172,
      date: '',
      time: '09:00',
      organizer: '',
      description: '',
      image: '',
    });
    setShowModal(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      address: event.address,
      latitude: event.latitude,
      longitude: event.longitude,
      date: event.date,
      time: event.time,
      organizer: event.organizer,
      description: event.description,
      image: event.image || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.date || !formData.organizer) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save');

      const saved = await res.json();
      
      if (editingEvent) {
        setEvents(events.map(e => e.id === saved.id ? saved : e));
        toast.success('Cập nhật thành công!');
      } else {
        setEvents([saved, ...events]);
        toast.success('Thêm sự kiện thành công!');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Không thể lưu sự kiện');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa sự kiện này?')) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setEvents(events.filter(e => e.id !== id));
      toast.success('Xóa thành công!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Không thể xóa sự kiện');
    }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Quản lý Sự kiện" description="Quản lý các sự kiện môi trường và thu gom rác thải" icon="📅" />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddClick={handleAdd} addButtonText="Thêm sự kiện" placeholder="🔍 Tìm kiếm theo tên, địa chỉ hoặc đơn vị tổ chức..." />
        <StatsCards stats={[{ label: 'Tổng số sự kiện', value: events.length, color: 'text-blue-600' }, { label: 'Đang hiển thị', value: filteredEvents.length, color: 'text-green-600' }]} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tên sự kiện</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ngày & Giờ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Địa điểm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Đơn vị tổ chức</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">{searchTerm ? 'Không tìm thấy sự kiện nào' : 'Chưa có sự kiện nào'}</td></tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><div className="font-medium text-gray-900">{event.name}</div></td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{new Date(event.date).toLocaleDateString('vi-VN')}</div>
                          <div className="text-gray-600">{event.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{event.address}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{event.organizer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(event)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">✏️ Sửa</button>
                          <button onClick={() => handleDelete(event.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">🗑️ Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingEvent ? '✏️ Chỉnh sửa sự kiện' : '➕ Thêm sự kiện mới'} onSave={handleSave} saving={saving} isEditing={!!editingEvent}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sự kiện *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="VD: Ngày hội thu gom rác thải tái chế" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm *</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="VD: Công viên Tao Đàn, Quận 1, TP.HCM" />
            </div>
            <div>
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                label="Vị trí sự kiện trên bản đồ *"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày diễn ra *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giờ diễn ra</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tổ chức *</label>
              <input type="text" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="VD: UBND Quận 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Mô tả về sự kiện..."></textarea>
            </div>
            <div>
              <ImageUpload
                currentUrl={formData.image}
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                label="Hình ảnh sự kiện"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
