"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import InputOTPControlled from "@/components/shared/otp-form"
import axiosInstance from "@/lib/axios"
import { handleError } from "@/helper/handleError"
import useAuthStore from "@/store/auth.store"

const VERIFICATION_TYPE = new URLSearchParams(window.location.search).get("type") || "verify-email"
export default function VerifyEmail() {
  const router = useRouter()

  const {user} = useAuthStore()

  console.log("User in VerifyEmail:", user);
  

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { otp: string; email: string; type: string }) =>
      axiosInstance.post( "/auth/verify-otp", data),
    onSuccess: () => {
      toast.success("Email verified successfully!", {
        position: "top-center",
        duration: 3000,
      })
      router.push("/dashboard")
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const handleOTPSubmit = (otp: string) => {
    mutate({
      otp,
      email: user?.email || "",
      type: VERIFICATION_TYPE,
    })

  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <InputOTPControlled
        handleOTPSubmit={handleOTPSubmit}
        isLoading={isPending}
        email={user?.email || ""}
        type={VERIFICATION_TYPE}
      />
    </div>
  )
}
