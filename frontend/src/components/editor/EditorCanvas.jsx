import { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import EditorTitleBlock from './EditorTitleBlock';
import EditorMediaBlock from './EditorMediaBlock';
import EditorContent from './EditorContent';

/**
 * EditorCanvas - Main writing area
 * Contains title, media block, content editor, inline tags and excerpt
 */
export default function EditorCanvas({
    title,
    onTitleChange,
    content,
    onContentChange,
    imagePreview,
    onImageSelect,
    onImageRemove,
    excerpt,
    onExcerptChange,
    tags,
    onTagsChange,
}) {
    const [isExcerptOpen, setIsExcerptOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');

    // Handle adding a tag
    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/^#/, '');
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    return (
        <div className="editor-canvas">
            {/* Title Block */}
            <EditorTitleBlock
                value={title}
                onChange={onTitleChange}
            />

            {/* Media Block */}
            <EditorMediaBlock
                imagePreview={imagePreview}
                onImageSelect={onImageSelect}
                onImageRemove={onImageRemove}
            />

            {/* Content Editor */}
            <EditorContent
                value={content}
                onChange={onContentChange}
            />

            {/* Inline Tags Input */}
            <div className="editor-inline-tags">
                <Plus size={16} className="editor-inline-tags-icon" />
                <input
                    type="text"
                    className="editor-inline-tags-input"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                />
            </div>

            {/* Inline Excerpt Accordion */}
            <div className="editor-inline-excerpt">
                <div
                    className="editor-inline-excerpt-header"
                    onClick={() => setIsExcerptOpen(!isExcerptOpen)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setIsExcerptOpen(!isExcerptOpen);
                        }
                    }}
                >
                    <span className="editor-inline-excerpt-title">Excerpt</span>
                    <ChevronDown
                        size={18}
                        className={`editor-inline-excerpt-toggle ${isExcerptOpen ? 'open' : ''}`}
                    />
                </div>

                {isExcerptOpen && (
                    <div className="editor-inline-excerpt-content">
                        <textarea
                            className="editor-inline-excerpt-textarea"
                            placeholder="Short summary shown in previews..."
                            value={excerpt}
                            onChange={(e) => onExcerptChange(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
