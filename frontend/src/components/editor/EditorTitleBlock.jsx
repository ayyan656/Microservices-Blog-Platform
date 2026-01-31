import { useRef, useEffect } from 'react';

/**
 * EditorTitleBlock - Large title input
 * Auto-focuses on load, Enter key handling
 */
export default function EditorTitleBlock({ value, onChange }) {
    const inputRef = useRef(null);

    // Auto-focus on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Auto-resize textarea
    const handleInput = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        onChange(textarea.value);
    };

    // Handle Enter key to move to content (prevent new line)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus the content editor (will be handled by parent or sibling)
            const contentEditor = document.querySelector('.editor-content .ProseMirror');
            if (contentEditor) {
                contentEditor.focus();
            }
        }
    };

    return (
        <textarea
            ref={inputRef}
            className="editor-title-input"
            placeholder="Enter title..."
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Post title"
        />
    );
}
