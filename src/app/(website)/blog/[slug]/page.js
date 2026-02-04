import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ChevronLeft, Share2, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import "@/styles/blog.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);
    
    if (!post) {
        return {
            title: "Post Not Found | LogaTech",
        };
    }

    return {
        title: post.seo?.metaTitle || `${post.title} | LogaTech Blog`,
        description: post.seo?.metaDescription || post.excerpt || "",
        keywords: post.seo?.metaKeywords?.join(", ") || post.tags?.join(", "),
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author?.name],
            images: post.seo?.ogImage || post.featuredImage?.url
                ? [{ url: post.seo?.ogImage || post.featuredImage?.url }]
                : [],
        },
        robots: {
            index: !post.seo?.noIndex,
            follow: !post.seo?.noFollow,
        },
    };
}

async function getPost(slug) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/blog/posts/${slug}`, {
            next: { revalidate: 60 },
        });
        
        if (!res.ok) {
            return null;
        }
        
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch post:", error);
        return null;
    }
}

async function getRelatedPosts(categoryId, currentPostId) {
    if (!categoryId) return [];
    
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(
            `${baseUrl}/api/blog/posts?category=${categoryId}&limit=3&status=published`,
            { next: { revalidate: 60 } }
        );
        
        if (!res.ok) return [];
        
        const data = await res.json();
        return (data.data || []).filter((p) => p._id !== currentPostId);
    } catch (error) {
        return [];
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function ShareButton({ title, url }) {
    return (
        <button
            onClick={() => {
                if (navigator.share) {
                    navigator.share({ title, url });
                } else {
                    navigator.clipboard.writeText(url);
                }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
        >
            <Share2 size={16} />
            Share
        </button>
    );
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(
        post.category?._id || post.category,
        post._id
    );

    return (
        <article className="min-h-screen pt-32 md:pt-40 bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative">
                {/* Featured Image */}
                {post.featuredImage?.url ? (
                    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                        <img
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                ) : (
                    <div className="h-[40vh] bg-gradient-to-br from-[var(--accent-color)] to-purple-600" />
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 z-10">
                    <div className="max-w-4xl mx-auto text-white">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ChevronLeft size={18} />
                            Back to Blog
                        </Link>

                        {/* Category */}
                        {post.category && (
                            <Link
                                href={`/blog/category/${post.category.slug}`}
                                className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full backdrop-blur-sm"
                                style={{ backgroundColor: `${post.category.color}CC` }}
                            >
                                {post.category.name}
                            </Link>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-white/80">
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    {post.author.avatar ? (
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                    )}
                                    <span>{post.author.name}</span>
                                </div>
                            )}
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(post.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDate(post.publishedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 px-4 relative z-0">
                <div className="max-w-4xl mx-auto">
                    <div className="lg:flex lg:gap-12">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Article Content */}
                            <div
                                className="prose prose-lg max-w-none blog-content dark:prose-invert
                                    prose-headings:text-[var(--color-text-primary)]
                                    prose-p:text-[var(--color-text-secondary)]
                                    prose-a:text-[var(--color-primary)]
                                    prose-strong:text-[var(--color-text-primary)]
                                    prose-blockquote:border-[var(--color-primary)]
                                    prose-blockquote:text-[var(--color-text-secondary)]
                                    prose-code:bg-[var(--color-background-tertiary)]
                                    prose-pre:bg-[var(--color-background-tertiary)]"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag size={18} className="text-[var(--text-secondary)]" />
                                        {post.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                href={`/blog/tag/${tag}`}
                                                className="px-3 py-1 text-sm rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--accent-color)] hover:text-white transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author Bio */}
                            {post.author && post.author.bio && (
                                <div className="mt-12 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                                    <div className="flex items-start gap-4">
                                        {post.author.avatar ? (
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.name}
                                                className="w-16 h-16 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                                                <User size={24} className="text-[var(--text-secondary)]" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)]">
                                                {post.author.name}
                                            </h4>
                                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                                {post.author.bio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 px-4 bg-[var(--bg-secondary)]">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
                            Related Posts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost._id}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group block overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all duration-300"
                                >
                                    <div className="h-40 overflow-hidden">
                                        {relatedPost.featuredImage?.url ? (
                                            <img
                                                src={relatedPost.featuredImage.url}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[var(--accent-color)] to-purple-600" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                                            {formatDate(relatedPost.publishedAt)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation */}
            <section className="py-8 px-4 border-t border-[var(--border-color)]">
                <div className="max-w-4xl mx-auto flex justify-between">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Blog
                    </Link>
                </div>
            </section>
        </article>
    );
}
