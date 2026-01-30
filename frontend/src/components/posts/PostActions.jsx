import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PostActions({ post, onDelete }) {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const isOwner = user?.id === post.authorId;

    // Only show actions if user is owner or admin
    if (!isOwner && !isAdmin) {
        return null;
    }

    const handleEdit = () => {
        navigate(`/edit-post/${post._id}`);
    };

    return (
        <div className="flex gap-3 mt-4">
            {isOwner && (
                <button
                    onClick={handleEdit}
                    className="btn btn-secondary text-sm px-4 py-2"
                >
                    Edit
                </button>
            )}

            {(isOwner || isAdmin) && (
                <button
                    onClick={onDelete}
                    className="text-sm px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                    Delete
                </button>
            )}

            {isAdmin && !isOwner && (
                <span className="text-xs text-purple-600 self-center">
                    (Admin Action)
                </span>
            )}
        </div>
    );
}
