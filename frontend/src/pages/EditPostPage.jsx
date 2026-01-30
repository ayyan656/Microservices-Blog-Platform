import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../api/posts.api';
import { handleApiError } from '../utils/helpers';
import PostForm from '../components/posts/PostForm';
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
                setError(handleApiError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (data) => {
        setSubmitting(true);
        setError(null);

        try {
            await updatePost(id, data);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError(handleApiError(err));
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
        <div className="container-main py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Edit Post</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="card">
                    <PostForm
                        initialData={post}
                        onSubmit={handleSubmit}
                        loading={submitting}
                    />
                </div>
            </div>
        </div>
    );
}
