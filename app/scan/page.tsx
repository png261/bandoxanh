'use client';

import React, { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Recycle, Lightbulb, ChefHat, Upload, Camera, Sparkles, X, ArrowRight, Flame, Activity, Zap, Star } from 'lucide-react';

const tabs = [
    {
        id: 'waste',
        label: 'Phân loại rác',
        icon: Recycle,
        color: 'green',
        description: 'Chụp ảnh rác để biết cách xử lý đúng',
        apiEndpoint: '/api/identify'
    },
    {
        id: 'diy',
        label: 'Ý tưởng DIY',
        icon: Lightbulb,
        color: 'purple',
        description: 'Tìm cách tái chế đồ cũ sáng tạo',
        apiEndpoint: '/api/diy/analyze'
    },
    {
        id: 'food',
        label: 'Gợi ý món ăn',
        icon: ChefHat,
        color: 'orange',
        description: 'Gợi ý công thức từ nguyên liệu của bạn',
        apiEndpoint: '/api/vegetarian/analyze'
    },
    {
        id: 'calories',
        label: 'Đo lượng Calo',
        icon: Flame,
        color: 'red',
        description: 'Phân tích dinh dưỡng từ ảnh món ăn',
        apiEndpoint: '/api/calories/analyze'
    },
] as const;

type TabId = typeof tabs[number]['id'];

const colorClasses = {
    green: {
        bg: 'bg-green-500',
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        hover: 'hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20',
        button: 'bg-green-500 hover:bg-green-600',
        ring: 'ring-green-500/20',
    },
    purple: {
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        hover: 'hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
        button: 'bg-purple-500 hover:bg-purple-600',
        ring: 'ring-purple-500/20',
    },
    orange: {
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        hover: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20',
        button: 'bg-orange-500 hover:bg-orange-600',
        ring: 'ring-orange-500/20',
    },
    red: {
        bg: 'bg-red-500',
        bgLight: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        hover: 'hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
        button: 'bg-red-500 hover:bg-red-600',
        ring: 'ring-red-500/20',
    },
};

// Shared Image Upload Component
function ImageUploader({
    onImageSelect,
    color,
    icon: Icon,
    description
}: {
    onImageSelect: (file: File) => void;
    color: keyof typeof colorClasses;
    icon: React.ElementType;
    description: string;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const colors = colorClasses[color];

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`
                relative overflow-hidden
                border-2 border-dashed ${colors.border} ${colors.hover}
                rounded-3xl p-8 md:p-12 
                text-center cursor-pointer
                transition-all duration-300 ease-out
                group
            `}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-current" />
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-current" />
            </div>

            <div className="relative z-10 space-y-4">
                {/* Icon Container */}
                <div className={`
                    mx-auto w-20 h-20 rounded-2xl 
                    ${colors.bgLight} ${colors.text}
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                `}>
                    <Icon className="w-10 h-10" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <p className="text-gray-900 dark:text-white font-bold text-lg">
                        Nhấn để tải ảnh lên
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-2">
                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-full
                        ${colors.bgLight} ${colors.text}
                        text-sm font-medium
                    `}>
                        <Camera className="w-4 h-4" />
                        Chụp ảnh
                    </div>
                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-full
                        ${colors.bgLight} ${colors.text}
                        text-sm font-medium
                    `}>
                        <Upload className="w-4 h-4" />
                        Tải lên
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageSelect(file);
                }}
                className="hidden"
            />
        </div>
    );
}

