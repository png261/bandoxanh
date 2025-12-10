
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

interface DiyIdea {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    image: string;
    createdAt: string;
}

export default function AdminDiyPage() {
    const [ideas, setIdeas] = useState<DiyIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchIdeas();
    }, []);

    async function fetchIdeas() {
        try {
            const res = await fetch('/api/admin/diy');
            if (!res.ok) throw new Error('Failed to fetch ideas');
            const data = await res.json();
            setIdeas(data);
        } catch (error) {
            console.error(error);
            alert('Failed to load DIY ideas');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this idea?')) return;

        try {
            const res = await fetch(`/api/admin/diy/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');

            setIdeas(ideas.filter(idea => idea.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete idea');
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý ý tưởng DIY</h1>
                <Link
                    href="/admin/diy/new"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    + Thêm ý tưởng mới
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Độ khó</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {ideas.map((idea) => (
                            <tr key={idea.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={idea.image || '/placeholder.png'}
                                            alt={idea.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{idea.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {idea.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {idea.difficulty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/diy/${idea.id}`}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 mr-4"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(idea.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {ideas.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Chưa có ý tưởng nào. Hãy tạo mới ngay!
                    </div>
                )}
            </div>
        </div>
    );
}
