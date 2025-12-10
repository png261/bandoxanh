'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, XIcon, SaveIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface VegetarianDish {
    id: number;
    name: string;
    description: string;
    image: string;
    tags: string[];
    cookTime: string;
    servingSize: string;
    ingredients: string[];
    recipe: string;
}

export default function AdminVegetarianDishesPage() {
    const router = useRouter();
    const [dishes, setDishes] = useState<VegetarianDish[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<VegetarianDish | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<VegetarianDish>>({
        name: '',
        description: '',
        image: '',
        tags: [],
        cookTime: '',
        servingSize: '',
        ingredients: [],
        recipe: ''
    });

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const res = await fetch('/api/vegetarian-dishes');
            if (res.ok) {
                const data = await res.json();
                setDishes(data);
            } else {
                toast.error('Không thể tải danh sách món ăn');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dish?: VegetarianDish) => {
        if (dish) {
            setEditingDish(dish);
            setFormData({ ...dish });
        } else {
            setEditingDish(null);
            setFormData({
                name: '',
                description: '',
                image: '',
                tags: [],
                cookTime: '',
                servingSize: '',
                ingredients: [],
                recipe: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDish(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingDish ? 'PUT' : 'POST';
            const url = editingDish
                ? `/api/vegetarian-dishes/${editingDish.id}`
                : '/api/vegetarian-dishes';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingDish ? 'Cập nhật thành công' : 'Đã thêm món mới');
                fetchDishes();
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
        if (!confirm('Bạn có chắc chắn muốn xóa món này không?')) return;

        try {
            const res = await fetch(`/api/vegetarian-dishes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Đã xóa món ăn');
                fetchDishes();
            } else {
                toast.error('Không thể xóa món ăn');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối');
        }
    };

    const handleArrayInput = (
        field: 'tags' | 'ingredients',
        value: string
    ) => {
        // Split by comma or newline and allow updating state
        const items = value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: items }));
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
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Thực đơn Chay</h1>
                            <p className="text-gray-500">Thêm, sửa, xóa các món ăn trong thực đơn</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Thêm món mới</span>
                    </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map(dish => (
                        <div key={dish.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                                <img
                                    src={dish.image || '/placeholder-food.jpg'}
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(dish)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600 shadow-sm"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        className="p-2 bg-white/90 rounded-full hover:bg-white text-red-600 shadow-sm"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{dish.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{dish.description}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {dish.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                                    <span>⏱️ {dish.cookTime}</span>
                                    <span>🍽️ {dish.servingSize}</span>
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
                                    {editingDish ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
                                </h2>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian nấu</label>
                                        <input
                                            type="text"
                                            placeholder="VD: 30 phút"
                                            required
                                            value={formData.cookTime}
                                            onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phần ăn</label>
                                        <input
                                            type="text"
                                            placeholder="VD: 2 người"
                                            required
                                            value={formData.servingSize}
                                            onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                                        <input
                                            type="text"
                                            placeholder="korean, spicy, tofu..."
                                            value={formData.tags?.join(', ')}
                                            onChange={(e) => handleArrayInput('tags', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nguyên liệu (cách nhau bởi dấu phẩy)</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Đậu hũ, hành tây,..."
                                            value={formData.ingredients?.join(', ')}
                                            onChange={(e) => handleArrayInput('ingredients', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Công thức chi tiết (Markdown)</label>
                                        <textarea
                                            rows={6}
                                            value={formData.recipe}
                                            onChange={(e) => setFormData({ ...formData, recipe: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none font-mono text-sm"
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
                                        className="px-4 py-2 bg-brand-green text-white hover:bg-green-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                                    >
                                        <SaveIcon className="w-4 h-4" />
                                        <span>{editingDish ? 'Cập nhật' : 'Thêm mới'}</span>
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
