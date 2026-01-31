import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../api/posts.api';
import { EditorLayout } from '../components/editor';
import Loader from '../components/common/Loader';

export default function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(id);
                setPost(data.post);
            } catch (err) {
                setError(err.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleSave = async (formData) => {
        setSubmitting(true);
        setError(null);

        try {
            await updatePost(id, formData);
        } catch (err) {
            setError(err.message || 'Failed to save post');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handlePublish = async (formData) => {
        setSubmitting(true);
        setError(null);

        try {
            await updatePost(id, formData);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(err.message || 'Failed to publish post');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error && !post) {
        return (
            <div className="container-main py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

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
                initialData={{
                    title: post?.title || '',
                    content: post?.content || '',
                    excerpt: post?.excerpt || '',
                    status: post?.status || 'draft',
                    tags: post?.tags || [],
                    imageUrl: post?.imageUrl || null,
                }}
                onSave={handleSave}
                onPublish={handlePublish}
                loading={submitting}
                mode="edit"
            />
        </>
    );
}
