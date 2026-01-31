import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useEffect, useCallback, useState, useRef } from 'react';
import { Bold, Italic, Heading2, LinkIcon } from 'lucide-react';

/**
 * EditorContent - Rich text body editor with TipTap
 * Features: Floating toolbar on selection, placeholder
 */
export default function EditorContentComponent({ value, onChange }) {
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const toolbarRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
                emptyEditorClass: 'is-empty',
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-inline-image',
                },
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            const hasSelection = from !== to;

            if (hasSelection) {
                // Get selection coordinates
                const { view } = editor;
                const { node: domNode } = view.domAtPos(from);
                const element = domNode.nodeType === Node.TEXT_NODE
                    ? domNode.parentElement
                    : domNode;

                if (element) {
                    const rect = element.getBoundingClientRect();
                    const editorRect = view.dom.getBoundingClientRect();

                    setToolbarPosition({
                        top: rect.top - editorRect.top - 45,
                        left: Math.min(rect.left - editorRect.left, editorRect.width - 180),
                    });
                    setShowToolbar(true);
                }
            } else {
                setShowToolbar(false);
            }
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    // Hide toolbar on blur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
                setShowToolbar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Link handler
    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="editor-content" style={{ position: 'relative' }}>
            {/* Floating Toolbar */}
            {showToolbar && (
                <div
                    ref={toolbarRef}
                    className="editor-floating-toolbar"
                    style={{
                        position: 'absolute',
                        top: toolbarPosition.top,
                        left: toolbarPosition.left,
                        zIndex: 50,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`editor-floating-toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                        title="Bold"
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`editor-floating-toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                        title="Italic"
                    >
                        <Italic size={16} />
                    </button>
                    <div className="editor-floating-toolbar-divider" />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`editor-floating-toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
                        title="Heading"
                    >
                        <Heading2 size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={setLink}
                        className={`editor-floating-toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
                        title="Link"
                    >
                        <LinkIcon size={16} />
                    </button>
                </div>
            )}

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
