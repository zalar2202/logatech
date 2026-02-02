"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/forms/InputField";
import { SelectField } from "@/components/forms/SelectField";
import { TextareaField } from "@/components/forms/TextareaField";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import axios from "axios";
import { Ticket, ArrowLeft } from "lucide-react";

const ticketSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required").max(200),
    description: Yup.string().required("Description is required"),
    category: Yup.string(),
    priority: Yup.string(),
});

export default function NewTicketPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleCreateTicket = async (values, { setSubmitting }) => {
        try {
            const { data } = await axios.post("/api/tickets", values);
            if (data.success) {
                toast.success("Ticket created successfully");
                router.push("/panel/tickets");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create ticket");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ContentWrapper>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                            <Ticket className="w-6 h-6 text-purple-600" />
                            Open New Ticket
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Tell us what's on your mind and we'll get back to you as soon as possible.
                        </p>
                    </div>
                    <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.back()}>
                        Back
                    </Button>
                </div>

                <Card className="p-6">
                    <Formik
                        initialValues={{ subject: "", description: "", category: "general", priority: "medium" }}
                        validationSchema={ticketSchema}
                        onSubmit={handleCreateTicket}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <InputField name="subject" label="Subject" placeholder="Brief summary of your inquiry" />
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectField name="category" label="Category">
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="billing">Billing</option>
                                        <option value="account">Account</option>
                                        <option value="feature_request">Feature Request</option>
                                        <option value="bug_report">Bug Report</option>
                                        <option value="audit">Service/Site Audit</option>
                                        <option value="consultation">Technical Consultation</option>
                                    </SelectField>
                                    <SelectField name="priority" label="Priority">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </SelectField>
                                </div>
                                <TextareaField 
                                    name="description" 
                                    label="Message" 
                                    rows={8} 
                                    placeholder="Please provide as much detail as possible..." 
                                />
                                <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                                    <Button type="submit" loading={isSubmitting}>Submit Ticket</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </ContentWrapper>
    );
}
