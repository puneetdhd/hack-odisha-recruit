'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Check, Star } from 'lucide-react'
import React from 'react'
import { useUser } from '@/app/provider'



function page() {

    const { user } = useUser()
    const [loading, setLoading] = useState(true)

    const maxFreeCredits = 3
    const currentCredits = user?.credits || 0

    const usagePercent = (currentCredits / maxFreeCredits) * 100

    const getCreditsColorClass = () => {
        if (currentCredits === 0) return "text-red-500"
        if (currentCredits === 1) return "text-orange-500"
        return "text-blue-500"
    }

    const getUsageBarColorClass = () => {
        if (currentCredits === 0) return "bg-gradient-to-r from-red-500 to-red-600"
        if (currentCredits === 1) return "bg-gradient-to-r from-orange-500 to-orange-600"
        return "bg-gradient-to-r from-blue-500 to-blue-600"
    }

    const getCreditsSubtitle = () => {
        if (currentCredits === 0) return "No credits remaining - Upgrade to continue"
        return currentCredits === 1 ? "credit remaining" : "credits remaining"
    }

    useEffect(() => {
        setLoading(false)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    const plans = [
        {
            name: "Starter",
            price: 19,
            features: ["10 AI interviews", "Basic analytics", "Email support"],
            popular: false,
        },
        {
            name: "Professional",
            price: 49,
            features: [
                "50 AI interviews",
                "Advanced reports",
                "Priority support",
                "Team collaboration",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: 99,
            features: [
                "Unlimited AI interviews",
                "Custom integrations",
                "Dedicated support",
            ],
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">Billing</h1>

                {/* Credits Section */}
                <div className="mb-12">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                            {currentCredits}
                        </div>
                        <div className="text-xl font-semibold text-gray-900 mb-2">
                            Interview Credits
                        </div>
                        <div className={`text-4xl font-bold mb-2 ${getCreditsColorClass()}`}>
                            {currentCredits}
                        </div>
                        <div className="text-gray-500 text-sm mb-4">
                            {getCreditsSubtitle()}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColorClass()}`}
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Show plans only when credits are finished */}
                {currentCredits === 0 && (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Upgrade Plans
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`bg-white rounded-xl p-8 shadow-sm border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative ${plan.popular ? "border-blue-500 border-2" : "border-gray-200"
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-xl font-semibold text-gray-900 mb-2">
                                        {plan.name}
                                    </div>
                                    <div className="text-3xl font-bold text-blue-500 mb-1">
                                        ${plan.price}
                                    </div>
                                    <div className="text-gray-500 text-sm mb-6">per month</div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 text-gray-600"
                                            >
                                                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-blue-500 hover:bg-blue-600 text-white">
                                        Choose {plan.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default page