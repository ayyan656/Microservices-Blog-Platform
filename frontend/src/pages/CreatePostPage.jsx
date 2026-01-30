import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts.api';
import { handleApiError } from '../utils/helpers';
import PostForm from '../components/posts/PostForm';

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            await createPost(data);
            navigate('/');
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-main py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Create New Post</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="card">
                    <PostForm onSubmit={handleSubmit} loading={loading} />
                </div>
            </div>
        </div>
    );
}
