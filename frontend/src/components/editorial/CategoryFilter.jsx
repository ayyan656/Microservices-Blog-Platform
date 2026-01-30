/**
 * CategoryFilter Component
 * Horizontal category filter bar with smooth transitions
 */
export default function CategoryFilter({
    categories,
    activeCategory,
    onCategoryChange
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* All category option */}
            <button
                onClick={() => onCategoryChange('All')}
                className={`
                    px-5 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-300 border
                    ${activeCategory === 'All' || !activeCategory
                        ? 'bg-editorial-text text-white border-editorial-text shadow-md'
                        : 'bg-white text-editorial-muted border-gray-200 hover:border-editorial-accent hover:text-editorial-accent'
                    }
                `}
            >
                All
            </button>

            {/* Dynamic categories */}
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`
                        px-5 py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-300 border
                        ${activeCategory === category
                            ? 'bg-editorial-text text-white border-editorial-text shadow-md'
                            : 'bg-white text-editorial-muted border-gray-200 hover:border-editorial-accent hover:text-editorial-accent'
                        }
                    `}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
