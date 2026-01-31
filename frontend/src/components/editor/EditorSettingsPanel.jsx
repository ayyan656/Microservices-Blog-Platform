import { X, MoreHorizontal } from 'lucide-react';
import TagInput from './TagInput';

/**
 * EditorSettingsPanel - Collapsible right panel
 * Contains: Status, Excerpt, Tags, Actions
 */
export default function EditorSettingsPanel({
    isOpen,
    onClose,
    status,
    onStatusChange,
    excerpt,
    onExcerptChange,
    tags,
    onTagsChange,
    onSaveAsDraft,
    onPublish,
    loading = false,
}) {
    return (
        <aside className={`editor-settings-panel ${isOpen ? 'open' : ''}`}>
            {/* Header */}
            <div className="editor-settings-header">
                <h2 className="editor-settings-title">Post Settings</h2>
                <button
                    type="button"
                    className="editor-settings-close"
                    onClick={onClose}
                    aria-label="Close settings panel"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="editor-settings-content">
                {/* Status */}
                <div className="editor-settings-section">
                    <label className="editor-settings-label">Status</label>
                    <select
                        className="editor-settings-select"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                {/* Excerpt */}
                <div className="editor-settings-section">
                    <label className="editor-settings-label">Excerpt</label>
                    <textarea
                        className="editor-settings-textarea"
                        placeholder="Short summary shown in previews..."
                        value={excerpt}
                        onChange={(e) => onExcerptChange(e.target.value)}
                    />
                </div>

                {/* Tags */}
                <div className="editor-settings-section">
                    <label className="editor-settings-label">Tags</label>
                    <TagInput
                        tags={tags}
                        onTagsChange={onTagsChange}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="editor-settings-actions">
                <button
                    type="button"
                    className="editor-btn-secondary"
                    onClick={onSaveAsDraft}
                    disabled={loading}
                >
                    Save as draft
                </button>
                <button
                    type="button"
                    className="editor-btn-primary"
                    onClick={onPublish}
                    disabled={loading}
                >
                    {loading ? 'Publishing...' : 'Publish'}
                </button>
            </div>
        </aside>
    );
}
