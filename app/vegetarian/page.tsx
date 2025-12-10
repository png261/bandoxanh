'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, ChevronRight, Leaf } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

export default function GreenMenuPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm mb-4">
                        LỐI SỐNG XANH
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                        Thực Đơn <span className="text-brand-green">Xanh</span> 🥬
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Khám phá các món ăn thuần chay bổ dưỡng, thân thiện với môi trường
                    </p>
                </div>

                {/* Menu Link - Large Card */}
                <Link href="/vegetarian/menu" className="group block max-w-2xl mx-auto">
                    <div className="relative h-80 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.02] bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 group-hover:border-brand-green/30">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Green Menu"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="bg-brand-green w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                                Thực Đơn<br />Thuần Chay
                            </h3>
                            <p className="text-white/80 mb-4 max-w-md">
                                Các món ăn ngon, bổ dưỡng và thân thiện với môi trường
                            </p>
                            <div className="flex items-center gap-2 text-white font-bold text-lg group-hover:translate-x-2 transition-transform">
                                Khám phá ngay <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </MainLayout>
    );
}
