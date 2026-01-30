import EditorialCard from './EditorialCard';

/**
 * EditorialGrid Component
 * Asymmetric grid layout for article cards
 * 
 * Layout pattern:
 * - First row: 1 large (8 cols) + 2 small stacked (4 cols)
 * - Subsequent rows: 3 equal columns
 */
export default function EditorialGrid({ posts, loading = false }) {
    // Loading skeleton
    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-12 gap-6 mb-8">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-gray-200 rounded-2xl aspect-[4/3]" />
                        <div className="p-6 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-gray-200 rounded-2xl aspect-[3/2]" />
                        <div className="bg-gray-200 rounded-2xl aspect-[3/2]" />
                    </div>
                </div>
            </div>
        );
    }

    // No posts
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-editorial-muted text-lg">
                    No articles found. Check back soon!
                </p>
            </div>
        );
    }

    // Split posts for asymmetric layout
    const featuredPost = posts[0];
    const sidebarPosts = posts.slice(1, 3);
    const remainingPosts = posts.slice(3);

    return (
        <div className="space-y-8">
            {/* Featured Row: Asymmetric 8+4 layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Large featured card (8 cols) */}
                <div className="col-span-12 lg:col-span-8">
                    <EditorialCard post={featuredPost} variant="large" />
                </div>

                {/* Sidebar cards (4 cols, stacked) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    {sidebarPosts.map((post) => (
                        <EditorialCard
                            key={post.id}
                            post={post}
                            variant="small"
                        />
                    ))}
                </div>
            </div>

            {/* Border divider */}
            {remainingPosts.length > 0 && (
                <div className="border-t border-gray-200 pt-8" />
            )}

            {/* Remaining posts: 3-column equal grid */}
            {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingPosts.map((post) => (
                        <EditorialCard
                            key={post.id}
                            post={post}
                            variant="large"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
