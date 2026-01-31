import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts.api';
import { EditorLayout } from '../components/editor';

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            await createPost(formData);
        } catch (err) {
            setError(err.message || 'Failed to save post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            await createPost(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to publish post');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && (
                <div
                    className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg"
                    style={{ transform: 'translateX(-50%)' }}
                >
                    {error}
                </div>
            )}
            <EditorLayout
                onSave={handleSave}
                onPublish={handlePublish}
                loading={loading}
                mode="create"
            />
        </>
    );
}
