import Link from "next/link";
import { Calendar, Clock, ChevronRight, Tag } from "lucide-react";

export const metadata = {
    title: "Blog | LogaTech",
    description: "Read the latest articles, tutorials, and insights from LogaTech. Stay updated with tech news, tips, and industry best practices.",
    openGraph: {
        title: "Blog | LogaTech",
        description: "Read the latest articles, tutorials, and insights from LogaTech.",
        type: "website",
    },
};

async function getPosts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/blog/posts?limit=12&status=published`, {
            next: { revalidate: 60 },
        });
        
        if (!res.ok) {
            return { posts: [], categories: [] };
        }
        
        const data = await res.json();
        return { posts: data.data || [], pagination: data.pagination };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return { posts: [], pagination: null };
    }
}

async function getCategories() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/blog/categories`, {
            next: { revalidate: 3600 },
        });
        
        if (!res.ok) {
            return [];
        }
        
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
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

function PostCard({ post, featured = false }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`group block overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                featured ? "md:col-span-2 md:row-span-2" : ""
            }`}
        >
            {/* Featured Image */}
            <div
                className={`relative overflow-hidden ${
                    featured ? "h-64 md:h-80" : "h-48"
                }`}
            >
                {post.featuredImage?.url ? (
                    <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--accent-color)] to-purple-600 flex items-center justify-center">
                        <span className="text-white/50 text-6xl font-bold">
                            {post.title.charAt(0)}
                        </span>
                    </div>
                )}
                {/* Category Badge */}
                {post.category && (
                    <span
                        className="absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full text-white backdrop-blur-sm"
                        style={{ backgroundColor: `${post.category.color}CC` }}
                    >
                        {post.category.name}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3
                    className={`font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-2 ${
                        featured ? "text-2xl" : "text-lg"
                    }`}
                >
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p
                        className={`mt-2 text-[var(--text-secondary)] line-clamp-2 ${
                            featured ? "text-base" : "text-sm"
                        }`}
                    >
                        {post.excerpt}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readingTime} min read
                    </span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default async function BlogPage() {
    const [{ posts, pagination }, categories] = await Promise.all([
        getPosts(),
        getCategories(),
    ]);

    const featuredPost = posts.find((p) => p.isFeatured);
    const regularPosts = posts.filter((p) => p._id !== featuredPost?._id);

    return (
        <main className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-4">
                        Our{" "}
                        <span className="bg-gradient-to-r from-[var(--accent-color)] to-purple-500 bg-clip-text text-transparent">
                            Blog
                        </span>
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Articles, tutorials, and insights about technology, networking, 
                        and digital solutions to help you stay ahead.
                    </p>
                </section>

                {/* Categories */}
                {categories.length > 0 && (
                    <section className="mb-12">
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/blog"
                                className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent-color)] text-white transition-colors"
                            >
                                All Posts
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/blog/category/${category.slug}`}
                                    className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPost && (
                            <PostCard post={featuredPost} featured />
                        )}
                        {regularPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </section>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                            <Tag size={32} className="text-[var(--text-secondary)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            No posts yet
                        </h2>
                        <p className="text-[var(--text-secondary)]">
                            We're working on great content. Check back soon!
                        </p>
                    </div>
                )}

                {/* Load More / Pagination */}
                {pagination && pagination.pages > 1 && (
                    <section className="flex justify-center mt-12">
                        <Link
                            href="/blog?page=2"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors"
                        >
                            Load More Posts
                            <ChevronRight size={18} />
                        </Link>
                    </section>
                )}
            </div>
        </main>
    );
}
