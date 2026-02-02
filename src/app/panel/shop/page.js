"use client";

import { useEffect, useState } from "react";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Package as PackageIcon, ShoppingCart, Info, CheckCircle2, Store } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ShopPage() {
    const router = useRouter();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    const fetchPackages = async () => {
        try {
            const res = await axios.get("/api/packages?all=true");
            // Only show active packages to users
            setPackages(res.data.data.filter(p => p.isActive));
        } catch (error) {
            toast.error("Failed to fetch packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const addToCart = async (pkg) => {
        setAddingToCart(pkg._id);
        try {
            const cleanPrice = pkg.startingPrice.replace(/[^0-9.]/g, '');
            await axios.post("/api/cart", {
                packageId: pkg._id,
                quantity: 1,
                billingCycle: "monthly"
            });
            toast.success(`${pkg.name} added to cart!`, {
                action: {
                    label: "View Cart",
                    onClick: () => router.push("/panel/cart")
                }
            });
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <ContentWrapper>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <Store className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Services & Packages</h1>
                </div>
                <p className="text-[var(--color-text-secondary)] max-w-2xl">
                    Select a professional service package tailored to your business needs. 
                    Add items to your cart to generate an invoice and start your project.
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="h-96 animate-pulse bg-[var(--color-background-elevated)]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <Card key={pkg._id} className="relative flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-[var(--color-border)] hover:border-indigo-500/50">
                            {pkg.badge && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg">
                                        {pkg.badge}
                                    </div>
                                </div>
                            )}
                            
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="p-3 bg-indigo-600/10 text-indigo-600 rounded-2xl">
                                        <PackageIcon size={28} />
                                    </div>
                                    <Badge size="sm" className="capitalize opacity-80">{pkg.category}</Badge>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">{pkg.name}</h3>
                                
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                                            {pkg.startingPrice}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--color-text-tertiary)]">/ start</span>
                                    </div>
                                    <p className="text-sm text-indigo-500 font-medium mt-1 uppercase tracking-wider">{pkg.priceRange}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {pkg.features?.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-[var(--color-text-secondary)] leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto space-y-3">
                                    <Button 
                                        fullWidth 
                                        onClick={() => addToCart(pkg)}
                                        loading={addingToCart === pkg._id}
                                        icon={<ShoppingCart className="w-4 h-4" />}
                                    >
                                        Add to Cart
                                    </Button>
                                    <button className="w-full py-2.5 text-xs font-semibold text-[var(--color-text-tertiary)] hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5">
                                        <Info className="w-3.5 h-3.5" />
                                        Request Custom Modification
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {packages.length === 0 && !loading && (
                <div className="py-20 text-center">
                    <PackageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold">No packages available</h3>
                    <p className="text-gray-500">Wait for the administrator to add service packages.</p>
                </div>
            )}
        </ContentWrapper>
    );
}
