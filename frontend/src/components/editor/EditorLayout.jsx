import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import EditorTopBar from './EditorTopBar';
import EditorCanvas from './EditorCanvas';
import EditorSettingsPanel from './EditorSettingsPanel';
import './editor.css';

/**
 * EditorLayout - Main container for the post editor
 * Manages shared state (title, content, excerpt, tags, status)
 * Handles autosave with debounced API calls
 */
export default function EditorLayout({
    initialData = {},
    onSave,
    onPublish,
    loading = false,
    mode = 'create', // 'create' or 'edit'
}) {
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'

    // Post data state
    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.content || '');
    const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
    const [tags, setTags] = useState(initialData.tags || []);
    const [status, setStatus] = useState(initialData.status || 'draft');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null);

    // Track if content has changed for autosave
    const hasChangedRef = useRef(false);

    // Create FormData for API submission
    const buildFormData = useCallback(() => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (excerpt) formData.append('excerpt', excerpt);
        formData.append('status', status);
        if (tags.length > 0) {
            formData.append('tags', JSON.stringify(tags));
        }
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (initialData.imageUrl) {
            formData.append('imageUrl', initialData.imageUrl);
        }
        return formData;
    }, [title, content, excerpt, status, tags, imageFile, initialData.imageUrl]);

    // Debounced autosave function
    const debouncedSave = useCallback(
        debounce(async (formData) => {
            if (!hasChangedRef.current) return;

            setSaveStatus('saving');
            try {
                if (onSave) {
                    await onSave(formData);
                }
                setSaveStatus('saved');
                hasChangedRef.current = false;
            } catch (error) {
                console.error('Autosave failed:', error);
                setSaveStatus('unsaved');
            }
        }, 2000),
        [onSave]
    );

    // Trigger autosave when content changes (only in edit mode)
    useEffect(() => {
        // Only autosave in edit mode when there's meaningful content
        // In create mode, user must explicitly save via the settings panel
        if (mode === 'edit' && title.trim() && content.trim()) {
            hasChangedRef.current = true;
            setSaveStatus('unsaved');
            debouncedSave(buildFormData());
        }

        return () => {
            debouncedSave.cancel();
        };
    }, [title, content, excerpt, tags, status, debouncedSave, buildFormData, mode]);

    // Handle back navigation
    const handleBack = () => {
        navigate('/drafts');
    };

    // Handle publish button click (opens panel)
    const handlePublishClick = () => {
        setIsPanelOpen(true);
    };

    // Handle image selection
    const handleImageSelect = (file) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Handle image removal
    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // Handle save as draft
    const handleSaveAsDraft = async () => {
        setStatus('draft');
        setSaveStatus('saving');
        try {
            const formData = buildFormData();
            formData.set('status', 'draft');
            if (onSave) {
                await onSave(formData);
            }
            setSaveStatus('saved');
        } catch (error) {
            console.error('Save failed:', error);
            setSaveStatus('unsaved');
        }
    };

    // Handle final publish
    const handleFinalPublish = async () => {
        setSaveStatus('saving');
        try {
            const formData = buildFormData();
            formData.set('status', 'published');
            if (onPublish) {
                await onPublish(formData);
            } else if (onSave) {
                await onSave(formData);
            }
            setSaveStatus('saved');
            navigate('/');
        } catch (error) {
            console.error('Publish failed:', error);
            setSaveStatus('unsaved');
        }
    };

    return (
        <div className="editor-page">
            <EditorTopBar
                status={status}
                saveStatus={saveStatus}
                onBack={handleBack}
                onPublish={handlePublishClick}
            />

            <main className="editor-main">
                <div className={`editor-canvas-container ${isPanelOpen ? 'panel-open' : ''}`}>
                    <EditorCanvas
                        title={title}
                        onTitleChange={setTitle}
                        content={content}
                        onContentChange={setContent}
                        imagePreview={imagePreview}
                        onImageSelect={handleImageSelect}
                        onImageRemove={handleImageRemove}
                        excerpt={excerpt}
                        onExcerptChange={setExcerpt}
                        tags={tags}
                        onTagsChange={setTags}
                    />
                </div>

                <EditorSettingsPanel
                    isOpen={isPanelOpen}
                    onClose={() => setIsPanelOpen(false)}
                    status={status}
                    onStatusChange={setStatus}
                    excerpt={excerpt}
                    onExcerptChange={setExcerpt}
                    tags={tags}
                    onTagsChange={setTags}
                    onSaveAsDraft={handleSaveAsDraft}
                    onPublish={handleFinalPublish}
                    loading={loading}
                />
            </main>
        </div>
    );
}
