import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { deletePost } from '../../api/posts.api';
import { formatDate } from '../../utils/helpers';

export default function PostCard({ post }) {
    const { user, isAuthenticated } = useContext(AuthContext);
    const isOwner = isAuthenticated && user && (String(user.id) === String(post.authorId) || String(user._id) === String(post.authorId));
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent link navigation
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(post._id);
                // Simple reload to refresh list - in a real app query invalidation is better
                window.location.reload();
            } catch (error) {
                alert('Failed to delete post');
            }
        }
    };

    return (
        <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">

            {/* Image Thumbnail */}
            {post.imageUrl && (
                <div className="h-64 overflow-hidden relative">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${post.status === 'published'
                        ? 'bg-white/90 text-green-700 backdrop-blur-sm'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {post.status}
                    </span>
                </div>
            )}

            <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">
                    <span>Technologies</span> {/* Static category based on screenshot layout */}
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold mb-4 leading-tight text-gray-900 group-hover:text-amber-600 transition-colors">
                    <Link to={`/posts/${post._id}`} className="block">
                        {post.title}
                    </Link>
                </h2>

                {/* Excerpt */}
                <p className="text-gray-500 mb-8 line-clamp-3 text-sm leading-relaxed flex-1 font-medium">
                    {post.excerpt}
                </p>

                {/* Footer Actions */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center relative">
                    {/* Author & Stats */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            {/* Placeholder avatar for UI/UX demo */}
                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <span>User #{post.authorId}</span>
                        </div>

                        {/* Fake stats for UI match */}
                        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><span className="text-[10px]">♥</span> 2.1k</span>
                            <span className="flex items-center gap-1"><span className="text-[10px]">👁</span> 735</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <div className="flex gap-1 mr-2 bg-gray-50 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-12 right-0 shadow-lg border border-gray-100">
                                {post.status === 'draft' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.confirm('Publish this post?')) {
                                                window.location.href = `/edit-post/${post._id}`;
                                            }
                                        }}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                        title="Publish"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                )}
                                <Link to={`/edit-post/${post._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </Link>
                                <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        )}

                        <Link
                            to={`/posts/${post._id}`}
                            className="bg-[#FF4405] hover:bg-[#E63900] text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-orange-200 active:scale-95"
                        >
                            <svg className="w-4 h-4 transform group-hover:rotate-[-45deg] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
