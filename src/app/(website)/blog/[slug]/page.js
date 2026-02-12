import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ChevronLeft, Share2, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import WebsiteThemeToggle from "@/components/website/layout/WebsiteThemeToggle";
import { MoveLeft, ChevronRight } from "lucide-react";
import CommentSection from "@/components/website/CommentSection";
import "@/styles/blog.css";

export const dynamic = "force-dynamic";

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
                ? [
                      {
                          url: post.seo?.ogImage || post.featuredImage?.url,
                          width: 1200,
                          height: 630,
                          alt: post.title,
                      },
                  ]
                : [
                      {
                          url: "/assets/favicon/android-chrome-512x512.png",
                          width: 512,
                          height: 512,
                          alt: "LogaTech",
                      },
                  ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: [post.seo?.ogImage || post.featuredImage?.url || "/assets/favicon/android-chrome-512x512.png"],
        },
        robots: {
            index: !post.seo?.noIndex,
            follow: !post.seo?.noFollow,
        },
    };
}

async function getPost(slug) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logatech.net";
        const res = await fetch(`${baseUrl}/api/blog/posts/${slug}?t=${Date.now()}`, {
            cache: "no-store",
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
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logatech.net";
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://logatech.net";
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const imageUrl = post.featuredImage?.url?.startsWith('http') 
        ? post.featuredImage.url 
        : `${baseUrl}${post.featuredImage?.url || ""}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": imageUrl,
        "author": {
            "@type": "Person",
            "name": post.author?.name || "LogaTech Team",
        },
        "publisher": {
            "@type": "Organization",
            "name": "LogaTech",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/assets/favicon/android-chrome-512x512.png`
            }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "description": post.excerpt || post.title,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        }
    };

    return (
        <article key={post.slug} className="min-h-screen pt-32 md:pt-40 bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300">
            {/* Default JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            {/* Custom/FAQ JSON-LD Schema */}
            {post.seo?.schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: post.seo.schema }}
                />
            )}

            {/* Hero Section */}
            <section className="relative">
                {/* Featured Image */}
                {post.featuredImage?.url ? (
                    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                        <img
                            key={`${post._id}-${post.slug}`}
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>
                ) : (
                    <div className="h-[40vh] bg-gradient-to-br from-[var(--accent-color)] to-purple-600" />
                )}

                {/* Top Navigation Overlay */}
                <div className="absolute top-0 left-0 right-0 px-4 pt-10 z-20">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 z-10">
                    <div className="max-w-4xl mx-auto text-white">
                        {/* Category */}
                        {post.category && (
                            <div className="mb-4">
                                <Link
                                    href={`/blog/category/${post.category.slug}`}
                                    className="inline-block px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm hover:brightness-110 transition-all"
                                    style={{ backgroundColor: `${post.category.color}CC` }}
                                >
                                    {post.category.name}
                                </Link>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-white/80">
                            {post.author && post.showAuthor !== false && (
                                <div className="flex items-center gap-2">
                                    {post.author.avatar ? (
                                        <img
                                            key={`${post.author.name}-avatar`}
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-8 h-8 rounded-full"
                                            loading="eager"
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
                                <span>{post.readingTime || 1} min read</span>
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
                            {post.author && post.author.bio && post.showAuthor !== false && (
                                <div className="mt-12 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                                    <div className="flex items-start gap-4">
                                        {post.author.avatar ? (
                                            <img
                                                key={`${post.author.name}-bio-avatar`}
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

                            {/* Comments Section */}
                            <CommentSection 
                                postId={post._id} 
                                allowComments={post.allowComments !== false} 
                            />
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
                                                key={relatedPost._id}
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
