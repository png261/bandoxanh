'use client';

import React from 'react';
import { CheckCircleIcon, XIcon } from './Icons';
import { Loader2 } from 'lucide-react';

interface PricingFeature {
    text: string;
    included: boolean;
}

export interface PricingTier {
    id: string;
    name: string;
    price: string;
    period?: string;
    description: string;
    features: PricingFeature[];
    highlighted?: boolean;
    buttonText: string;
    action?: () => void;
    loading?: boolean;
}

interface PricingCardProps {
    tier: PricingTier;
    currentPlan?: string;
    isAuthenticated?: boolean;
}

export default function PricingCard({ tier, currentPlan, isAuthenticated }: PricingCardProps) {
    const isCurrent = currentPlan === tier.id;

    return (
        <div
            className={`relative flex flex-col p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${tier.highlighted
                ? 'bg-brand-green text-white border-2 border-brand-green ring-4 ring-brand-green/20'
                : 'bg-white text-gray-900 border border-gray-100 hover:border-brand-green/50'
                }`}
        >
            {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Best Value
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                </h3>
                <p className={`text-sm ${tier.highlighted ? 'text-green-50' : 'text-gray-500'}`}>
                    {tier.description}
                </p>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline">
                    <span className={`text-4xl font-extrabold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {tier.price}
                    </span>
                    {tier.period && (
                        <span className={`ml-2 text-sm ${tier.highlighted ? 'text-green-100' : 'text-gray-500'}`}>
                            /{tier.period}
                        </span>
                    )}
                </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${feature.included
                            ? (tier.highlighted ? 'bg-white/20 text-white' : 'bg-brand-green/10 text-brand-green')
                            : 'bg-gray-100 text-gray-400'
                            }`}>
                            {feature.included ? (
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                            ) : (
                                <XIcon className="w-3.5 h-3.5" />
                            )}
                        </div>
                        <span className={`text-sm ${tier.highlighted ? 'text-green-50' : 'text-gray-600'
                            } ${!feature.included && 'opacity-60 line-through'}`}>
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            <button
                onClick={tier.action}
                disabled={isCurrent || tier.loading} // Disable if current or loading
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${tier.highlighted
                    ? 'bg-white text-brand-green hover:bg-green-50 focus:ring-2 focus:ring-white/50'
                    : isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900/50'
                    } ${tier.loading ? 'opacity-80 cursor-wait' : ''}`}
            >
                {tier.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : isCurrent ? (
                    'Current Plan'
                ) : (
                    tier.buttonText
                )}
            </button>
        </div>
    );
}
