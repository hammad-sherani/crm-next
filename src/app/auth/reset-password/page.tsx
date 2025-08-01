import ResetPasswordForm from "@/components/shared/ResetPasswordForm"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
