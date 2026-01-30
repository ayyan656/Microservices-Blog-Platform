import { useState, useEffect } from 'react';
import { getCommentsByPost } from '../../api/comments.api';
import { handleApiError } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentList({ postId, postAuthorId }) {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if current user is the post author
    const isPostAuthor = isAuthenticated && user && (String(user.id) === String(postAuthorId) || String(user._id) === String(postAuthorId));

    const fetchComments = async () => {
        try {
            const data = await getCommentsByPost(postId);
            setComments(data.data || []);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // Organize comments into threads
    const organizeComments = (comments) => {
        const commentMap = new Map();
        const topLevelComments = [];

        // First pass: create a map of all comments
        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Second pass: organize into threads
        comments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.id);

            if (comment.parent_comment_id) {
                const parent = commentMap.get(comment.parent_comment_id);
                if (parent) {
                    parent.replies.push(commentWithReplies);
                }
            } else {
                topLevelComments.push(commentWithReplies);
            }
        });

        return topLevelComments;
    };

    const renderComment = (comment, level = 0) => {
        return (
            <div key={comment.id} className="space-y-4">
                <CommentItem
                    comment={comment}
                    postId={postId}
                    postAuthorId={postAuthorId}
                    onUpdate={fetchComments}
                    level={level}
                />

                {/* Render replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-4">
                        {comment.replies.map(reply => renderComment(reply, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const threadedComments = organizeComments(comments);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">
                Comments {comments.length > 0 && `(${comments.length})`}
            </h2>

            {/* Comment Form - Hidden for post authors (they can only reply) */}
            {!isPostAuthor && (
                <CommentForm postId={postId} onSuccess={fetchComments} />
            )}
            {isPostAuthor && (
                <p className="text-gray-500 text-sm italic">
                    As the post author, you can reply to comments but not add new top-level comments.
                </p>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Comments List */}
            {!loading && threadedComments.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                </p>
            )}

            {!loading && threadedComments.length > 0 && (
                <div className="space-y-6">
                    {threadedComments.map(comment => renderComment(comment))}
                </div>
            )}
        </div>
    );
}
