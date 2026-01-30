import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts, publishPost, deletePost } from '../api/posts.api';
import { handleApiError, formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import { Link } from 'react-router-dom';

export default function DraftsPage() { // Kept name DraftsPage to avoid router changes, but UI is Dashboard
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('published'); // 'published' | 'draft'

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getAllPosts();

            // Filter for ALL posts owned by current user
            const userPosts = data.posts.filter((post) => {
                return String(post.authorId) === String(user?.id) ||
                    String(post.authorId) === String(user?._id);
            });

            setPosts(userPosts);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (postId) => {
        if (!window.confirm('Publish this draft? It will become public.')) {
            return;
        }
        try {
            await publishPost(postId);
            // Optimistic update or refresh
            fetchPosts();
            setActiveTab('published');
        } catch (err) {
            alert(handleApiError(err));
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Permanently delete this post?')) {
            return;
        }
        try {
            await deletePost(postId);
            // Optimistic update
            setPosts(posts.filter(p => p._id !== postId));
        } catch (err) {
            alert(handleApiError(err));
        }
    };

    // Filter based on active tab
    const filteredPosts = posts.filter(post => post.status === (activeTab === 'draft' ? 'draft' : 'published'));

    if (loading) return <Loader />;

    return (
        <div className="container-main py-12 min-h-[80vh]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your stories and stats</p>
                </div>
                <Link to="/create-post" className="btn btn-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Story
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 border border-red-100">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'published' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Published
                    {activeTab === 'published' && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('draft')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'draft' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Drafts
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {posts.filter(p => p.status === 'draft').length}
                    </span>
                    {activeTab === 'draft' && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 rounded-t-full"></span>
                    )}
                </button>
            </div>

            {/* List View - Hashnode style */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="text-4xl mb-4 text-gray-300">📭</div>
                        <h3 className="text-lg font-medium text-slate-900">No {activeTab} posts</h3>
                        <p className="text-slate-500 mb-6">Write something amazing today.</p>
                        {activeTab === 'published' && posts.filter(p => p.status === 'draft').length > 0 && (
                            <button onClick={() => setActiveTab('draft')} className="text-blue-600 font-medium hover:underline">
                                Check your drafts
                            </button>
                        )}
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post._id} className="group bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-6">
                            {post.imageUrl && (
                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            )}

                            <div className="flex-1 flex flex-col">
                                <Link to={post.status === 'published' ? `/posts/${post._id}` : `/edit-post/${post._id}`} className="group-hover:text-blue-600 transition-colors">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                                    {post.excerpt || 'No excerpt'}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
                                        <span>{formatDate(post.updatedAt)}</span>
                                        {post.status === 'published' && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-slate-500">
                                                    👍 12 {/* Mock stats */}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to={`/edit-post/${post._id}`}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Link>

                                        {post.status === 'draft' && (
                                            <button
                                                onClick={() => handlePublish(post._id)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Publish"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
