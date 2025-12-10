
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DiyFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function DiyForm({ initialData, isEdit }: DiyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'Dễ',
        category: 'Nhựa',
        materials: [''],
        steps: [''],
        image: '',
        videoUrl: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                difficulty: initialData.difficulty || 'Dễ',
                category: initialData.category || 'Nhựa',
                materials: initialData.materials?.length ? initialData.materials : [''],
                steps: initialData.steps?.length ? initialData.steps : [''],
                image: initialData.image || '',
                videoUrl: initialData.videoUrl || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (index: number, value: string, field: 'materials' | 'steps') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'materials' | 'steps') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (index: number, field: 'materials' | 'steps') => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/admin/diy/${initialData.id}` : '/api/admin/diy';
            const method = isEdit ? 'PATCH' : 'POST';

            // Filter out empty strings from arrays
            const cleanedData = {
                ...formData,
                materials: formData.materials.filter(i => i.trim()),
                steps: formData.steps.filter(i => i.trim()),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/admin/diy');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save DIY idea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/diy" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEdit ? 'Chỉnh sửa ý tưởng DIY' : 'Thêm ý tưởng DIY mới'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        >
                            <option value="Nhựa">Nhựa</option>
                            <option value="Giấy">Giấy</option>
                            <option value="Thủy tinh">Thủy tinh</option>
                            <option value="Vải">Vải</option>
                            <option value="Kim loại">Kim loại</option>
                            <option value="Gỗ/Hữu cơ">Gỗ/Hữu cơ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Độ khó</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        >
                            <option value="Dễ">Dễ</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Khó">Khó</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link Video (YouTube)</label>
                        <input
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Link Ảnh Minh Họa</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                    {formData.image && (
                        <div className="mt-2 relative h-40 w-full md:w-1/2 rounded-lg overflow-hidden border border-gray-200">
                            <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                    <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Nguyên liệu</label>
                    {formData.materials.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'materials')}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                                placeholder={`Nguyên liệu ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem(index, 'materials')}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('materials')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        + Thêm nguyên liệu
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Các bước thực hiện</label>
                    {formData.steps.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="w-8 h-10 flex items-center justify-center font-bold text-gray-400 bg-gray-100 rounded">
                                {index + 1}
                            </div>
                            <textarea
                                value={item}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                                placeholder={`Bước ${index + 1}`}
                                rows={2}
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem(index, 'steps')}
                                className="text-red-500 hover:text-red-700 px-2 self-start mt-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('steps')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        + Thêm bước
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <Link
                        href="/admin/diy"
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : (isEdit ? 'Lưu thay đổi' : 'Tạo mới')}
                    </button>
                </div>
            </form>
        </div>
    );
}
