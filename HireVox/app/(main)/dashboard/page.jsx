"use client"
import React, { useEffect } from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { useUser } from '@/app/provider'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { Skeleton } from '@/components/ui/skeleton'

function Dashboard() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="w-32 h-32" />
      </div>
    );
  }

  return (
    <div>
      {/* <WelcomeContainer /> */}
      <div className='flex justify-between items-center my-3'>
        <h2 className='font-bold text-xl'>Dashboard</h2>
        <button
          onClick={handleLogout}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all font-semibold'
        >
          Logout
        </button>
      </div>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard