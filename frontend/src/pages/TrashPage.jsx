import { useWorkspaces } from "../context/WorkspacesContext";
import { Trash2, RotateCcw, X, FileText } from "lucide-react";

const TrashPage = () => {
    const { trashed, restore, permanentDelete } = useWorkspaces();

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <Trash2 size={24} className="text-muted-foreground" />
                <h1 className="text-2xl font-bold text-foreground">Trash</h1>
            </div>

            {trashed.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Trash2 size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No deleted workspaces</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {trashed.map((ws) => (
                        <div key={ws.id} className="flex items-center gap-3 p-4 rounded-xl bg-surface-800 border border-border group">
                            <FileText size={18} className="text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{ws.name}</p>
                                <p className="text-xs text-muted-foreground">Deleted · {ws.type}</p>
                            </div>
                            <button onClick={() => restore(ws.id)} className="text-muted-foreground hover:text-primary transition-colors" title="Restore">
                                <RotateCcw size={16} />
                            </button>
                            <button onClick={() => permanentDelete(ws.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete permanently">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrashPage;
