import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createComment } from '../../api/comments.api';
import { handleApiError } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export default function CommentForm({ postId, parentCommentId = null, onSuccess }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            await createComment({
                postId,
                content: data.content,
                parentCommentId,
                authorName: !isAuthenticated ? data.authorName : undefined,
            });
            reset();
            onSuccess?.();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!isAuthenticated && (
                    <div>
                        <input
                            {...register('authorName', {
                                required: !isAuthenticated ? 'Name is required' : false,
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters',
                                },
                            })}
                            type="text"
                            className="input-field"
                            placeholder="Your name (or leave blank for 'Anonymous')"
                        />
                        {errors.authorName && (
                            <p className="text-red-600 text-sm mt-1">{errors.authorName.message}</p>
                        )}
                    </div>
                )}

                <div>
                    <textarea
                        {...register('content', {
                            required: 'Comment cannot be empty',
                            minLength: {
                                value: 1,
                                message: 'Comment must have at least 1 character',
                            },
                        })}
                        className="input-field resize-y"
                        rows={parentCommentId ? 2 : 4}
                        placeholder={parentCommentId ? 'Write a reply...' : 'Write a comment...'}
                    />
                    {errors.content && (
                        <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Posting...' : parentCommentId ? 'Post Reply' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
}
