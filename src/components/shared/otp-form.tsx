/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAuthStore from "@/store/auth.store";
import { Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function InputOTPControlled() {
  const [value, setValue] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuthStore();

  const router = useRouter()

  React.useEffect(() => {
    const storedEndTime = localStorage.getItem('otp-resend-end-time');
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime);
      const currentTime = Date.now();
      const remainingTime = Math.max(0, Math.ceil((endTime - currentTime) / 1000));
      setResendTimer(remainingTime);
    }
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      localStorage.removeItem('otp-resend-end-time');
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async () => {
    if (value.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-center",
        duration: 3000,
        className: "bg-neutral-900 text-white border-neutral-700",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, otp: value }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "OTP verification failed");

      localStorage.removeItem('otp-resend-end-time');
      setResendTimer(0);

      toast.success("OTP verified successfully!", {
        position: "top-center",
        duration: 3000,
        className: "bg-neutral-900 text-green-400 border-neutral-700",
      });
      router.push("/admin/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
        duration: 3000,
        className: "bg-neutral-900 text-white border-neutral-700",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const timerDuration = 120; 
      const endTime = Date.now() + (timerDuration * 1000);
      localStorage.setItem('otp-resend-end-time', endTime.toString());
      setResendTimer(timerDuration);

      const res = await fetch("/api/admin/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Error while send otp");
      
      toast.info("New OTP sent to your email", {
        position: "top-center",
        duration: 3000,
        className: "bg-neutral-900 text-white border-neutral-700",
      });
    } catch (error: any) {
      localStorage.removeItem('otp-resend-end-time');
      setResendTimer(0);
      
      toast.error(error.message || "Failed to resend OTP", {
        position: "top-center",
        duration: 3000,
        className: "bg-neutral-900 text-white border-neutral-700",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 mx-auto max-w-md p-8 bg-neutral-900 rounded-2xl shadow-xl border border-neutral-700"
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <Mail className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-100">
          Verify Your Identity
        </h2>
        <p className="text-neutral-400 text-sm max-w-xs">
          Enter the 6-digit code sent to <span className="font-medium text-white">{user?.email || "your email"}</span>
        </p>
      </div>

      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        className="justify-center gap-2"
      >
        <InputOTPGroup className="gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className={cn(
                "w-12 h-12 text-lg font-medium rounded-lg border-2 bg-neutral-800 text-white transition-all duration-200",
                value[i] ? "border-white" : "border-neutral-600"
              )}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button
        disabled={value.length !== 6 || isLoading}
        onClick={handleSubmit}
        className="w-full h-12 text-base "
        variant={"outline"}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            Verifying...
          </div>
        ) : (
          "Verify OTP"
        )}
      </Button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-neutral-400 text-center"
      >
        {value ? (
          <>
            You entered: <span className="font-medium text-white">{value}</span>
          </>
        ) : (
          <>Enter the 6-digit code to proceed</>
        )}
      </motion.div>

      <div className="text-center space-y-2">
        <Button
          variant="link"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-sm font-medium text-white hover:text-white"
        >
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : "Resend OTP"}
        </Button>
        {resendTimer > 0 && (
          <div className="text-xs text-neutral-500">
            New code can be requested after timer expires
          </div>
        )}
      </div>
    </motion.div>
  );
}