/**
 * Skeleton de chargement pour les tables (Pigeons, Couples, etc.)
 */
export function TableSkeleton({ rows = 10, columns = 5 }) {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header avec filtres */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="h-10 w-48 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded-lg" />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-9 w-64 bg-gray-200 rounded-lg" />
                <div className="h-9 w-40 bg-gray-200 rounded-lg" />
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 border-b border-gray-200 p-4">
                    <div className="flex gap-4">
                        {[...Array(columns)].map((_, i) => (
                            <div key={i} className="h-4 flex-1 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>

                {/* Rows */}
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 p-4 last:border-b-0">
                        <div className="flex gap-4">
                            {[...Array(columns)].map((_, j) => (
                                <div key={j} className="h-4 flex-1 bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
