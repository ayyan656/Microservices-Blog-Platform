import { useState, useEffect } from 'react';
import { getAllPosts } from '../api/posts.api';
import { handleApiError } from '../utils/helpers';
import PostGrid from '../components/posts/PostGrid';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                // Filter to show only published posts
                const publishedPosts = data.posts.filter(post => post.status === 'published');
                setPosts(publishedPosts);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Get the featured post (first post) and the rest
    const featuredPost = posts.length > 0 ? posts[0] : null;
    const remainingPosts = posts.length > 0 ? posts.slice(1) : [];

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-24">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-16">

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Hero Section */}
                <div className="mb-20">
                    <header className="mb-12 relative inline-block">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 relative z-10">
                            Tech.
                        </h1>
                        <div className="absolute bottom-2 md:bottom-3 left-0 w-full h-4 md:h-6 bg-purple-200/80 -z-0"></div>
                    </header>

                    {loading ? (
                        // Hero Skeleton
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
                            <div className="h-[400px] bg-gray-200 rounded-3xl w-full"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                                <div className="h-12 bg-gray-200 w-full rounded"></div>
                                <div className="h-12 bg-gray-200 w-2/3 rounded"></div>
                                <div className="h-4 bg-gray-200 w-full rounded"></div>
                            </div>
                        </div>
                    ) : featuredPost && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group">
                            {/* Text Side */}
                            <div className="lg:col-span-5 order-2 lg:order-1">
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 font-medium tracking-wide">
                                    <span className="uppercase text-slate-800 font-bold">In Focus</span>
                                    <span className="w-8 h-[1px] bg-slate-300"></span>
                                    {/* Placeholder author name until we have author object */}
                                    <span>User #{featuredPost.authorId}</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] text-slate-900 group-hover:text-purple-700 transition-colors">
                                    <a href={`/posts/${featuredPost._id}`}>
                                        {featuredPost.title}
                                    </a>
                                </h2>

                                <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>

                                <a href={`/posts/${featuredPost._id}`} className="inline-flex items-center justify-center w-16 h-16 bg-[#FF4405] text-white rounded-2xl hover:bg-[#E63900] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-orange-200">
                                    <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>

                            {/* Image Side */}
                            <div className="lg:col-span-7 order-1 lg:order-2">
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] group-hover:shadow-3xl transition-all duration-500">
                                    {featuredPost.imageUrl ? (
                                        <img
                                            src={featuredPost.imageUrl}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            No Image
                                        </div>
                                    )}
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 mix-blend-overlay"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider with pagination indicator styling */}
                <div className="flex items-center justify-center mb-24 opacity-40">
                    <span className="text-6xl font-black text-gray-200">2</span>
                    <span className="text-2xl font-bold text-gray-300 mx-2">/</span>
                    <span className="text-md font-bold text-gray-400 pt-2">6</span>
                    <div className="h-[2px] w-24 bg-gray-200 ml-6 rounded-full"></div>
                </div>

                {/* Latest Articles Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Latest Articles
                    </h3>

                    {/* Categories Filter (Visual only for now) */}
                    <div className="flex flex-wrap gap-2 text-sm font-semibold">
                        {['Technologies', 'Digital marketing', 'Business'].map((cat, i) => (
                            <button key={i} className={`px-5 py-2.5 rounded-xl border transition-all ${i === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <PostGrid posts={remainingPosts} loading={loading && posts.length === 0} />
            </div>
        </div>
    );
}