// AI Scanner Tool Component  
function AITool({ tab }: { tab: typeof tabs[number] }) {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<{ message: string; isLimitReached?: boolean; isGuest?: boolean } | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const colors = colorClasses[tab.color];

    const handleImageSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
            setResult(null);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(tab.apiEndpoint, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                setResult(data);
                if (data.remaining !== undefined) {
                    setRemaining(data.remaining);
                }
            } else if (response.status === 403 && data.isLimitReached) {
                setError({
                    message: data.error,
                    isLimitReached: true,
                    isGuest: data.isGuest
                });
            } else if (response.status === 503) {
                setError({
                    message: data.error || 'Dịch vụ AI đang bận, vui lòng thử lại sau.'
                });
            } else {
                setError({
                    message: data.error || 'Đã xảy ra lỗi khi phân tích.'
                });
            }
        } catch (error) {
            console.error(error);
            setError({
                message: 'Không thể kết nối đến server. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        setImage(null);
        setFile(null);
        setResult(null);
    };

    return (
        <div className="space-y-6">
            {/* Tool Header */}
            <div className="text-center space-y-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bgLight} ${colors.text} font-bold`}>
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {tab.description}
                </p>
            </div>

            {/* Remaining Usage Indicator */}
            {remaining !== null && remaining > 0 && !error && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Còn <strong className={colors.text}>{remaining}</strong> lượt phân tích hôm nay</span>
                </div>
            )}

            {/* Error / Limit Reached Banner */}
            {error && (
                <div className={`rounded-2xl p-6 ${error.isLimitReached ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                    <div className="flex flex-col items-center text-center space-y-4">
                        {error.isLimitReached ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {error.isGuest ? 'Bạn đã dùng hết lượt miễn phí!' : 'Đã hết lượt phân tích hôm nay!'}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {error.isGuest
                                            ? 'Đăng ký tài khoản miễn phí để có thêm 2 lượt mỗi ngày, hoặc nâng cấp PRO để có 100 lượt!'
                                            : 'Nâng cấp lên gói Chiến Binh để có 100 lượt phân tích mỗi ngày và nhiều quyền lợi khác!'}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    {error.isGuest && (
                                        <Link
                                            href="/sign-up"
                                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Đăng ký miễn phí
                                        </Link>
                                    )}
                                    <Link
                                        href="/pricing"
                                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 dark:shadow-none hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Star className="w-5 h-5" />
                                        Nâng cấp ngay
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Chỉ từ 99k/tháng • Hỗ trợ bảo vệ môi trường 🌱
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">Có lỗi xảy ra</h3>
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error.message}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Upload or Preview */}
            {!image ? (
                <ImageUploader
                    onImageSelect={handleImageSelect}
                    color={tab.color}
                    icon={tab.icon}
                    description={tab.description}
                />
            ) : (
                <div className="space-y-6">
                    {/* Image Preview */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 aspect-video bg-gray-100">
                        <img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />

                        {/* Loading Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className={`w-20 h-20 border-4 border-t-transparent ${colors.border} rounded-full animate-spin`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className={`w-8 h-8 ${colors.text} animate-pulse`} />
                                    </div>
                                </div>
                                <p className="text-white font-bold text-lg mt-4 animate-pulse">
                                    AI đang phân tích...
                                </p>
                            </div>
                        )}

                        {/* Controls */}
                        {!loading && !result && (
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                <button
                                    onClick={handleReset}
                                    className="bg-white/90 backdrop-blur text-gray-900 px-5 py-3 rounded-full font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Chụp lại
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    className={`${colors.button} text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Phân tích
                                </button>
                            </div>
                        )}

                        {/* Result Badge */}
                        {result && (
                            <div className="absolute top-4 right-4">
                                <div className={`${colors.bg} text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2`}>
                                    <Sparkles className="w-4 h-4" />
                                    Đã phân tích
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ResultDisplay result={result} tab={tab} onReset={handleReset} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Result Display Component
function ResultDisplay({ result, tab, onReset }: { result: any; tab: typeof tabs[number]; onReset: () => void }) {
    const colors = colorClasses[tab.color];

    // Waste Classification Result
    if (tab.id === 'waste' && result.waste_type) {
        return (
            <div className="space-y-4">
                <div className={`${colors.bgLight} rounded-2xl p-6 border ${colors.border}`}>
                    <div className="flex items-start gap-4">
                        <div className={`${colors.bg} text-white p-3 rounded-xl`}>
                            <Recycle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold text-xl ${colors.text}`}>{result.waste_type}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{result.description}</p>
                            {result.disposal_method && (
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Cách xử lý:</strong> {result.disposal_method}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={onReset} className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                    Phân tích ảnh khác <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    // DIY Result  
    if (tab.id === 'diy' && result.ideas) {
        return (
            <div className="space-y-4">
                <div className={`${colors.bgLight} rounded-2xl p-4 border ${colors.border}`}>
                    <h4 className={`font-bold ${colors.text} mb-2`}>Nguyên liệu phát hiện:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{result.materials}</p>
                </div>
                <div className="space-y-3">
                    {result.ideas?.map((idea: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{idea.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{idea.description}</p>
                            {idea.steps && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500">{idea.steps}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={onReset} className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                    Tìm ý tưởng khác <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    // Food Result
    if (tab.id === 'food') {
        return (
            <div className="space-y-4">
                {result.ingredients && (
                    <div className={`${colors.bgLight} rounded-2xl p-4 border ${colors.border}`}>
                        <h4 className={`font-bold ${colors.text} mb-2`}>Nguyên liệu phát hiện:</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.ingredients?.map((ing: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium shadow-sm">{ing}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="space-y-3">
                    {result.dishes?.map((dish: any, idx: number) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{dish.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{dish.description}</p>
                            {dish.recipe && <p className="text-xs text-gray-500">{dish.recipe}</p>}
                        </div>
                    ))}
                </div>
                <button onClick={onReset} className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                    Gợi ý món khác <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    // Calorie Result
    if (tab.id === 'calories') {
        return (
            <div className="space-y-6">
                {/* Main Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-red-100 dark:border-gray-700 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>

                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
                        {result.foodName}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium text-sm">
                        {result.portionSize}
                    </p>

                    <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 mb-6 relative">
                        <div className="text-center z-10">
                            <span className="block text-4xl font-black text-red-600 dark:text-red-500">
                                {result.calories}
                            </span>
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Kcal</span>
                        </div>
                        <Flame className="absolute bottom-4 opacity-10 text-red-500 w-20 h-20 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-6">
                        <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1 font-medium">Protein</div>
                            <div className="text-lg font-bold text-blue-600">{result.protein}</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-100 dark:border-gray-700">
                            <div className="text-xs text-gray-400 mb-1 font-medium">Carbs</div>
                            <div className="text-lg font-bold text-yellow-600">{result.carbs}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1 font-medium">Fat</div>
                            <div className="text-lg font-bold text-red-600">{result.fat}</div>
                        </div>
                    </div>
                </div>

                {/* Health Tip */}
                <div className="bg-green-50 dark:bg-gray-800 p-5 rounded-2xl flex items-start gap-4 border border-green-100 dark:border-gray-700">
                    <div className="bg-white p-2 rounded-full shadow-sm text-green-600 flex-shrink-0">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 dark:text-green-400 mb-1 text-sm">Lời khuyên</h4>
                        <p className="text-green-700 dark:text-gray-300 leading-relaxed text-sm">
                            {result.healthTip}
                        </p>
                    </div>
                </div>

                <button onClick={onReset} className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2`}>
                    Phân tích món khác <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return null;
}

export default function AIScannerPage() {
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const [activeTab, setActiveTab] = useState<TabId>(() => {
        if (tabParam && tabs.some(t => t.id === tabParam)) {
            return tabParam as TabId;
        }
        return 'waste';
    });
    const currentTab = tabs.find(t => t.id === activeTab)!;

    // Update URL when tab changes without standard navigation (shallow)
    const handleTabChange = (id: TabId) => {
        setActiveTab(id);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', id);
        window.history.pushState({}, '', url);
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 via-purple-500 to-orange-500 text-white font-bold mb-4">
                    <Sparkles className="w-5 h-5" />
                    Công cụ AI
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    Trợ lý thông minh
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Chụp ảnh và để AI giúp bạn
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 inline-flex gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const colors = colorClasses[tab.color];
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                                    ${isActive
                                        ? `${colors.bgLight} ${colors.text} shadow-md ring-2 ${colors.ring}`
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
                <AITool key={activeTab} tab={currentTab} />
            </div>
        </div>
    );
}
