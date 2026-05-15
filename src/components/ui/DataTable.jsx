/**
 * Composant de tableau réutilisable et responsive
 * Utilisé pour afficher des données tabulaires avec un style cohérent
 */
export function DataTable({ columns, data, emptyMessage = "Aucune donnée disponible", renderRow }) {
    return (
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index} 
                                    className="text-left p-3 font-medium text-foreground"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => renderRow(item, index))
                        ) : (
                            <tr>
                                <td 
                                    colSpan={columns.length} 
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
