/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { handleError } from '@/helper/handleError'
import { useParams } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, Globe, Shield } from "lucide-react"

function AdminViewPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [user, setUser] = React.useState<any>(null)

  const fetchAdmin = React.useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/super-admin/admin/${id}`, { cache: "no-store" })
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchAdmin()
  }, [fetchAdmin])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950">
        <div className="animate-pulse text-gray-400">Loading admin details...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950 text-gray-400">
        No admin found
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 p-6">
      <Card className="w-full max-w-md bg-neutral-900 border border-neutral-800 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-3">
          <Avatar className="h-16 w-16 bg-neutral-800">
            <AvatarFallback className="text-gray-200 bg-neutral-800">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold text-white">{user.name}</CardTitle>
          <span className="text-sm text-gray-400">{user.role}</span>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-300">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            {user.email}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            {user.phoneNumber}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe size={16} className="text-gray-400" />
            {user.country}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield size={16} className="text-gray-400" />
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminViewPage
