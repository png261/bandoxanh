'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import SearchBar from '@/components/admin/SearchBar';
import StatsCards from '@/components/admin/StatsCards';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/ImageUpload';
import MapPicker from '@/components/MapPicker';

interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours: string;
  wasteTypes: string | string[];
  image?: string | null;
}

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const WASTE_TYPES = ['Nhựa', 'Giấy', 'Kim loại', 'Thủy tinh', 'Pin', 'Điện tử', 'Vải', 'Khác'];

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 10.762622,
    longitude: 106.660172,
    hours: 'Thứ 2 - Chủ nhật: 8:00 - 17:00',
    wasteTypes: [] as string[],
    image: '',
  });

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
      toast.error('Không thể tải danh sách điểm thu gom');
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingStation(null);
    setFormData({
      name: '',
      address: '',
      latitude: 10.762622,
      longitude: 106.660172,
      hours: 'Thứ 2 - Chủ nhật: 8:00 - 17:00',
      wasteTypes: [],
      image: '',
    });
    setShowModal(true);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      hours: station.hours,
      wasteTypes: typeof station.wasteTypes === 'string' ? station.wasteTypes.split(',').map(t => t.trim()) : station.wasteTypes,
      image: station.image || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      const url = editingStation ? `/api/admin/stations/${editingStation.id}` : '/api/admin/stations';
      const method = editingStation ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          wasteTypes: formData.wasteTypes,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const saved = await res.json();
      
      if (editingStation) {
        setStations(stations.map(s => s.id === saved.id ? saved : s));
        toast.success('Cập nhật thành công!');
      } else {
        setStations([saved, ...stations]);
        toast.success('Thêm điểm thu gom thành công!');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving station:', error);
      toast.error('Không thể lưu điểm thu gom');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa điểm thu gom này?')) return;

    try {
      const res = await fetch(`/api/admin/stations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setStations(stations.filter(s => s.id !== id));
      toast.success('Xóa thành công!');
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error('Không thể xóa điểm thu gom');
    }
  };

  const filteredStations = stations.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Quản lý Điểm thu gom" description="Quản lý các điểm thu gom rác thải tái chế" icon="📍" />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddClick={handleAdd} addButtonText="Thêm điểm thu gom" placeholder="🔍 Tìm kiếm theo tên hoặc địa chỉ..." />
        <StatsCards stats={[{ label: 'Tổng số điểm', value: stations.length, color: 'text-green-600' }, { label: 'Đang hiển thị', value: filteredStations.length, color: 'text-blue-600' }]} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tên điểm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Địa chỉ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Giờ hoạt động</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Loại rác</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStations.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">{searchTerm ? 'Không tìm thấy điểm thu gom nào' : 'Chưa có điểm thu gom nào'}</td></tr>
                ) : (
                  filteredStations.map((station) => (
                    <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><div className="font-medium text-gray-900">{station.name}</div></td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{station.address}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{station.hours}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            let types: string[] = [];
                            if (Array.isArray(station.wasteTypes)) {
                              types = station.wasteTypes;
                            } else if (typeof station.wasteTypes === 'string') {
                              types = station.wasteTypes.split(',').map(t => t.trim());
                            }
                            return types.slice(0, 3).map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{type}</span>
                            ));
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(station)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">✏️ Sửa</button>
                          <button onClick={() => handleDelete(station.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">🗑️ Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingStation ? '✏️ Chỉnh sửa điểm thu gom' : '➕ Thêm điểm thu gom mới'} onSave={handleSave} saving={saving} isEditing={!!editingStation}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên điểm thu gom *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: Trạm Thu Gom Quận 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM" />
            </div>
            <div>
              <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                label="Vị trí trên bản đồ *"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giờ hoạt động</label>
              <input type="text" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="VD: Thứ 2 - Chủ nhật: 8:00 - 17:00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại rác thu gom</label>
              <div className="grid grid-cols-2 gap-3">
                {WASTE_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.wasteTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, wasteTypes: [...formData.wasteTypes, type] });
                        } else {
                          setFormData({ ...formData, wasteTypes: formData.wasteTypes.filter(t => t !== type) });
                        }
                      }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <ImageUpload
                currentUrl={formData.image}
                onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                label="Hình ảnh điểm thu gom"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
