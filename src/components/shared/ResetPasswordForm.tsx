/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axiosInstance from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { handleError } from "@/helper/handleError"
import { useRouter, useSearchParams } from "next/navigation"

// 🧠 Validation schema
const resetPasswordSchema = yup.object({
  newPassword: yup.string()
    .min(6, "Minimum 6 characters")
    .required("New password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
})

type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const params =  useSearchParams()
  const token = params.get("token") 
  if (token) {
    console.log("Reset Password Token:", token);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: { token: string | null; newPassword: string }) => axiosInstance.post("/auth/reset-password", data),
    onSuccess: (res) => {
      toast.success(res.data.message, {
        position: "top-center",
        duration: 3000,
      })

      router.push("/login")
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const onSubmit = (data: ResetPasswordFormData) => {
    const { confirmPassword, ...resetData } = data

    mutation.mutate({
      token: token,
      newPassword: data.newPassword,
    })
  }


  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please enter and confirm your new password.
          </p>
          {/* {token} */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
