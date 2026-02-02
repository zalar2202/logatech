"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal, ConfirmModal } from "@/components/common/Modal";
import { InputField } from "@/components/forms/InputField";
import { SelectField } from "@/components/forms/SelectField";
import { TextareaField } from "@/components/forms/TextareaField";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import { 
    Building2, 
    Plus, 
    Search, 
    Link as LinkIcon, 
    CreditCard, 
    MoreVertical, 
    Edit, 
    Trash2,
    User,
    Mail,
    Phone
} from "lucide-react";
import * as Yup from "yup";

// Validation Schema
const clientSchema = Yup.object().shape({
    name: Yup.string().required("Company/Client name is required"),
    contactPerson: Yup.string(),
    email: Yup.string().email("Invalid email"),
    phone: Yup.string(),
    status: Yup.string().oneOf(['active', 'inactive', 'prospective']),
    linkedUser: Yup.string().nullable(),
    address: Yup.string(),
    notes: Yup.string(),
});

export default function ClientsPage() {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]); // For linking
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null); // If null, creating new
    const [activeTab, setActiveTab] = useState("details"); // details, payments

    useEffect(() => {
        fetchClients();
        fetchUsers();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/clients");
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch clients");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/users?limit=1000"); // Get basic user list
            setUsers(data.data || []);
        } catch (error) {
            console.error("Failed to fetch users");
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            if (selectedClient) {
                // Update Client
                const { data } = await axios.put(`/api/clients/${selectedClient._id}`, values);
                if (data.success) {
                    toast.success("Client updated successfully");
                    fetchClients();
                    setIsModalOpen(false);
                    // Don't reset form on edit success in case they want to re-open, 
                    // but since we close modal, it's fine.
                }
            } else {
                // Create Client
                const { data } = await axios.post("/api/clients", values);
                if (data.success) {
                    toast.success("Client created successfully");
                    fetchClients();
                    setIsModalOpen(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setSelectedClient(null);
        setActiveTab("details");
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setSelectedClient(client);
        setActiveTab("details");
        setIsModalOpen(true);
    };

    // Filter clients
    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ContentWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Clients
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                        Manage companies, link user accounts, and track payments.
                    </p>
                </div>
                <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
                    Add Client
                </Button>
            </div>

            <Card>
                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                        style={{ borderColor: "var(--color-border)" }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="p-4 font-semibold text-sm text-gray-500">Client / Company</th>
                                <th className="p-4 font-semibold text-sm text-gray-500">Contact Info</th>
                                <th className="p-4 font-semibold text-sm text-gray-500">Linked Account</th>
                                <th className="p-4 font-semibold text-sm text-gray-500">Status</th>
                                <th className="p-4 font-semibold text-sm text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                            ) : filteredClients.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No clients found. Add one to get started.</td></tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client._id} className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{client.name}</div>
                                            <div className="text-xs text-gray-500">{client.address || "No address provided"}</div>
                                        </td>
                                        <td className="p-4">
                                            {client.contactPerson && <div className="text-sm font-medium">{client.contactPerson}</div>}
                                            {client.email && (
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3" /> {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3" /> {client.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {client.linkedUser ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {client.linkedUser.name?.[0] || "U"}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-medium">{client.linkedUser.name}</div>
                                                        <div className="text-[10px] text-gray-400">{client.linkedUser.email}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Not linked</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <Badge 
                                                variant={client.status === 'active' ? 'success' : client.status === 'inactive' ? 'danger' : 'warning'}
                                                size="sm"
                                            >
                                                {client.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => openEditModal(client)}
                                                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                                    title="Edit Client"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {/* In real app, add Details/Delete here */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedClient ? `Edit ${selectedClient.name}` : "New Client"}
                size="lg"
            >
                {selectedClient && (
                    <div className="flex border-b mb-6 dark:border-gray-700">
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "details" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("details")}
                        >
                            Details
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "payments" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("payments")}
                        >
                            Payments & Invoices
                        </button>
                    </div>
                )}

                {activeTab === "details" ? (
                    <Formik
                        initialValues={{
                            name: selectedClient?.name || "",
                            contactPerson: selectedClient?.contactPerson || "",
                            email: selectedClient?.email || "",
                            phone: selectedClient?.phone || "",
                            status: selectedClient?.status || "active",
                            linkedUser: selectedClient?.linkedUser?._id || selectedClient?.linkedUser || "",
                            address: selectedClient?.address || "",
                            notes: selectedClient?.notes || "",
                        }}
                        validationSchema={clientSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <InputField name="name" label="Company / Client Name" placeholder="e.g. Acme Corp" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField name="contactPerson" label="Contact Person" placeholder="Full Name" />
                                    <SelectField name="status" label="Status">
                                        <option value="active">Active</option>
                                        <option value="prospective">Prospective</option>
                                        <option value="inactive">Inactive</option>
                                    </SelectField>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField name="email" label="Email" placeholder="contact@company.com" />
                                    <InputField name="phone" label="Phone" placeholder="+1..." />
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" /> Linked User Account
                                    </h4>
                                    <SelectField name="linkedUser" label="Select a registered user to link">
                                        <option value="">-- No User Linked --</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                        ))}
                                    </SelectField>
                                    <p className="text-xs text-gray-400 mt-1">Linking a user allows them to see their company's invoices.</p>
                                </div>

                                <TextareaField name="address" label="Billing Address" rows={2} />
                                <TextareaField name="notes" label="Internal Notes" rows={3} />

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" loading={isSubmitting}>
                                        {selectedClient ? "Save Changes" : "Create Client"}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed">
                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Payment History</h3>
                        <p className="max-w-xs mx-auto mt-1 text-sm">
                            This client has not made any payments yet. Invoices will appear here once generated.
                        </p>
                        <div className="mt-6">
                            <Button size="sm" variant="secondary">Create Invoice (Coming Soon)</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </ContentWrapper>
    );
}
