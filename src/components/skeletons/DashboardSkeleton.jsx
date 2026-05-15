/**
 * Skeleton de chargement pour le Dashboard
 */
export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Hero card skeleton */}
            <div className="h-40 bg-gray-200 rounded-lg" />

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg" />
                ))}
            </div>

            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg" />
                <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
        </div>
    )
}
