import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../api/posts.api';
import { handleApiError, formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import PostActions from '../components/posts/PostActions';
import CommentList from '../components/comments/CommentList';
import Loader from '../components/common/Loader';
import RichTextViewer from '../components/posts/RichTextViewer';

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(id);
                const fetchedPost = data.post;

                // Check access: drafts only viewable by owner
                if (fetchedPost.status === 'draft') {
                    const isOwner = isAuthenticated && user && (
                        String(user.id) === String(fetchedPost.authorId) ||
                        String(user._id) === String(fetchedPost.authorId)
                    );

                    if (!isOwner) {
                        setError('This post is not available');
                        setPost(null);
                        setLoading(false);
                        return;
                    }
                }

                setPost(fetchedPost);
            } catch (err) {
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user, isAuthenticated]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await deletePost(id);
            navigate('/');
        } catch (err) {
            alert(handleApiError(err));
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error || !post) {
        return (
            <div className="container-main py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Post not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="container-main py-12">
            <article className="max-w-4xl mx-auto">
                {/* Hero Image */}
                {post.imageUrl && (
                    <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                        />
                    </div>
                )}

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                        <span>•</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {post.status}
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

                    {post.excerpt && (
                        <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                        <span>By User #{post.authorId}</span>
                    </div>
                </header>

                {/* Content */}
                <RichTextViewer content={post.content} />

                {/* Actions */}
                <PostActions post={post} onDelete={handleDelete} />

                {/* Metadata */}
                <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                        <span className="font-medium">Created:</span>{' '}
                        {formatDate(post.createdAt)}
                    </div>
                    <div>
                        <span className="font-medium">Updated:</span>{' '}
                        {formatDate(post.updatedAt)}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <CommentList postId={post._id} postAuthorId={post.authorId} />
                </div>
            </article>
        </div>
    );
}
