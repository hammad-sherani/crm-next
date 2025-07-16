"use client";

import axiosInstance from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"

function UserDashboardLayout({ children }: { children: React.ReactNode }) {
      const router = useRouter()

    const { data, isLoading, error } = useQuery({
        queryKey: ["auth-check"],
        queryFn: async () => {
            const res = await axiosInstance.get("/auth/check-auth")
            return res.data
        },
        retry: false,
    })


    useEffect(() => {
        if (error || data?.success === false) {
            router.replace("/login") 
        }
    }, [data, error, router])

    if (isLoading) return <div className="p-6 text-center">Checking authentication...</div>
    return (
        <div>
            {children}
        </div>
    )
}

export default UserDashboardLayout
