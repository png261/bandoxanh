'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, SaveIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface BikeRental {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    price: string;
    hours: string;
    instructions: string;
    terms: string;
    image: string;
}

export default function AdminBikesPage() {
    const router = useRouter();
    const [bikes, setBikes] = useState<BikeRental[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBike, setEditingBike] = useState<BikeRental | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<BikeRental>>({
        name: '',
        address: '',
        latitude: 10.762622,
        longitude: 106.660172,
        price: '',
        hours: '',
        instructions: '',
        terms: '',
        image: ''
    });

    useEffect(() => {
        fetchBikes();
    }, []);

    const fetchBikes = async () => {
        try {
            const res = await fetch('/api/bikes');
            if (res.ok) {
                const data = await res.json();
                setBikes(data);
            } else {
                toast.error('Không thể tải danh sách địa điểm thuê xe');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (bike?: BikeRental) => {
        if (bike) {
            setEditingBike(bike);
            setFormData({ ...bike });
        } else {
            setEditingBike(null);
            setFormData({
                name: '',
                address: '',
                latitude: 10.762622,
                longitude: 106.660172,
                price: '',
                hours: '',
                instructions: '',
                terms: '',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBike(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingBike ? 'PUT' : 'POST';
            const url = editingBike
                ? `/api/bikes/${editingBike.id}`
                : '/api/bikes';

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
                toast.success(editingBike ? 'Cập nhật thành công' : 'Đã thêm địa điểm mới');
                fetchBikes();
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
        if (!confirm('Bạn có chắc chắn muốn xóa địa điểm này không?')) return;

        try {
            const res = await fetch(`/api/bikes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Đã xóa địa điểm');
                fetchBikes();
            } else {
                toast.error('Không thể xóa địa điểm');
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
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Thuê Xe Đạp</h1>
                            <p className="text-gray-500">Thêm, sửa, xóa các trạm thuê xe đạp</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Thêm trạm mới</span>
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bikes.map(bike => (
                        <div key={bike.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                                <img
                                    src={bike.image || '/placeholder-bike.jpg'}
                                    alt={bike.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(bike)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600 shadow-sm"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bike.id)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-red-600 shadow-sm"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{bike.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">📍 {bike.address}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                                        💰 {bike.price}
                                    </span>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                        🕒 {bike.hours}
                                    </span>
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
                                    {editingBike ? 'Chỉnh sửa trạm xe' : 'Thêm trạm mới'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên trạm</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá thuê</label>
                                        <input
                                            type="text"
                                            placeholder="50.000đ/giờ"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label>
                                        <input
                                            type="text"
                                            placeholder="6:00 - 18:00"
                                            required
                                            value={formData.hours}
                                            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn sử dụng</label>
                                        <textarea
                                            rows={3}
                                            value={formData.instructions}
                                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Điều khoản (Terms)</label>
                                        <textarea
                                            rows={3}
                                            value={formData.terms}
                                            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                                        className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                                    >
                                        <SaveIcon className="w-4 h-4" />
                                        <span>{editingBike ? 'Cập nhật' : 'Thêm mới'}</span>
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
