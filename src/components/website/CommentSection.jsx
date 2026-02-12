"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { MessageSquare, Send, User, Clock } from "lucide-react";

export default function CommentSection({ postId, allowComments }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        authorName: "",
        authorEmail: "",
        content: "",
        website: "", // Honeypot field
    });

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`/api/blog/posts/${postId}/comments`);
            if (data.success) {
                setComments(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (allowComments) {
            fetchComments();
        }
    }, [postId, allowComments]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.authorName || !formData.authorEmail || !formData.content) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post(`/api/blog/posts/${postId}/comments`, formData);
            if (data.success) {
                toast.success(data.message || "Comment submitted for moderation.");
                setFormData({
                    authorName: "",
                    authorEmail: "",
                    content: "",
                    website: "",
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to submit comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (!allowComments) return null;

    return (
        <div className="mt-16 pt-12 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-[var(--accent-color)]" size={24} />
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
                <h4 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Leave a Comment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Name *</label>
                        <input
                            type="text"
                            name="authorName"
                            value={formData.authorName}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--color-background)] focus:border-[var(--accent-color)] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Email *</label>
                        <input
                            type="email"
                            name="authorEmail"
                            value={formData.authorEmail}
                            onChange={handleChange}
                            required
                            placeholder="Your email (won't be published)"
                            className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--color-background)] focus:border-[var(--accent-color)] outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Honeypot field - Hidden from users */}
                <div className="hidden">
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex="-1"
                        autoComplete="off"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-[var(--text-secondary)]">Comment *</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--color-background)] focus:border-[var(--accent-color)] outline-none transition-colors resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Submitting..." : "Post Comment"}
                    <Send size={18} />
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-10 text-center animate-pulse text-[var(--text-secondary)]">Loading comments...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)]">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">
                                            {comment.authorName}
                                            {comment.isAdminComment && (
                                                <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] bg-[var(--accent-color)] text-white rounded shadow-sm">ADMIN</span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                            <Clock size={12} />
                                            {formatDate(comment.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-[var(--text-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}
