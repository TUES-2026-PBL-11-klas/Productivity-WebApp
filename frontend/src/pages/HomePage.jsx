import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useWorkspaces } from "../context/WorkspacesContext";
import { Plus, Calendar, Lock, Users, X, Search } from "lucide-react";
import { searchItems } from "../api/search";

const mockEvents = [
    { id: 1, title: "Team standup", date: "Today, 10:00 AM", color: "bg-primary/20 text-primary" },
    { id: 2, title: "Design review", date: "Today, 2:00 PM", color: "bg-brand-400/20 text-brand-400" },
    { id: 3, title: "Sprint planning", date: "Tomorrow, 9:00 AM", color: "bg-emerald-500/20 text-emerald-400" },
];

const HomePage = () => {
    const { user } = useAuth();
    const { create } = useWorkspaces();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchInputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const rawName = user?.displayName || user?.email?.split("@")[0] || "";
    const firstName = rawName
        ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
        : "there";

    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.trim().length === 0) {
            setSearchResults(null);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await searchItems(query);
                setSearchResults(response.data);
                setShowSearchResults(true);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults(null);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleCreate = (type) => {
        const id = create("Untitled Workspace", type);
        setShowModal(false);
        navigate(`/dashboard/workspace/${id}`);
    };

    return (
        <div className="flex flex-col items-center px-6 py-16 animate-fade-in">
            <div className="w-full max-w-2xl mb-8" ref={searchInputRef}>
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        placeholder="Search pages, blocks, and more..."
                        className="input-dark w-full pl-12"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {showSearchResults && searchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-700 border border-border rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
                        {searchResults.pages && searchResults.pages.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                                    Pages
                                </div>
                                {searchResults.pages.map((page) => (
                                    <button
                                        key={page.id}
                                        onClick={() => {
                                            navigate(`/dashboard/workspace/${page.workspace_id}/page/${page.id}`);
                                            setShowSearchResults(false);
                                            setSearchQuery("");
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-surface-600 transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-sm text-foreground truncate">{page.title}</span>
                                    </button>
                                ))}
                            </>
                        )}

                        {searchResults.blocks && searchResults.blocks.length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                                    Blocks
                                </div>
                                {searchResults.blocks.map((block) => (
                                    <button
                                        key={block.id}
                                        onClick={() => {
                                            navigate(`/dashboard/workspace/${block.page_id}`);
                                            setShowSearchResults(false);
                                            setSearchQuery("");
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-surface-600 transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-brand-400" />
                                        <span className="text-sm text-foreground truncate">{block.type}</span>
                                    </button>
                                ))}
                            </>
                        )}

                        {(!searchResults.pages || searchResults.pages.length === 0) &&
                            (!searchResults.blocks || searchResults.blocks.length === 0) && (
                                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                    </div>
                )}
            </div>
            {/* Greeting */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-center">
                Good to see you, <span className="text-primary">{firstName}</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-center max-w-md">
                Here's what's on your schedule. Ready to get productive?
            </p>

            {/* Calendar widget */}
            <div className="mt-10 w-full max-w-lg card-gradient p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
                </div>
                <div className="space-y-3">
                    {mockEvents.map((ev) => (
                        <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-700/50">
                            <div className={`w-2 h-2 rounded-full ${ev.color.split(" ")[0].replace("/20", "")}`}
                                style={{ background: "currentColor" }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{ev.title}</p>
                                <p className="text-xs text-muted-foreground">{ev.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create workspace button */}
            <button
                onClick={() => setShowModal(true)}
                className="btn-primary mt-8 max-w-xs flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Create Workspace
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}>
                    <div className="card-gradient p-8 w-full max-w-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-foreground">New Workspace</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-5">Choose your workspace type:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleCreate("private")}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-surface-700/50 hover:bg-surface-600/50 hover:border-primary/30 transition-all"
                            >
                                <Lock size={24} className="text-primary" />
                                <span className="text-sm font-medium text-foreground">Private</span>
                                <span className="text-xs text-muted-foreground text-center">Only you can access</span>
                            </button>
                            <button
                                onClick={() => handleCreate("shared")}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-surface-700/50 hover:bg-surface-600/50 hover:border-primary/30 transition-all"
                            >
                                <Users size={24} className="text-primary" />
                                <span className="text-sm font-medium text-foreground">Shared</span>
                                <span className="text-xs text-muted-foreground text-center">Collaborate with others</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
