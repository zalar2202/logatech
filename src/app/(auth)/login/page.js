"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { InputField } from "@/components/forms/InputField";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, loginInitialValues } from "@/schemas/auth.schema";
import { LogIn, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState("");

    const handleSubmit = async (values, { setSubmitting }) => {
        setError("");

        try {
            const result = await login(values.email, values.password);

            if (result.success) {
                toast.success("Login successful! Welcome back.");

                // Check if there's a redirect path
                const redirectPath = sessionStorage.getItem("redirect_after_login");

                if (redirectPath) {
                    sessionStorage.removeItem("redirect_after_login");
                    router.push(redirectPath);
                } else {
                    router.push("/panel/dashboard");
                }
            } else {
                setError(result.message || "Login failed. Please try again.");
                toast.error(result.message || "Login failed");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            toast.error("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="hidden md:block">
                    <div className="text-center md:text-left">
                        <div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                            style={{ backgroundColor: "var(--color-primary)" }}
                        >
                            <Shield size={40} style={{ color: "white" }} />
                        </div>

                        <h1
                            className="text-4xl font-bold mb-4"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            LogaTech Admin Panel
                        </h1>

                        <p
                            className="text-lg mb-8"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Secure authentication with httpOnly cookies. Manage your business with
                            confidence.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: "🔒", title: "Secure", desc: "XSS & CSRF protected" },
                                { icon: "⚡", title: "Fast", desc: "Optimized performance" },
                                {
                                    icon: "🎨",
                                    title: "Modern",
                                    desc: "Beautiful UI with dark mode",
                                },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-3xl">{feature.icon}</span>
                                    <div>
                                        <p
                                            className="font-semibold"
                                            style={{ color: "var(--color-text-primary)" }}
                                        >
                                            {feature.title}
                                        </p>
                                        <p
                                            className="text-sm"
                                            style={{ color: "var(--color-text-secondary)" }}
                                        >
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <Card className="w-full">
                    <div className="p-8">
                        {/* Mobile Logo */}
                        <div className="md:hidden text-center mb-6">
                            <div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
                                style={{ backgroundColor: "var(--color-primary)" }}
                            >
                                <Shield size={32} style={{ color: "white" }} />
                            </div>
                            <h2
                                className="text-2xl font-bold"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                LogaTech Admin
                            </h2>
                        </div>

                        <h2
                            className="text-2xl font-bold mb-2 hidden md:block"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Welcome Back
                        </h2>

                        <p
                            className="mb-6 hidden md:block"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Sign in to your admin account
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="mb-6 p-4 rounded-lg flex items-start gap-3"
                                style={{
                                    backgroundColor: "var(--color-error-light)",
                                    borderLeft: "4px solid var(--color-error)",
                                }}
                            >
                                <AlertCircle
                                    size={20}
                                    style={{ color: "var(--color-error)" }}
                                    className="flex-shrink-0 mt-0.5"
                                />
                                <p className="text-sm" style={{ color: "var(--color-error)" }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        <Formik
                            initialValues={loginInitialValues}
                            validationSchema={loginSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-6">
                                    <InputField
                                        name="email"
                                        type="email"
                                        label="Email Address"
                                        placeholder="admin@logatech.net"
                                        autoComplete="email"
                                    />

                                    <InputField
                                        name="password"
                                        type="password"
                                        label="Password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                        fullWidth
                                        size="lg"
                                    >
                                        {!isSubmitting && <LogIn className="mr-2" size={20} />}
                                        {isSubmitting ? "Signing in..." : "Sign In"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        {/* Security Note */}
                        <div className="mt-6 text-center">
                            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                🔒 Secured with httpOnly cookies
                                <br />
                                Protected against XSS and CSRF attacks
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
