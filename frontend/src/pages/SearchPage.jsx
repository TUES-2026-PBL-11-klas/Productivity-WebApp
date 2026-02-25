import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../context/WorkspacesContext";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const { workspaces } = useWorkspaces();
    const navigate = useNavigate();

    const filtered = query.trim()
        ? workspaces.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground mb-6">Search</h1>
            <div className="relative mb-6">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search workspaces..."
                    className="input-dark pl-12"
                />
            </div>
            {query.trim() && (
                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-8">No results found.</p>
                    ) : (
                        filtered.map((w) => (
                            <button key={w.id} onClick={() => navigate(`/dashboard/workspace/${w.id}`)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                <span className="text-sm text-foreground">{w.name}</span>
                                <span className="text-xs text-muted-foreground ml-auto">{w.type}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
