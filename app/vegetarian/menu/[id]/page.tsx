import React from 'react';
import Image from 'next/image';
import { Clock, ChefHat, ArrowLeft, Users, List, Flame } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function FoodDetailPage({ params }: PageProps) {
    const { id } = await params;
    const dishId = parseInt(id);

    if (isNaN(dishId)) return notFound();

    // Using raw query as fallback if model name differs
    const item = await prisma.$queryRaw<Array<{
        id: number;
        name: string;
        description: string;
        recipe: string | null;
        image: string | null;
        tags: string[];
        ingredients: string[];
        cookTime: string | null;
        servingSize: string | null;
    }>>`SELECT * FROM "VegetarianDish" WHERE id = ${dishId} LIMIT 1`;

    if (!item || item.length === 0) {
        return notFound();
    }

    const dish = item[0];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh]">
                <Image
                    src={dish.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800'}
                    alt={dish.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-7xl mx-auto">
                        <Link href="/vegetarian/menu" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại Thực đơn
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {dish.name}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
                            {dish.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-white font-medium">
                            {dish.cookTime && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                    <Clock className="w-5 h-5 text-green-300" />
                                    {dish.cookTime}
                                </div>
                            )}
                            {dish.servingSize && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                                    <Users className="w-5 h-5 text-green-300" />
                                    {dish.servingSize}
                                </div>
                            )}
                            {dish.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-2 bg-green-500 text-white text-sm font-bold rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-[1fr_2fr] gap-12">

                {/* Ingredients Column */}
                <div className="space-y-8">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-8 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <List className="w-6 h-6 text-green-500" /> Nguyên liệu
                        </h2>
                        <ul className="space-y-4">
                            {dish.ingredients && dish.ingredients.length > 0 ? (
                                dish.ingredients.map((ing: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="block w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0" />
                                        <span>{ing}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 dark:text-gray-400 italic">Chưa có chi tiết nguyên liệu.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Instructions Column */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 border-b dark:border-gray-700 pb-4">
                        <Flame className="w-8 h-8 text-orange-500" /> Cách làm
                    </h2>

                    <div className="space-y-10">
                        {dish.recipe ? (
                            dish.recipe.split(/\r?\n/).filter((line: string) => line.trim().length > 0).map((step: string, idx: number) => {
                                // Simple parsing for numbered list if exists "1. "
                                const stepContent = step.replace(/^\d+\.\s*/, '');
                                return (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xl flex items-center justify-center border-2 border-transparent group-hover:border-green-500 group-hover:text-green-500 group-hover:bg-white dark:group-hover:bg-gray-900 transition-all">
                                            {idx + 1}
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {stepContent}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Hướng dẫn nấu ăn sẽ được cập nhật sớm.</p>
                        )}
                    </div>

                    <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-6 border border-gray-100 dark:border-gray-700">
                        <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                            <ChefHat className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Mẹo của Đầu bếp</h3>
                            <p className="text-gray-600 dark:text-gray-400">Hãy điều chỉnh gia vị theo khẩu vị của bạn. Nấu ăn là nghệ thuật, không phải công thức cứng nhắc!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
