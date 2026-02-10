"use client";

import { useEffect, useState } from "react";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { InputField } from "@/components/forms/InputField";
import { Formik, Form } from "formik";
import { Plus, Edit, Trash2, Tag, Calendar, Save, Percent, Share2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import * as Yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const CATEGORIES = [
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'deployment', label: 'Deployment' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'bundle', label: 'Bundles' },
    { value: 'hosting', label: 'Hosting' },
    { value: 'seo', label: 'SEO' },
    { value: 'marketing', label: 'Marketing' },
];

const PromotionSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    discountCode: Yup.string().required("Required"),
    discountType: Yup.string().oneOf(['percentage', 'fixed']).required("Required"),
    discountValue: Yup.number().min(0, "Must be positive").required("Required"),
    minPurchase: Yup.number().min(0, "Must be positive"),
    usageLimit: Yup.number().nullable().min(0, "Must be positive"),
    isActive: Yup.boolean(),
    applicableCategories: Yup.array().of(Yup.string()),
});

export default function PromotionsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);

    useEffect(() => {
        if (!authLoading && (!user || !["admin", "manager"].includes(user.role))) {
            router.push("/panel/dashboard");
        }
    }, [user, authLoading, router]);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get("/api/promotions?all=true");
            setPromotions(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch promotions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleShare = async (promo) => {
        const discountText = promo.discountType === 'percentage' ? promo.discountValue + '%' : '$' + promo.discountValue;
        const shareData = {
            title: `LogaTech Sale: ${discountText} OFF!`,
            text: `🔥 EXCLUSIVE: Use code ${promo.discountCode} to get ${discountText} off your next project with LogaTech! 🚀 Limited time offer, check it out here:`,
            url: window.location.origin + '/promo/' + promo.discountCode
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share failed', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                toast.success("Promotion details copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy");
            }
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                ...values,
                usageLimit: values.usageLimit === "" ? null : values.usageLimit
            };
            if (editingPromotion) {
                await axios.put(`/api/promotions/${editingPromotion._id}`, payload);
                toast.success("Promotion updated");
            } else {
                await axios.post("/api/promotions", payload);
                toast.success("Promotion created");
            }
            fetchPromotions();
            setIsModalOpen(false);
            setEditingPromotion(null);
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/promotions/${id}`);
            toast.success("Promotion deleted");
            fetchPromotions();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (authLoading || !user || !["admin", "manager"].includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <ContentWrapper>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Promotions</h1>
                    <p className="text-[var(--color-text-secondary)]">Manage active discounts and bundles</p>
                </div>
                <Button onClick={() => { setEditingPromotion(null); setIsModalOpen(true); }} icon={<Plus size={18} />}>
                    Add Promotion
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                    <Card key={promo._id} className="border-l-4 border-l-indigo-600">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant={promo.isActive ? "success" : "secondary"}>
                                    {promo.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleShare(promo)}
                                        className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 transition-colors"
                                        title="Share Promotion"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                    {promo.discountCode && (
                                        <Badge variant="primary" className="font-mono">
                                            {promo.discountCode}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {promo.applicableCategories?.length > 0 ? (
                                    promo.applicableCategories.map(cat => (
                                        <span key={cat} className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                                            {cat}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded text-emerald-600">
                                        All Categories
                                    </span>
                                )}
                            </div>
                            <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed line-clamp-2">
                                {promo.description}
                            </p>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-[var(--color-text-tertiary)] mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Percent size={14} className="text-indigo-600" />
                                    <span className="font-semibold text-[var(--color-text-primary)]">
                                        {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`} Off
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>Until {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Endless'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Tag size={12} />
                                    <span>Min Spend: ${promo.minPurchase || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Save size={12} />
                                    <span>Uses: {promo.usedCount} / {promo.usageLimit || '∞'}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-[var(--color-border)]">
                                <Button variant="secondary" size="sm" onClick={() => { setEditingPromotion(promo); setIsModalOpen(true); }} icon={<Edit size={16} />}>
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(promo._id)} icon={<Trash2 size={16} />}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPromotion ? "Edit Promotion" : "Create Promotion"}
                size="lg"
            >
                <Formik
                    initialValues={editingPromotion ? {
                        ...editingPromotion,
                        startDate: editingPromotion.startDate ? new Date(editingPromotion.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        endDate: editingPromotion.endDate ? new Date(editingPromotion.endDate).toISOString().split('T')[0] : "",
                        applicableCategories: editingPromotion.applicableCategories || [],
                    } : {
                        title: "",
                        description: "",
                        discountCode: "",
                        discountType: "fixed",
                        discountValue: 0,
                        minPurchase: 0,
                        usageLimit: "",
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: "",
                        isActive: true,
                        applicableCategories: [],
                    }}
                    validationSchema={PromotionSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-4 py-4 px-1">
                            <InputField name="title" label="Promotion Title" placeholder="e.g. New Year Special" required />
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="w-full p-2.5 rounded-lg border bg-[var(--color-background-elevated)] border-[var(--color-border)] min-h-[80px]"
                                    value={values.description}
                                    onChange={(e) => setFieldValue("description", e.target.value)}
                                    placeholder="Enter promotion details..."
                                />
                            </div>

                            <InputField name="discountCode" label="Discount Code" placeholder="NEW2026" required />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Discount Type</label>
                                    <select
                                        className="w-full p-2.5 rounded-lg border bg-[var(--color-background-elevated)] border-[var(--color-border)]"
                                        value={values.discountType}
                                        onChange={(e) => setFieldValue("discountType", e.target.value)}
                                    >
                                        <option value="fixed">Fixed Amount ($)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </div>
                                <InputField name="discountValue" label="Discount Value" type="number" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="minPurchase" label="Min Purchase ($)" type="number" />
                                <InputField name="usageLimit" label="Usage Limit (empty for ∞)" type="number" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="startDate" label="Start Date" type="date" />
                                <InputField name="endDate" label="End Date" type="date" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Applicable Categories (Empty for All)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border p-3 rounded-lg border-[var(--color-border)] bg-[var(--color-background-elevated)]">
                                    {CATEGORIES.map(cat => (
                                        <label key={cat.value} className="flex items-center gap-2 text-xs cursor-pointer hover:text-indigo-600 transition-colors">
                                            <input 
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                checked={values.applicableCategories.includes(cat.value)}
                                                onChange={(e) => {
                                                    const cur = values.applicableCategories;
                                                    if (e.target.checked) {
                                                        setFieldValue("applicableCategories", [...cur, cat.value]);
                                                    } else {
                                                        setFieldValue("applicableCategories", cur.filter(c => c !== cat.value));
                                                    }
                                                }}
                                            />
                                            {cat.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="isActivePromo" 
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    checked={values.isActive}
                                    onChange={(e) => setFieldValue("isActive", e.target.checked)}
                                />
                                <label htmlFor="isActivePromo" className="text-sm font-medium cursor-pointer">Active (visible to users)</label>
                            </div>

                            <div className="flex gap-2 justify-end pt-4 border-t border-[var(--color-border)] mt-6">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" loading={isSubmitting} icon={<Save size={18} />}>
                                    {editingPromotion ? "Update Promotion" : "Create Promotion"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </ContentWrapper>
    );
}
