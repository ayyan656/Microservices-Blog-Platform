import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Heart, Eye } from 'lucide-react';
import { formatNumber } from '../../utils/editorial.utils';

/**
 * EditorialCard Component
 * Flexible article card with two size variants
 * 
 * @param {Object} post - Transformed post object
 * @param {string} variant - 'large' | 'small' | 'horizontal'
 */
export default function EditorialCard({ post, variant = 'large' }) {
    if (!post) return null;

    // Variant-specific styles
    const variants = {
        large: {
            container: 'editorial-card group flex flex-col h-full',
            imageWrapper: 'aspect-[4/3]',
            content: 'p-6 md:p-8 flex-1 flex flex-col',
            title: 'font-serif text-xl md:text-2xl font-semibold leading-tight',
            showExcerpt: true,
            showStats: true,
        },
        small: {
            container: 'editorial-card group flex flex-col h-full',
            imageWrapper: 'aspect-[3/2]',
            content: 'p-5 flex-1 flex flex-col',
            title: 'font-serif text-lg font-medium leading-snug',
            showExcerpt: false,
            showStats: false,
        },
        horizontal: {
            container: 'editorial-card group flex flex-row h-full',
            imageWrapper: 'w-1/3 min-w-[120px]',
            content: 'p-4 flex-1 flex flex-col justify-center',
            title: 'font-serif text-base font-medium leading-snug',
            showExcerpt: false,
            showStats: false,
        },
    };

    const styles = variants[variant] || variants.large;

    return (
        <article className={styles.container}>
            {/* Image */}
            <Link to={`/posts/${post.id}`} className="block">
                <div className={`editorial-image relative overflow-hidden ${styles.imageWrapper}`}>
                    {post.imageUrl ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-editorial-cream to-gray-100 flex items-center justify-center">
                            <span className="text-gray-300 font-serif text-lg italic">
                                No image
                            </span>
                        </div>
                    )}

                    {/* Category badge on image */}
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-editorial-text shadow-sm">
                        {post.category}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className={styles.content}>
                {/* Meta info */}
                <div className="flex items-center gap-2 text-xs font-medium text-editorial-muted mb-3">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} min read</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{post.shortDate}</span>
                </div>

                {/* Title */}
                <h3 className={`${styles.title} text-editorial-text group-hover:text-editorial-accent transition-colors duration-300 mb-3`}>
                    <Link to={`/posts/${post.id}`}>
                        {post.title}
                    </Link>
                </h3>

                {/* Excerpt (only for large variant) */}
                {styles.showExcerpt && post.excerpt && (
                    <p className="text-editorial-muted text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        <img
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs font-medium text-editorial-muted">
                            {post.author.name}
                        </span>
                    </div>

                    {/* Stats or Arrow */}
                    {styles.showStats ? (
                        <div className="flex items-center gap-3 text-xs text-editorial-muted">
                            <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(post.likes)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatNumber(post.views)}
                            </span>
                        </div>
                    ) : (
                        <Link
                            to={`/posts/${post.id}`}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-editorial-muted group-hover:bg-accent group-hover:text-white transition-all duration-300"
                        >
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
