import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

export default function PostForm({ initialData, onSubmit, loading }) {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: initialData || {
            title: '',
            content: '',
            excerpt: '',
            status: 'draft',
        },
    });

    const [preview, setPreview] = useState(initialData?.imageUrl || null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onFormSubmit = (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.excerpt) formData.append('excerpt', data.excerpt);
        formData.append('status', data.status);

        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        if (initialData?.imageUrl && !data.image?.[0]) {
            formData.append('imageUrl', initialData.imageUrl);
        }

        onSubmit(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-4xl mx-auto py-12 px-4 relative">

            {/* Top Bar Actions (Notion style floating) */}
            <div className="fixed top-24 right-8 z-40 bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-xl p-2 flex flex-col md:flex-row gap-2">
                <select
                    {...register('status')}
                    className="bg-transparent text-sm font-semibold text-slate-600 outline-none cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <div className="w-px bg-gray-200"></div>
                <button
                    type="submit"
                    disabled={loading}
                    className="text-sm font-bold text-slate-900 px-4 py-1 bg-green-400/20 hover:bg-green-400/30 text-green-800 rounded transition-all"
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* Cover Image Area */}
            <div className="group relative mb-8">
                {preview ? (
                    <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={preview}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Change Cover
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...register('image', { onChange: handleImageChange })}
                            />
                        </label>
                    </div>
                ) : (
                    <label className="flex items-center gap-2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors w-fit px-3 py-2 rounded-lg hover:bg-gray-50 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium">Add Cover</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register('image', { onChange: handleImageChange })}
                        />
                    </label>
                )}
            </div>

            {/* Title Input - Large & Clean */}
            <div className="mb-6">
                <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Untitled"
                    className="w-full text-5xl md:text-6xl font-bold bg-transparent border-none placeholder-gray-200 focus:ring-0 focus:outline-none text-slate-900 p-0"
                    autoComplete="off"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            {/* Excerpt - Optional */}
            <div className="mb-8">
                <textarea
                    {...register('excerpt')}
                    rows={1}
                    placeholder="Add a short summary (optional)..."
                    className="w-full text-xl text-slate-500 bg-transparent border-none resize-none focus:ring-0 focus:outline-none p-0 placeholder-gray-300 font-medium"
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
            </div>

            {/* Content Editor */}
            <div className="min-h-[500px]">
                <Controller
                    name="content"
                    control={control}
                    rules={{ required: 'Content is required' }}
                    render={({ field }) => (
                        // Wrapped to ensure prose styles apply
                        <div className="article-content prose prose-lg prose-slate max-w-none">
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Tell your story..."
                            />
                        </div>
                    )}
                />
                {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
            </div>
        </form>
    );
}
