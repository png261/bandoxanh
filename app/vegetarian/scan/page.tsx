'use client';

import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, Sparkles, ChefHat } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Dish {
    name: string;
    description: string;
    recipe: string;
}

interface AnalysisResult {
    ingredients: string[];
    dishes: Dish[];
}

export default function VegetarianScanPage() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image too large (max 5MB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null); // Reset previous result
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image || !fileInputRef.current?.files?.[0]) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', fileInputRef.current.files[0]);

        try {
            const response = await fetch('/api/vegetarian/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.isLimitReached) {
                    toast.error(data.error);
                    // Optional: Redirect to pricing
                } else {
                    throw new Error(data.error || 'Failed to analyze');
                }
                return;
            }

            setResult(data);
            toast.success('Analysis complete!');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2 flex items-center justify-center gap-3">
                        <ChefHat className="text-brand-green w-10 h-10" />
                        Vegetarian Chef AI
                    </h1>
                    <p className="text-lg text-gray-600">
                        Upload a photo of your ingredients to get instant recipe suggestions.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8">

                        {/* Upload Area */}
                        <div className="mb-8">
                            {!image ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-brand-green hover:bg-green-50 transition-colors cursor-pointer"
                                >
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-sm text-gray-500">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-6">
                                    <Image
                                        src={image}
                                        alt="Uploaded ingredients"
                                        fill
                                        className="object-contain"
                                    />
                                    <button
                                        onClick={() => { setImage(null); setResult(null); }}
                                        className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-700 transition-colors"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Action Button */}
                        {image && !result && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-4 bg-brand-green text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Analyzing Ingredients...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Suggest Recipes
                                    </>
                                )}
                            </button>
                        )}

                        {/* Results */}
                        {result && (
                            <div className="mt-10 animate-fade-in">
                                <div className="bg-green-50 rounded-2xl p-6 mb-8">
                                    <h3 className="text-sm font-bold text-brand-green uppercase tracking-wide mb-3">Detected Ingredients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.ingredients.map((ing, i) => (
                                            <span key={i} className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm shadow-sm border border-green-100">
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Dishes</h2>
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {result.dishes.map((dish, idx) => (
                                        <div key={idx} className="h-full">
                                            {/* Map API result to RecipeCard props */}
                                            <RecipeCard item={{
                                                id: `ai-${idx}`,
                                                name: dish.name,
                                                description: dish.description,
                                                recipe: dish.recipe,
                                                tags: ['AI Generated', 'Custom']
                                            }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
