'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import { Check, Star, Zap, Building2, Leaf } from 'lucide-react';

export default function PricingPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const { isCollapsed: isSidebarCollapsed, setCollapsed: setIsSidebarCollapsed } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const [subscription, setSubscription] = useState<any>(null);
    const [loadingSubscription, setLoadingSubscription] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            const fetchSubscription = async () => {
                try {
                    setLoadingSubscription(true);
                    const res = await fetch('/api/polar/subscription');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.hasSubscription) {
                            setSubscription(data.subscription);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching subscription', error);
                } finally {
                    setLoadingSubscription(false);
                }
            };
            fetchSubscription();
        }
    }, [isSignedIn]);

    const handleCancel = async (subscriptionId: string) => {
        if (!confirm('Bạn có chắc chắn muốn huỷ đăng ký? Quyền lợi sẽ được giữ đến hết chu kỳ hiện tại.')) return;

        try {
            setLoadingPlan('CANCEL');
            const res = await fetch('/api/polar/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cancel', subscriptionId })
            });

            if (res.ok) {
                toast.success('Đã huỷ gia hạn thành công');
                // Refresh subscription state
                const fetchRes = await fetch('/api/polar/subscription');
                if (fetchRes.ok) {
                    const data = await fetchRes.json();
                    if (data.hasSubscription) {
                        setSubscription(data.subscription);
                    }
                }
            } else {
                toast.error('Không thể huỷ đăng ký');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoadingPlan(null);
        }
    };

    // Use metadata if available, else assume FREE
    const currentPlan = (user?.publicMetadata?.plan as string) || 'FREE';
    const polarProProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;

    const handleUpgrade = async (planId: string) => {
        if (!isSignedIn) {
            openSignIn({ afterSignInUrl: '/pricing' });
            return;
        }

        if (planId === 'ENTERPRISE') {
            toast.success("Chúng tôi sẽ liên hệ sớm!");
            return;
        }

        if (!polarProProductId) {
            toast.error("Chưa cấu hình thanh toán (Missing Product ID)");
            return;
        }

        try {
            setLoadingPlan(planId);
            const response = await fetch('/api/polar/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: polarProProductId }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Không thể khởi tạo thanh toán");
            }

        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoadingPlan(null);
        }
    };

    const tiers = [
        {
            id: 'FREE',
            name: 'Khởi Đầu',
            price: '0đ',
            period: '/mãi mãi',
            description: 'Bắt đầu hành trình xanh của bạn.',
            icon: <Leaf className="w-8 h-8 text-brand-green" />,
            color: 'border-brand-green/20 bg-green-50/50 dark:bg-green-900/10',
            buttonColor: 'bg-brand-green',
            features: [
                'Truy cập Bản đồ xanh',
                '2 lần phân tích rác/ngày',
                'Hướng dẫn tái chế cơ bản',
                'Tham gia cộng đồng',
            ],
            unavailable: [
                'Phân tích năng cao',
                'Hỗ trợ ưu tiên',
            ]
        },
        {
            id: 'PRO',
            name: 'Chiến Binh',
            price: '99k',
            period: '/tháng',
            description: 'Dành cho người cam kết bảo vệ môi trường.',
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            color: 'border-yellow-500/30 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-xl scale-105 border-2',
            buttonColor: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none',
            highlight: true,
            features: [
                'Mọi quyền lợi miễn phí',
                '100 lần phân tích rác/ngày',
                'Phân tích chi tiết & DIY',
                'Huy hiệu "Chiến Binh Xanh"',
                'Đóng góp quỹ làm sạch biển',
            ],
            unavailable: []
        },
        {
            id: 'ENTERPRISE',
            name: 'Tổ Chức',
            price: 'Liên hệ',
            period: '',
            description: 'Giải pháp cho trường học & công ty.',
            icon: <Building2 className="w-8 h-8 text-blue-500" />,
            color: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10',
            buttonColor: 'bg-blue-600',
            features: [
                'Không giới hạn quyền truy cập',
                'Tổ chức chiến dịch riêng',
                'Dashboard quản lý cho tổ chức',
                'Hỗ trợ 24/7',
            ],
            unavailable: []
        },
    ];

    return (
        <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                isCollapsed={isSidebarCollapsed}
                setCollapsed={setIsSidebarCollapsed}
            />

            <div className={`pt-24 pb-20 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
                <div className="container mx-auto px-4 max-w-6xl">

                    {/* Page Header */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm mb-4">
                            GÓI THÀNH VIÊN
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            Đầu tư cho <span className="text-brand-green">Tương Lai Xanh</span> 🌏
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                            Nâng cấp để mở khóa toàn bộ sức mạnh AI và đóng góp trực tiếp vào các dự án làm sạch môi trường.
                        </p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative rounded-[2.5rem] p-8 transition-transform duration-300 hover:-translate-y-2 ${tier.color} ${tier.highlight ? 'z-10 ring-4 ring-yellow-500/20 dark:ring-yellow-500/10' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}
                            >
                                {tier.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-current" />
                                        PHỔ BIẾN NHẤT
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm`}>
                                        {tier.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
                                        <p className="text-gray-500 text-sm">{tier.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-baseline mb-8">
                                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{tier.price}</span>
                                    <span className="text-gray-500 font-medium ml-2">{tier.period}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        if (tier.id === 'FREE' && isSignedIn) return;
                                        if (tier.id === 'PRO' && currentPlan === 'PRO' && subscription) {
                                            if (!subscription.cancelAtPeriodEnd) {
                                                handleCancel(subscription.id);
                                            }
                                            return;
                                        }
                                        if (tier.id === 'FREE') openSignIn();
                                        else handleUpgrade(tier.id);
                                    }}
                                    disabled={(tier.id === 'FREE' && isSignedIn) || (tier.id === 'PRO' && currentPlan === 'PRO' && subscription?.cancelAtPeriodEnd) || loadingPlan !== null}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 mb-8 flex items-center justify-center gap-2 ${tier.id === 'FREE' && isSignedIn
                                            ? 'bg-gray-100 text-gray-400 cursor-default'
                                            : (tier.id === 'PRO' && currentPlan === 'PRO'
                                                ? (subscription?.cancelAtPeriodEnd ? 'bg-gray-100 text-gray-500 cursor-default' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100')
                                                : `${tier.buttonColor} text-white hover:brightness-110 shadow-lg`)
                                        }`}
                                >
                                    {tier.highlight && loadingPlan === tier.id && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {loadingPlan === 'CANCEL' && tier.id === 'PRO' ? 'Đang xử lý...' :
                                        (tier.id === 'FREE' && isSignedIn ? 'Đang sử dụng' :
                                            (tier.id === 'PRO' && currentPlan === 'PRO' ? (subscription?.cancelAtPeriodEnd ? 'Đã huỷ gia hạn' : 'Huỷ đăng ký') : 'Chọn gói này')
                                        )}
                                </button>

                                <div className="space-y-4">
                                    {tier.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{feature}</span>
                                        </div>
                                    ))}
                                    {tier.unavailable.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 opacity-50">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xm font-bold">×</span>
                                            </div>
                                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
