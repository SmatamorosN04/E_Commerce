export const CatalogSkeleton = () => (
    <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="h-8 bg-gray-50 w-1/4 mb-12 animate-pulse rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="bg-gray-50 aspect-[4/5] w-full rounded-sm animate-pulse" />
                    <div className="h-3 bg-gray-50 w-3/4 animate-pulse rounded" />
                    <div className="h-3 bg-gray-50 w-1/2 animate-pulse rounded" />
                </div>
            ))}
        </div>
    </div>
);