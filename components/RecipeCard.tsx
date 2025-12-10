'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChefHat, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export interface Recipe {
    id?: number | string;
    name: string;
    description: string;
    image?: string;
    price?: string; // Optional now
    tags?: string[];
    ingredients?: string[]; // List of ingredients
    recipe?: string; // KEEPING for backward compatibility but moving to steps preferred
    cookTime?: string;
    servingSize?: string;
}

interface RecipeCardProps {
    item: Recipe;
}

export default function RecipeCard({ item }: RecipeCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isAiResult = typeof item.id === 'string' && item.id.startsWith('ai-');

    // Fallback image if none provided (e.g. from AI)
    const imageSrc = item.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop';

    // Wrapper for link vs div
    const CardContent = () => (
        <>
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2">
                        <ChefHat className="w-5 h-5" />
                        {isAiResult ? 'View Method' : 'View Full Recipe'}
                    </span>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-green transition-colors">
                        {item.name}
                    </h3>
                    {(item as any).price && (
                        <span className="bg-green-50 text-brand-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {(item as any).price}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags?.map((tag, i) => (
                        <span key={i} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {tag}
                        </span>
                    ))}
                    {item.cookTime && (
                        <span className="text-xs font-medium text-brand-green flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                            <Clock className="w-3 h-3" /> {item.cookTime}
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    {isAiResult ? (
                        <button
                            onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm hover:bg-brand-green hover:text-white transition-all group-item"
                        >
                            {isOpen ? (
                                <>Hide Instructions <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>How to Cook <ChevronDown className="w-4 h-4" /></>
                            )}
                        </button>
                    ) : (
                        <span className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-700 font-semibold text-sm group-hover:bg-brand-green group-hover:text-white transition-all">
                            Start Cooking <ChevronDown className="w-4 h-4 -rotate-90 group-hover:rotate-0 transition-transform" />
                        </span>
                    )}
                </div>
            </div>

            {/* Inline expand only for AI results */}
            {isAiResult && (
                <div className={`bg-green-50/50 transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-green-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        <strong className="block text-brand-green mb-3 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Preparation Method
                        </strong>
                        {item.recipe}
                    </div>
                </div>
            )}
        </>
    );

    if (!isAiResult) {
        return (
            <Link href={`/vegetarian`} className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group cursor-pointer block">
                <CardContent />
            </Link>
        )
    }

    return (
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
            <CardContent />
        </div>
    );
}
