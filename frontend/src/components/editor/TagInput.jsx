import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * TagInput - Tag chips component
 * Displays existing tags as removable chips with input to add new ones
 */
export default function TagInput({ tags = [], onTagsChange }) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim().replace(/^#/, '');
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag on backspace when input is empty
            onTagsChange(tags.slice(0, -1));
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            {/* Tag chips */}
            {tags.length > 0 && (
                <div className="editor-tags-container">
                    {tags.map((tag) => (
                        <span key={tag} className="editor-tag">
                            # {tag}
                            <button
                                type="button"
                                className="editor-tag-remove"
                                onClick={() => handleRemoveTag(tag)}
                                aria-label={`Remove tag ${tag}`}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input */}
            <input
                type="text"
                className="editor-tag-input"
                placeholder="Add a tag..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
