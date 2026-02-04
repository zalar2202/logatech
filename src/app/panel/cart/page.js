"use client";

import { useEffect, useState } from "react";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
    ShoppingCart,
    Trash2,
    CreditCard,
    ArrowRight,
    Package as PackageIcon,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const fetchCart = async () => {
        try {
            const res = await axios.get("/api/cart");
            setCart(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeLineItem = async (itemId) => {
        try {
            await axios.delete("/api/cart", { data: { itemId } });
            toast.success("Item removed");
            fetchCart();
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const res = await axios.post("/api/cart/checkout");
            if (res.data.success) {
                toast.success("Invoice generated successfully!");
                router.push(`/panel/invoices`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Checkout failed");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((acc, item) => {
            const price = Number(item.package?.price) || 0;
            const quantity = Number(item.quantity) || 1;
            return acc + (price * quantity);
        }, 0);
    };

    if (loading) {
        return (
            <ContentWrapper>
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </ContentWrapper>
        );
    }

    const items = cart?.items || [];

    return (
        <ContentWrapper>
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <ShoppingCart className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                    Shopping Cart
                </h1>
            </div>

            {items.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                        Looks like you haven&apos;t added any services yet. Explore packages to find
                        the perfect fit for your business.
                    </p>
                    <Link href="/panel/shop">
                        <Button icon={<ArrowRight className="w-4 h-4" />}>Go to Shop</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item._id} className="p-0 overflow-hidden">
                                <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-20 h-20 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                                        <PackageIcon size={32} />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <h3 className="text-lg font-bold">
                                                 {item.package?.name || "Premium Package"}
                                             </h3>
                                             <Badge
                                                 variant="primary"
                                                 size="sm"
                                                 className="w-fit mx-auto sm:mx-0"
                                             >
                                                 {item.billingCycle}
                                             </Badge>
                                         </div>
                                         <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1 mb-4">
                                             Professional {item.package?.category || "Tech"} service
                                         </p>
                                         <div className="flex items-center justify-between">
                                             <span className="text-xl font-bold text-indigo-600">
                                                 {item.package?.price ? `$${item.package.price.toLocaleString()}` : item.package?.startingPrice || "$0.00"}
                                             </span>
                                            <button
                                                onClick={() => removeLineItem(item._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[var(--color-text-secondary)]">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-[var(--color-text-primary)]">
                                        ${calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[var(--color-text-secondary)]">
                                    <span>Tax</span>
                                    <span className="font-semibold text-[var(--color-text-primary)]">
                                        $0.00
                                    </span>
                                </div>
                                <div className="h-px bg-[var(--color-border)] my-2" />
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-indigo-600">
                                        ${calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    fullWidth
                                    className="py-4"
                                    onClick={handleCheckout}
                                    loading={checkoutLoading}
                                    icon={<CreditCard className="w-5 h-5" />}
                                >
                                    Proceed to Checkout
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-tertiary)] py-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Secure Checkout & Support Included</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                    <strong>Note:</strong> After checkout, an official invoice will
                                    be generated. You can complete the payment using your preferred
                                    method in the Invoices section.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </ContentWrapper>
    );
}
