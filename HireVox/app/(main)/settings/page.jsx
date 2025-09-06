"use client"
import { useState } from 'react'
import { useUser } from '@/app/provider'
import {
  User,
  CreditCard,
  Camera,
  Mail,
  Coins
} from 'lucide-react'

function page() {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'billing', label: 'Credits & Billing', icon: CreditCard }
    ]
    

    const renderProfileTab = () => (
        <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.picture ? (
                                <img src={user.picture} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                            ) : (
                                user?.name?.[0]?.toUpperCase() || "U"
                            )}
                        </div>
                        <button className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors">
                            <Camera className="w-3 h-3" />
                        </button>
                    </div>
                    <div>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                            Upload new picture
                        </button>
                        <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderBillingTab = () => (
        <div className="space-y-6">
            {/* Credits Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Your Credits</h3>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <Coins className="w-5 h-5" />
                        {user?.credits ?? 0} credits
                    </div>
                </div>
                {user?.credits > 0 ? (
                    <p className="text-sm text-gray-600 mt-2">
                        You have {user.credits} credits left to use.
                    </p>
                ) : (
                    <p className="text-sm text-red-600 mt-2">
                        You have no credits left. Please upgrade your plan.
                    </p>
                )}
            </div>

            {/* Subscription Plans */}
            {(!user?.credits || user.credits === 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Basic', price: '$19', credits: 10 },
                        { name: 'Pro', price: '$49', credits: 50 },
                        { name: 'Enterprise', price: '$99', credits: "unlimited" }
                    ].map((plan) => (
                        <div
                            key={plan.name}
                            className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm"
                        >
                            <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</p>
                            <p className="text-sm text-gray-500">{plan.credits} credits</p>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab()
            case 'billing':
                return renderBillingTab()
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-white mt-5 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and credits</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <nav className="space-y-1">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === id
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">{renderTabContent()}</div>
                </div>
            </div>
        </div>
    )
}

export default page