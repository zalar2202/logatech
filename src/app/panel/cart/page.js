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
    Tag,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const isAdmin = currentUser && ['admin', 'manager'].includes(currentUser.role);
    
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [exchangeRate, setExchangeRate] = useState(1);

    const [promoCode, setPromoCode] = useState("");
    const [applyingPromo, setApplyingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState(null);
    const searchParams = useSearchParams();
    const promoFromUrl = searchParams.get("promo");

    const fetchCart = async () => {
        try {
            const res = await axios.get("/api/cart");
            setCart(res.data.data);
            const currency = res.data.data?.currency || 'USD';
            setSelectedCurrency(currency);
            
            // Get rate for saved currency
            if (currency !== 'USD') {
                updateExchangeRate(currency);
            } else {
                setExchangeRate(1);
            }

            if (res.data.data?.appliedPromotion) {
                handleApplyPromoOnMount(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };

    const updateExchangeRate = async (currency) => {
        if (currency === 'USD') {
            setExchangeRate(1);
            return;
        }
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
            const data = await response.json();
            const rate = data.rates[currency];
            setExchangeRate(rate || 1);
        } catch (error) {
            console.error("Failed to fetch rate", error);
            const fallbacks = { 'EUR': 0.92, 'CAD': 1.39, 'TRY': 33.5, 'AED': 3.67, 'USD': 1.0 };
            setExchangeRate(fallbacks[currency] || 1);
        }
    };

    const handleCurrencyChange = async (e) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);
        updateExchangeRate(newCurrency);
        
        try {
            await axios.put('/api/cart', { currency: newCurrency });
            toast.success(`Currency changed to ${newCurrency}`);
        } catch (error) {
            toast.error('Failed to update currency');
        }
    };

    const calculateSubtotal = () => {
        if (!cart || !cart.items) return 0;
        const subtotalUSD = cart.items.reduce((acc, item) => {
            const price = Number(item.package?.price) || 0;
            const quantity = Number(item.quantity) || 1;
            return acc + (price * quantity);
        }, 0);
        
        return subtotalUSD * exchangeRate;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        let discount = 0;
        if (appliedPromo) {
             discount = appliedPromo.discountAmount * exchangeRate;
        }
        return Math.max(0, subtotal - discount);
    };

    const fetchClientsList = async () => {
        if (!isAdmin) return;
        try {
            const { data } = await axios.get("/api/clients");
            if (data.success) setClients(data.data || []);
        } catch (err) {
            console.error("Failed to fetch clients");
        }
    };

    useEffect(() => {
        fetchCart();
        fetchClientsList();
    }, [isAdmin]);

    // Handle initial promo from URL
    useEffect(() => {
        const applyPromoFromUrl = async () => {
             if (promoFromUrl && cart && cart.items.length > 0 && !appliedPromo && !applyingPromo) {
                const code = promoFromUrl.toUpperCase();
                setPromoCode(code);
                
                setApplyingPromo(true);
                try {
                    const subtotal = calculateSubtotal();
                    const res = await axios.post("/api/promotions/validate", {
                        code: code,
                        subtotal: subtotal,
                        items: cart.items
                    });

                    if (res.data.success) {
                        setAppliedPromo(res.data.data);
                        await axios.put("/api/cart", { promotionId: res.data.data.id });
                        toast.success("Promotion from link applied!");
                    }
                } catch (error) {
                    // Fail silently for auto-applied link promos to not annoy user
                    console.error("Link promo failed:", error.response?.data?.message);
                } finally {
                    setApplyingPromo(false);
                }
            }
        };

        applyPromoFromUrl();
    }, [promoFromUrl, cart, appliedPromo]);

    const handleApplyPromoOnMount = async (cartData) => {
        try {
            const itemsToSubtotal = cartData.items || [];
            const subtotal = itemsToSubtotal.reduce((acc, item) => {
                const price = Number(item.package?.price) || 0;
                const quantity = Number(item.quantity) || 1;
                return acc + (price * quantity);
            }, 0);

            const res = await axios.post("/api/promotions/validate", {
                code: cartData.appliedPromotion.discountCode,
                subtotal: subtotal,
                items: cartData.items
            });

            if (res.data.success) {
                setAppliedPromo(res.data.data);
                setPromoCode(cartData.appliedPromotion.discountCode);
            }
        } catch (error) {
            console.error("Failed to auto-apply promotion", error);
        }
    };

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
        if (isAdmin && !selectedClientId) {
            toast.error("Please select a client to assign this cart to");
            return;
        }
        setCheckoutLoading(true);
        try {
            const res = await axios.post("/api/cart/checkout", {
                clientId: isAdmin ? selectedClientId : undefined
            });
            if (res.data.success) {
                toast.success("Invoice generated successfully!");
                router.push(`/panel/invoices?id=${res.data.invoiceId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Checkout failed");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleApplyPromotion = async (e) => {
        if (e) e.preventDefault();
        if (!promoCode) return;

        setApplyingPromo(true);
        try {
            const subtotal = calculateSubtotal();
            const res = await axios.post("/api/promotions/validate", {
                code: promoCode,
                subtotal: subtotal,
                items: cart.items
            });

            if (res.data.success) {
                setAppliedPromo(res.data.data);
                // Update cart in DB
                await axios.put("/api/cart", { promotionId: res.data.data.id });
                toast.success("Promotion applied!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid promotion code");
            setAppliedPromo(null);
        } finally {
            setApplyingPromo(false);
        }
    };

    const removePromotion = async () => {
        try {
            await axios.put("/api/cart", { promotionId: null });
            setAppliedPromo(null);
            setPromoCode("");
            toast.success("Promotion removed");
        } catch (error) {
            toast.error("Failed to remove promotion");
        }
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
                                                 {item.package?.price 
                                                     ? formatCurrency(item.package.price * exchangeRate, selectedCurrency) 
                                                     : (item.package?.startingPrice 
                                                         ? formatCurrency(item.package.startingPrice * exchangeRate, selectedCurrency) 
                                                         : formatCurrency(0, selectedCurrency))}
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

                        {/* Promotion Input */}
                        <Card className="p-6">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-indigo-600" />
                                Have a promotion code?
                            </h4>
                            <form onSubmit={handleApplyPromotion} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-1 px-4 py-2 rounded-lg border bg-[var(--color-background-elevated)] border-[var(--color-border)] focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    disabled={!!appliedPromo}
                                />
                                {appliedPromo ? (
                                    <Button variant="danger" type="button" onClick={removePromotion}>
                                        Remove
                                    </Button>
                                ) : (
                                    <Button type="submit" loading={applyingPromo}>
                                        Apply
                                    </Button>
                                )}
                            </form>
                            {appliedPromo && (
                                <p className="mt-2 text-xs text-emerald-600 font-medium">
                                    Promotional code "{appliedPromo.code}" applied!
                                </p>
                            )}
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                            
                            {/* Currency Selector */}
                            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                                <label className="text-xs font-bold text-indigo-800 dark:text-indigo-400 mb-2 block uppercase tracking-widest">
                                    Payment Currency
                                </label>
                                <select 
                                    className="w-full p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-900 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={selectedCurrency}
                                    onChange={handleCurrencyChange}
                                >
                                    <option value="USD">🇺🇸 USD - US Dollar ($)</option>
                                    <option value="EUR">🇪🇺 EUR - Euro (€)</option>
                                    <option value="CAD">🇨🇦 CAD - Canadian Dollar (C$)</option>
                                    <option value="TRY">🇹🇷 TRY - Turkish Lira (₺)</option>
                                    <option value="AED">🇦🇪 AED - UAE Dirham (د.إ)</option>
                                </select>
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-500 mt-2">
                                    Select your preferred currency for payment
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[var(--color-text-secondary)]">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-[var(--color-text-primary)]">
                                        {formatCurrency(calculateSubtotal(), selectedCurrency)}
                                    </span>
                                </div>
                                {appliedPromo && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Promotion ({appliedPromo.code})</span>
                                        <span className="font-semibold">
                                            -{formatCurrency(appliedPromo.discountAmount, selectedCurrency)}
                                        </span>
                                    </div>
                                )}
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
                                        {formatCurrency(calculateTotal(), selectedCurrency)}
                                    </span>
                                </div>
                            </div>

                            {isAdmin && (
                                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Assign to Client/User
                                    </h4>
                                    <select 
                                        className="w-full p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                        value={selectedClientId}
                                        onChange={(e) => setSelectedClientId(e.target.value)}
                                    >
                                        <option value="">-- Choose Client --</option>
                                        {clients.map(c => (
                                            <option key={c._id} value={c._id}>{c.name} ({c.email || "No Email"})</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-2">
                                        As an admin, you can assign this cart to any client. Checkout will generate an invoice for them.
                                    </p>
                                </div>
                            )}

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
