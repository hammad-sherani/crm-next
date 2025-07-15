"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm, UseFormRegister, Path } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "@/lib/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useAuthStore from "@/store/auth.store"

const schema = yup.object({
    username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
})

type FormData = yup.InferType<typeof schema>

interface SignUpFormProps extends React.ComponentProps<"div"> {
    onSuccess?: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
}

export default function SignUpForm({
    className,
    onSuccess,
    onError,
    ...props
}: SignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()


    const {setUser}  = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    })

    const mutation = useMutation({
        mutationFn: (data: FormData) => axios.post("/auth/signup", data),
        onSuccess: (response) => {
            console.log("User signed up successfully", response)
            reset()
            onSuccess?.()
            setUser(response.data.user)
            router.push(`/verify-email?type=verify-email`)
            toast.success("Account created successfully! Please check your email to verify your account.", {
                position: "top-center",
                duration: 3000,
            })            
        },
        onError: (error) => {
            console.error("Signup failed", error)
            onError?.(error)
            toast.error("Failed to create account. Please try again.", {
                position: "top-center",
                duration: 3000,
            })
        },
    })

    const onSubmit = (data: FormData) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...submitData } = data
        mutation.mutate(submitData as FormData)
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                                <div className="space-y-2 text-center">
                                    <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Fill the form below to get started
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        name="username"
                                        label="Username"
                                        placeholder="Enter your username"
                                        register={register}
                                        error={errors.username?.message}
                                        autoComplete="username"
                                    />

                                    <FormField
                                        name="email"
                                        label="Email"
                                        type="email"
                                        placeholder="Enter your email"
                                        register={register}
                                        error={errors.email?.message}
                                        autoComplete="email"
                                    />

                                    <FormField
                                        name="password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        register={register}
                                        error={errors.password?.message}
                                        autoComplete="new-password"
                                        icon={
                                            <PasswordToggle
                                                visible={showPassword}
                                                onToggle={() => setShowPassword(!showPassword)}
                                            />
                                        }
                                    />

                                    <FormField
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        register={register}
                                        error={errors.confirmPassword?.message}
                                        autoComplete="new-password"
                                        icon={
                                            <PasswordToggle
                                                visible={showConfirmPassword}
                                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                            />
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={mutation.isPending}
                                    size="lg"
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create account"
                                    )}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

// Properly typed FormField component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormFieldProps<T extends Record<string, any>> {
    name: Path<T>
    label: string
    type?: string
    placeholder?: string
    error?: string
    icon?: React.ReactNode
    register: UseFormRegister<T>
    autoComplete?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormField<T extends Record<string, any>>({
    name,
    label,
    type = "text",
    placeholder,
    error,
    register,
    icon,
    autoComplete,
}: FormFieldProps<T>) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={cn(
                        "pr-10",
                        error && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register(name)}
                />
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

interface PasswordToggleProps {
    visible: boolean
    onToggle: () => void
}

function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
        >
            <Icon
                icon={visible ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                className="h-4 w-4"
            />
        </button>
    )
}