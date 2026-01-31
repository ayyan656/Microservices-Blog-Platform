import { ArrowLeft, MoreHorizontal, Check } from 'lucide-react';

/**
 * EditorTopBar - Floating navigation and status bar
 * Contains: Back button, status badge, save indicator, publish button
 */
export default function EditorTopBar({
    status = 'draft',
    saveStatus = 'saved',
    onBack,
    onPublish,
}) {
    const getSaveIndicator = () => {
        switch (saveStatus) {
            case 'saving':
                return (
                    <span className="editor-save-indicator saving">
                        <span className="animate-pulse">Saving...</span>
                    </span>
                );
            case 'saved':
                return (
                    <span className="editor-save-indicator saved">
                        <Check size={16} />
                        <span>Saved</span>
                    </span>
                );
            case 'unsaved':
            default:
                return (
                    <span className="editor-save-indicator">
                        <span>Unsaved changes</span>
                    </span>
                );
        }
    };

    return (
        <header className="editor-top-bar">
            <div className="editor-top-bar-left">
                <button
                    type="button"
                    className="editor-back-btn"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                <span className={`editor-status-badge ${status === 'published' ? 'published' : ''}`}>
                    {status === 'published' ? 'Published' : 'Draft'}
                </span>

                <button
                    type="button"
                    className="editor-menu-btn"
                    aria-label="More options"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="editor-top-bar-right">
                {getSaveIndicator()}

                <button
                    type="button"
                    className="editor-publish-btn"
                    onClick={onPublish}
                >
                    Publish
                </button>
            </div>
        </header>
    );
}
