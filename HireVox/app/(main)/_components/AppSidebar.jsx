"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants";
import {
    Mic,
    Plus
} from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from 'lucide-react';
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";





export function AppSidebar() {
    const path = usePathname()
    console.log(path)
    const { user, setUser } = useUser();
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    useEffect(() => {
        // Redirect to /auth if not logged in
        const checkAuth = async () => {
            const { data: { user: supaUser } } = await supabase.auth.getUser();
            if (!supaUser) {
                router.replace('/auth');
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        router.replace('/auth');
        setLoading(false);
    };

    return (
        <Sidebar className="w-64 bg-white border-r border-gray-200">
            <SidebarHeader className="p-6">
                <div className="text-left">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-500 rounded-full p-3 mr-3">
                                <Mic className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800">
                                <span className="text-blue-500">Hire</span>
                                <span className="text-gray-700">Vox</span>
                            </h1>
                        </div>
                    </div>
                    <Link href='/dashboard/create-interview'>
                        <button className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 px-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                            <Plus className="w-5 h-5" />
                            Create New Interview
                        </button>
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup />
                <SidebarContent>
                    <SidebarMenu>
                        {SideBarOptions.map((option, index) => (
                            <SidebarMenuItem key={index} className='p-1'>
                                <SidebarMenuButton asChild className={`p-5 ${path == option.path && 'bg-blue-100'}`}>
                                    <Link href={option.path}>
                                        <option.icon className={`${path == option.path && 'text-primary'}`} />
                                        <span className={`text-[16px] font-medium ${path == option.path && 'text-primary'}`}>{option.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <button
                     onClick={handleLogout}
                    className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 cursor-pointer transition-all font-semibold flex items-center justify-between'
                >
                    Logout
                    <LogOut />
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}