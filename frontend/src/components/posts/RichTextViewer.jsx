import DOMPurify from 'dompurify';

export default function RichTextViewer({ content }) {
    const sanitizedContent = DOMPurify.sanitize(content || '', {
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'blockquote', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'img'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class'],
    });

    return (
        <div className="article-content" style={{ textAlign: 'left' }}>
            <div
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                className="prose prose-lg prose-slate max-w-none"
                style={{ textAlign: 'left' }}
            />
            <style>{`
                .article-content h1, 
                .article-content h2, 
                .article-content h3 {
                    font-family: 'Inter', sans-serif;
                    letter-spacing: -0.02em;
                }
                .article-content h2 {
                    font-size: 1.8em;
                    font-weight: 700;
                    margin-top: 2em;
                    margin-bottom: 0.5em;
                }
                .article-content h3 {
                    font-size: 1.4em;
                    font-weight: 600;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                }
                .article-content p {
                    font-family: 'Merriweather', serif;
                    font-size: 1.125rem;
                    line-height: 2;
                    color: #292929;
                    margin-bottom: 2em;
                }
                .article-content a {
                    color: inherit;
                    text-decoration: underline;
                    text-decoration-color: #e5e7eb;
                    text-underline-offset: 4px;
                    transition: all 0.2s;
                }
                .article-content a:hover {
                    color: #FF4405;
                    text-decoration-color: #FF4405;
                }
                .article-content ul, .article-content ol {
                    margin-bottom: 2em;
                    padding-left: 1.5em;
                }
                .article-content li {
                    font-family: 'Merriweather', serif;
                    margin-bottom: 0.5em;
                }
                .article-content blockquote {
                    border-left: 3px solid #1a1a1a;
                    padding-left: 1.5em;
                    margin: 2em 0;
                    font-style: italic;
                    color: #525252;
                }
            `}</style>
        </div>
    );
}
