'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, SaveIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface DonationPoint {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    hours: string;
    acceptedItems: string;
    beneficiary: string;
    image: string;
    beneficiaryImage: string | null;
}

export default function AdminDonationsPage() {
    const router = useRouter();
    const [points, setPoints] = useState<DonationPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState<DonationPoint | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<DonationPoint>>({
        name: '',
        address: '',
        latitude: 10.762622,
        longitude: 106.660172,
        hours: '',
        acceptedItems: '',
        beneficiary: '',
        image: '',
        beneficiaryImage: ''
    });

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const res = await fetch('/api/donations');
            if (res.ok) {
                const data = await res.json();
                setPoints(data);
            } else {
                toast.error('Không thể tải danh sách điểm quyên góp');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (point?: DonationPoint) => {
        if (point) {
            setEditingPoint(point);
            setFormData({ ...point });
        } else {
            setEditingPoint(null);
            setFormData({
                name: '',
                address: '',
                latitude: 10.762622,
                longitude: 106.660172,
                hours: '',
                acceptedItems: '',
                beneficiary: '',
                image: '',
                beneficiaryImage: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPoint(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingPoint ? 'PUT' : 'POST';
            const url = editingPoint
                ? `/api/donations/${editingPoint.id}`
                : '/api/donations';

            const payload = {
                ...formData,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(editingPoint ? 'Cập nhật thành công' : 'Đã thêm điểm mới');
                fetchPoints();
                handleCloseModal();
            } else {
                toast.error('Lỗi khi lưu dữ liệu');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa điểm này không?')) return;

        try {
            const res = await fetch(`/api/donations/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Đã xóa điểm quyên góp');
                fetchPoints();
            } else {
                toast.error('Không thể xóa điểm quyên góp');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Điểm Quyên Góp</h1>
                            <p className="text-gray-500">Thêm, sửa, xóa các điểm thu nhận đồ cũ</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Thêm điểm mới</span>
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {points.map(point => (
                        <div key={point.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                                <img
                                    src={point.image || '/placeholder-donation.jpg'}
                                    alt={point.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(point)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600 shadow-sm"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(point.id)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-red-600 shadow-sm"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{point.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">📍 {point.address}</p>
                                <div className="border-t pt-3 mt-2">
                                    <p className="text-sm text-gray-600"><strong>Nhận:</strong> {point.acceptedItems}</p>
                                    <p className="text-sm text-gray-600 mt-1"><strong>Cho:</strong> {point.beneficiary}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingPoint ? 'Chỉnh sửa điểm quyên góp' : 'Thêm điểm mới'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên địa điểm</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Latitude)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Longitude)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label>
                                        <input
                                            type="text"
                                            placeholder="8:00 - 17:00"
                                            required
                                            value={formData.hours}
                                            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vật phẩm nhận (Accepted Items)</label>
                                        <input
                                            type="text"
                                            placeholder="Quần áo, sách vở, đồ chơi..."
                                            required
                                            value={formData.acceptedItems}
                                            onChange={(e) => setFormData({ ...formData, acceptedItems: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Người/Tổ chức thụ hưởng (Beneficiary)</label>
                                        <input
                                            type="text"
                                            placeholder="Trẻ em vùng cao..."
                                            required
                                            value={formData.beneficiary}
                                            onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh địa điểm</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh thụ hưởng (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.beneficiaryImage || ''}
                                            onChange={(e) => setFormData({ ...formData, beneficiaryImage: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                                    >
                                        <SaveIcon className="w-4 h-4" />
                                        <span>{editingPoint ? 'Cập nhật' : 'Thêm mới'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
