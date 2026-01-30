import { useState, useEffect } from 'react';
import { getHomePageData, getEditorialPosts } from '../api/editorial.api';
import {
    HeroPost,
    EditorialGrid,
    CategoryFilter,
    NewsletterSignup
} from '../components/editorial';
import { handleApiError } from '../utils/helpers';

/**
 * HomePage Component
 * Editorial-style homepage inspired by witanddelight.com
 */
export default function HomePage() {
    const [heroPost, setHeroPost] = useState(null);
    const [gridPosts, setGridPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getHomePageData();

                setHeroPost(data.heroPost);
                setGridPosts(data.gridPosts);
                setLatestPosts(data.latestPosts);
                setCategories(data.categories);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle category filter change
    const handleCategoryChange = async (category) => {
        setActiveCategory(category);

        if (category === 'All') {
            // Reset to original layout
            const data = await getHomePageData();
            setHeroPost(data.heroPost);
            setGridPosts(data.gridPosts);
            setLatestPosts(data.latestPosts);
        } else {
            // Filter by category
            const { posts } = await getEditorialPosts({ category });
            setHeroPost(posts[0] || null);
            setGridPosts(posts.slice(1, 4));
            setLatestPosts(posts.slice(4));
        }
    };

    return (
        <div className="min-h-screen bg-editorial-bg">
            {/* Main Container */}
            <div className="editorial-container pt-8 pb-24">

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                {/* ============================================
                    HERO SECTION
                    ============================================ */}
                <section className="mb-16 md:mb-24">
                    {/* Site Title */}
                    <header className="mb-12 text-center">
                        <div className="inline-block relative">
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-editorial-text">
                                The Edit
                            </h1>
                            {/* Underline accent */}
                            <div className="absolute bottom-2 left-0 w-full h-3 md:h-4 bg-editorial-accent/20 -z-10" />
                        </div>
                        <p className="mt-4 text-editorial-muted text-lg md:text-xl max-w-xl mx-auto">
                            A curated collection of thoughts on design, lifestyle, and everything in between.
                        </p>
                    </header>

                    {/* Hero Post */}
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-7">
                                    <div className="bg-gray-200 rounded-3xl aspect-[4/3]" />
                                </div>
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-10 bg-gray-200 rounded w-full" />
                                    <div className="h-10 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                    ) : heroPost ? (
                        <HeroPost post={heroPost} />
                    ) : (
                        <div className="text-center py-16 bg-editorial-cream rounded-3xl">
                            <p className="text-editorial-muted text-lg">
                                No featured articles yet. Start creating content!
                            </p>
                        </div>
                    )}
                </section>

                {/* ============================================
                    CATEGORY FILTER & LATEST ARTICLES
                    ============================================ */}
                <section className="mb-16">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="editorial-category text-editorial-accent mb-2 block">
                                Browse Articles
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-editorial-text">
                                Latest Stories
                            </h2>
                        </div>

                        {/* Category Filter */}
                        <CategoryFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Editorial Grid */}
                    <EditorialGrid
                        posts={gridPosts}
                        loading={loading && gridPosts.length === 0}
                    />
                </section>

                {/* ============================================
                    NEWSLETTER SIGNUP
                    ============================================ */}
                <section className="mb-16 md:mb-24">
                    <NewsletterSignup />
                </section>

                {/* ============================================
                    MORE ARTICLES (if available)
                    ============================================ */}
                {latestPosts.length > 0 && (
                    <section>
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-editorial-text">
                                More to Explore
                            </h2>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Grid of remaining posts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {latestPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <EditorialGrid posts={[post]} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
