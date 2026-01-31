import { useRef } from 'react';
import { Plus, X, ImageIcon } from 'lucide-react';

/**
 * EditorMediaBlock - Image upload/preview component
 * Shows dashed placeholder or image preview
 */
export default function EditorMediaBlock({
    imagePreview,
    onImageSelect,
    onImageRemove,
}) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // If image is selected, show preview
    if (imagePreview) {
        return (
            <div className="editor-media-preview">
                <img src={imagePreview} alt="Cover" />
                <button
                    type="button"
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md hover:bg-white cursor-pointer"
                    onClick={onImageRemove}
                    aria-label="Remove image"
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                    }}
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    // Show upload placeholder
    return (
        <div
            className="editor-media-block"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
            aria-label="Add image"
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                style={{ display: 'none' }}
            />
            <div className="editor-media-block-icon">
                <Plus size={24} />
            </div>
            <div className="editor-media-block-title">Add image</div>
            <div className="editor-media-block-subtitle">Upload or paste an image</div>
        </div>
    );
}
