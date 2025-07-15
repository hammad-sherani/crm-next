"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/lib/axios"

export default function InputOTPControlled({
  handleOTPSubmit,
  isLoading,
  email,
  type = "verify-email"
}: {
  handleOTPSubmit: (otp: string) => void
  isLoading: boolean
  email: string
    type: string
}) {
  const [value, setValue] = React.useState("")
  const [resendTimer, setResendTimer] = React.useState(120)

  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get(`/auth/resend-otp?email=${email}&type=${type}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("OTP has been resent successfully", {
        position: "top-center",
      })
      setResendTimer(120) 
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to resend OTP",
        { position: "top-center" }
      )
    },
  })

  const handleSubmit = () => {
    if (value.length === 6) {
      handleOTPSubmit(value)
    } else {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-center",
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto mt-14 px-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold">Verify Your Identity</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code sent to your email or phone number.
        </p>
      </div>

      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        className="justify-center"
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        disabled={value.length !== 6 || isLoading}
        onClick={handleSubmit}
        className="w-full"
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        {value ? (
          <>You entered: <span className="font-medium">{value}</span></>
        ) : (
          <>Awaiting input…</>
        )}
      </div>

      <div className="text-center space-y-1">
        <Button
          variant="link"
          onClick={() => resendOtpMutation.mutate()}
          disabled={resendTimer > 0 || resendOtpMutation.isLoading}
          className="text-sm"
        >
          {resendOtpMutation.isLoading
            ? "Resending..."
            : resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : "Resend OTP"}
        </Button>
      </div>
    </div>
  )
}
