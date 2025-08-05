/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm, UseFormRegister, Path, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleError } from "@/helper/handleError";

// ✅ ShadCN Select
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ✅ Import world-countries
import countries from "world-countries";
import useAuthStore from "@/store/auth.store";

const formattedCountries = countries.map((country) => ({
    label: country.name.common,
    value: country.cca2,
    flag: country.flag,
}));

const schema = yup.object({
    name: yup.string().required("Name is required").min(3, "Minimum 3 characters"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
    country: yup.string().required("Country is required"),
    password: yup.string().required("Password is required").min(6, "Minimum 6 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

type FormData = yup.InferType<typeof schema>;

export default function AdminSignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {setUser} = useAuthStore()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...submitData } = data;
            const res = await fetch("/api/admin/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Signup failed");

            reset();
            toast.success(result.message, { position: "top-center" });
            setUser(result?.user)
            router.push("/verify-email");
        } catch (error: any) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden w-full mx-auto bg-background text-foreground">
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Create Admin Account</h1>
                        <p className="text-sm text-muted-foreground">
                            Fill the form below to get started
                        </p>
                    </div>

                    <div className="space-y-4 grid grid-cols-1 gap-2.5">
                        <FormField
                            name="name"
                            label="Full Name"
                            placeholder="Enter your full name"
                            register={register}
                            error={errors.name?.message}
                        />
                        <FormField
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            register={register}
                            error={errors.email?.message}
                        />
                        <FormField
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="+1234567890"
                            register={register}
                            error={errors.phoneNumber?.message}
                        />

                        {/* ✅ Country Dropdown with ShadCN Select */}
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium">
                                Country
                            </Label>
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger
                                            className={cn(
                                                "w-full bg-background text-foreground border rounded-md p-2",
                                                errors.country && "border-destructive"
                                            )}
                                        >
                                            <SelectValue placeholder="Select your country" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background text-foreground max-h-64 overflow-y-auto">
                                            {formattedCountries.map((c) => (
                                                <SelectItem key={c.value} value={c.label}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{c.flag}</span>
                                                        <span>{c.label}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.country && (
                                <p className="text-sm text-destructive">{errors.country.message}</p>
                            )}
                        </div>

                        <FormField
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            register={register}
                            error={errors.password?.message}
                            icon={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
                        />
                        <FormField
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            register={register}
                            error={errors.confirmPassword?.message}
                            icon={<PasswordToggle visible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <>
                                <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                            Sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

interface FormFieldProps<T extends Record<string, any>> {
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
    register: UseFormRegister<T>;
    autoComplete?: string;
}

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
                        "pr-10 bg-background text-foreground",
                        error && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register(name)}
                />
                {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{icon}</div>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground focus:outline-none"
        >
            <Icon icon={visible ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="h-4 w-4" />
        </button>
    );
}
