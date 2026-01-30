import { useState } from 'react';
import { deleteComment } from '../../api/comments.api';
import { handleApiError, formatRelativeTime } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, postId, postAuthorId, onUpdate, level = 0 }) {
    const { user, isAuthenticated } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isHidden, setIsHidden] = useState(comment.is_hidden || false);

    // Check ownership and permissions
    const isCommentOwner = isAuthenticated && user && (String(user.id) === String(comment.user_id) || String(user._id) === String(comment.user_id));
    const isPostAuthor = isAuthenticated && user && (String(user.id) === String(postAuthorId) || String(user._id) === String(postAuthorId));
    const canModerate = isCommentOwner || isPostAuthor;
    const isNested = level > 0;

    // Hide comment from public unless you're the owner or post author
    const shouldHideFromView = isHidden && !canModerate;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await deleteComment(comment.id);
            onUpdate?.();
        } catch (err) {
            alert(handleApiError(err));
        }
    };

    const handleToggleHide = () => {
        // Toggle local hidden state (in production, this would call an API)
        setIsHidden(!isHidden);
        // Note: Backend API for hiding comments would be called here
        // For now, this is frontend-only visibility toggle
    };

    const handleReplySuccess = () => {
        setShowReplyForm(false);
        onUpdate?.();
    };

    // If hidden from public view, don't render
    if (shouldHideFromView) {
        return null;
    }

    return (
        <div className={`comment-item ${isNested ? 'ml-0 md:ml-8 mt-4' : 'mt-6'}`}>
            <div className="flex gap-3 md:gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-gray-200 overflow-hidden">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id || 'anon'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 min-w-0">
                    <div className={`group bg-white border border-gray-200 rounded-xl p-4 ${isHidden ? 'bg-yellow-50 border-yellow-200' : 'hover:border-gray-300'} transition-colors`}>
                        {/* Hidden Badge */}
                        {isHidden && canModerate && (
                            <div className="mb-2">
                                <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Hidden
                                </span>
                            </div>
                        )}

                        {/* Meta Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 text-sm md:text-base">
                                    {comment.user_id ? `User #${comment.user_id}` : (comment.author_name || 'Anonymous')}
                                </span>
                                <span className="text-gray-300 hidden md:inline">•</span>
                                <time className="text-xs text-gray-400 font-medium">
                                    {formatRelativeTime(comment.created_at)}
                                </time>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-slate-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap break-words">
                            {comment.content}
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center gap-4 mt-2 ml-1">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            {showReplyForm ? 'Cancel' : 'Reply'}
                        </button>

                        {canModerate && (
                            <>
                                <button
                                    onClick={handleToggleHide}
                                    className="text-xs md:text-sm font-medium text-slate-500 hover:text-yellow-600 transition-colors"
                                >
                                    {isHidden ? 'Unhide' : 'Hide'}
                                </button>
                                {isCommentOwner && (
                                    <button
                                        onClick={handleDelete}
                                        className="text-xs md:text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-4 animate-fadeIn">
                            <CommentForm
                                postId={postId}
                                parentCommentId={comment.id}
                                onSuccess={handleReplySuccess}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

