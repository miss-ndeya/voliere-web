/**
 * Skeleton de chargement pour la page Volière
 */
export function VoliereSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="space-y-4">
                <div className="h-10 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-96 bg-gray-200 rounded" />
            </div>

            {/* Filtres skeleton */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-8 w-32 bg-gray-200 rounded-full" />
                <div className="h-8 w-36 bg-gray-200 rounded-full" />
                <div className="h-8 w-28 bg-gray-200 rounded-full" />
                <div className="h-9 w-64 bg-gray-200 rounded-lg ml-auto" />
            </div>

            {/* Grille skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                ))}
            </div>
        </div>
    )
}
