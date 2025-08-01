"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axiosInstance from "@/lib/axios"
import { handleError } from "@/helper/handleError"

const forgotSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
})

type ForgotPasswordFormData = yup.InferType<typeof forgotSchema>

function ForgotPassword() {


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotSchema),
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      axiosInstance.post("/auth/forgot-password", data),
    onSuccess: (res) => {
      toast.success(res.data.message)
    //   router.push('')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      handleError(error)
    },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
