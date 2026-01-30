import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * HeroPost Component
 * Large featured post for the top of the homepage
 * Asymmetric 7/5 grid layout with image on left, content on right
 */
export default function HeroPost({ post }) {
    if (!post) return null;

    return (
        <article className="group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Image Side (7 cols on desktop) */}
                <div className="lg:col-span-7 order-1">
                    <Link to={`/posts/${post.id}`} className="block">
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-editorial group-hover:shadow-editorial-hover transition-all duration-500">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-editorial-cream to-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400 font-serif text-2xl italic">
                                        The Edit
                                    </span>
                                </div>
                            )}
                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </Link>
                </div>

                {/* Content Side (5 cols on desktop) */}
                <div className="lg:col-span-5 order-2">
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="editorial-category text-editorial-accent">
                            {post.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="editorial-category">
                            {post.formattedDate}
                        </span>
                    </div>

                    {/* Title - Serif Typography */}
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-editorial-text leading-tight mb-6 group-hover:text-editorial-accent transition-colors duration-300">
                        <Link to={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </h1>

                    {/* Excerpt */}
                    <p className="text-editorial-muted text-lg leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* Author & Read Time */}
                    <div className="flex items-center gap-4 mb-8">
                        <img
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                            <span className="text-sm font-medium text-editorial-text">
                                {post.author.name}
                            </span>
                            <span className="text-editorial-muted mx-2">·</span>
                            <span className="text-sm text-editorial-muted">
                                {post.readTime} min read
                            </span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        to={`/posts/${post.id}`}
                        className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#E63900] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    >
                        Read Article
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
