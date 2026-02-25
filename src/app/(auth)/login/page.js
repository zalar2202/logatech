"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import { InputField } from "@/components/forms/InputField";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, loginInitialValues, signupSchema, signupInitialValues } from "@/schemas/auth.schema";
import { LogIn, UserPlus, AlertCircle, ArrowLeft, Wand2, Chrome, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Captcha } from "@/components/forms/Captcha";
import "@/styles/auth-sliding.css";

export default function UnifiedAuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    
    // Auth State
    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");
    const [isLoginCaptchaSolved, setIsLoginCaptchaSolved] = useState(false);
    const [isSignupCaptchaSolved, setIsSignupCaptchaSolved] = useState(false);
    const [loginCaptchaError, setLoginCaptchaError] = useState("");
    const [signupCaptchaError, setSignupCaptchaError] = useState("");

    useEffect(() => {
        const mode = searchParams.get("mode");
        if (mode === "signup") {
            setIsRightPanelActive(true);
        }
        
        // Check for general error in URL
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setLoginError(errorParam);
            toast.error(errorParam);
        }
    }, [searchParams]);

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        setLoginError("");
        setLoginCaptchaError("");

        if (!isLoginCaptchaSolved) {
            setLoginCaptchaError("Please solve the security check correctly.");
            setSubmitting(false);
            return;
        }

        try {
            const result = await login(values.email, values.password);

            if (result.success) {
                toast.success("Login successful! Welcome back.");
                const redirectPath = sessionStorage.getItem("redirect_after_login");
                if (redirectPath) {
                    sessionStorage.removeItem("redirect_after_login");
                    router.push(redirectPath);
                } else {
                    router.push("/panel/dashboard");
                }
            } else {
                setLoginError(result.message || "Login failed. Please try again.");
                toast.error(result.message || "Login failed");
            }
        } catch (err) {
            setLoginError("An unexpected error occurred. Please try again.");
            toast.error("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignupSubmit = async (values, { setSubmitting }) => {
        setSignupError("");
        setSignupCaptchaError("");

        if (!isSignupCaptchaSolved) {
            setSignupCaptchaError("Please solve the security check correctly.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post("/api/auth/signup", {
                name: values.name,
                email: values.email,
                password: values.password,
            });

            if (response.data.success) {
                toast.success("Account created successfully! Welcome.");
                router.push("/panel/dashboard");
            } else {
                setSignupError(response.data.message || "Signup failed. Please try again.");
                toast.error(response.data.message || "Signup failed");
            }
        } catch (err) {
            const message = err.response?.data?.message || "An unexpected error occurred. Please try again.";
            setSignupError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const generatePassword = (setFieldValue) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFieldValue("password", password);
        setFieldValue("confirmPassword", password);
        toast.info("Secure password generated!");
    };

    return (
        <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
            {/* Sign Up Form */}
            <div className="auth-form-container sign-up-container">
                <div className="auth-form">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <div className="social-container">
                        <div className="social inactive" title="Facebook Login (Inactive)">
                            <Facebook size={20} />
                        </div>
                        <div 
                            className="social active" 
                            title="Continue with Google"
                            onClick={() => (window.location.href = "/api/auth/google")}
                        >
                            <Chrome size={20} className="text-blue-600" />
                        </div>
                        <div className="social inactive" title="LinkedIn Login (Inactive)">
                            <Linkedin size={20} />
                        </div>
                    </div>
                    <span>or use your email for registration</span>
                    
                    {signupError && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                            <AlertCircle size={14} />
                            {signupError}
                        </div>
                    )}

                    <Formik
                        initialValues={signupInitialValues}
                        validationSchema={signupSchema}
                        onSubmit={handleSignupSubmit}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="w-full space-y-3 mt-4">
                                <InputField
                                    name="name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    className="!my-1"
                                />
                                <InputField
                                    name="email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    className="!my-1"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        name="password"
                                        type="password"
                                        label="Password"
                                        placeholder="••••••••"
                                        className="!my-1"
                                        action={
                                            <button
                                                type="button"
                                                onClick={() => generatePassword(setFieldValue)}
                                                className="text-[10px] font-bold text-primary hover:underline flex items-center"
                                            >
                                                <Wand2 size={10} className="mr-1" />
                                                Auto
                                            </button>
                                        }
                                    />
                                    <InputField
                                        name="confirmPassword"
                                        type="password"
                                        label="Confirm"
                                        placeholder="••••••••"
                                        className="!my-1"
                                        action={
                                            <button
                                                type="button"
                                                className="invisible text-[10px] font-bold text-primary flex items-center pointer-events-none"
                                            >
                                                <Wand2 size={10} className="mr-1" />
                                                Auto
                                            </button>
                                        }
                                    />
                                </div>
                                <Captcha
                                    error={signupCaptchaError}
                                    onVerify={(solved) => {
                                        setIsSignupCaptchaSolved(solved);
                                        if (solved) setSignupCaptchaError("");
                                    }}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    fullWidth
                                    className="mt-4"
                                >
                                    SIGN UP
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    
                    <button 
                        className="md:hidden mt-4 text-xs font-bold"
                        onClick={() => setIsRightPanelActive(false)}
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </div>

            {/* Sign In Form */}
            <div className="auth-form-container sign-in-container">
                <div className="auth-form">
                    <h1 className="text-2xl font-bold">LogaTech Panel</h1>
                    <div className="social-container">
                        <div className="social inactive" title="Facebook Login (Inactive)">
                            <Facebook size={20} />
                        </div>
                        <div 
                            className="social active" 
                            title="Continue with Google"
                            onClick={() => (window.location.href = "/api/auth/google")}
                        >
                            <Chrome size={20} className="text-blue-600" />
                        </div>
                        <div className="social inactive" title="LinkedIn Login (Inactive)">
                            <Linkedin size={20} />
                        </div>
                    </div>
                    <span>Welcome back!</span>
                    
                    {loginError && (
                        <div className="flex items-center gap-2 text-red-500 text-xs mt-2">
                            <AlertCircle size={14} />
                            {loginError}
                        </div>
                    )}

                    <Formik
                        initialValues={loginInitialValues}
                        validationSchema={loginSchema}
                        onSubmit={handleLoginSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="w-full space-y-4 mt-6">
                                <InputField
                                    name="email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="Enter your email"
                                />
                                <InputField
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                />
                                <Captcha
                                    error={loginCaptchaError}
                                    onVerify={(solved) => {
                                        setIsLoginCaptchaSolved(solved);
                                        if (solved) setLoginCaptchaError("");
                                    }}
                                />
                                <a href="#" className="text-xs hover:underline block text-center">Forgot your password?</a>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    fullWidth
                                >
                                    SIGN IN
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    
                    <button 
                        className="md:hidden mt-4 text-xs font-bold"
                        onClick={() => setIsRightPanelActive(true)}
                    >
                        Don&apos;t have an account? Sign Up
                    </button>
                </div>
            </div>

            {/* Overlay Panels */}
            <div className="auth-overlay-container">
                <div className="auth-overlay">
                    <div className="auth-overlay-panel auth-overlay-left">
                        <h1 className="text-3xl font-bold">Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button 
                            className="px-10 py-3 border-2 border-white rounded-full bg-transparent text-white font-bold uppercase tracking-widest transition-transform active:scale-95 focus:outline-none"
                            onClick={() => setIsRightPanelActive(false)}
                        >
                            SIGN IN
                        </button>
                    </div>
                    <div className="auth-overlay-panel auth-overlay-right">
                        <h1 className="text-3xl font-bold text-white">LogaTech Panel</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button 
                            className="px-10 py-3 border-2 border-white rounded-full bg-transparent text-white font-bold uppercase tracking-widest transition-transform active:scale-95 focus:outline-none"
                            onClick={() => setIsRightPanelActive(true)}
                        >
                            SIGN UP
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Homepage Link */}
            <Link 
                href="/"
                className="absolute top-4 left-4 z-[200] flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
            >
                <ArrowLeft size={14} />
                HOME
            </Link>
        </div>
    );
}