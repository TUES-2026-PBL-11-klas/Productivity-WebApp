/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WorkspacesContext = createContext(null);

const STORAGE_KEY = "notion_workspaces";

const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
};

const save = (ws) => localStorage.setItem(STORAGE_KEY, JSON.stringify(ws));

export const WorkspacesProvider = ({ children }) => {
    const [allWorkspaces, setAllWorkspaces] = useState(load);

    useEffect(() => { save(allWorkspaces); }, [allWorkspaces]);

    const create = useCallback((name, type) => {
        const ws = {
            id: crypto.randomUUID(),
            name: name || "Untitled",
            type,
            content: "",
            todos: [],
            createdAt: new Date().toISOString(),
            deleted: false,
        };
        setAllWorkspaces((prev) => [...prev, ws]);
        return ws.id;
    }, []);

    const update = useCallback((id, data) => {
        setAllWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    }, []);

    const trash = useCallback((id) => {
        setAllWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, deleted: true } : w)));
    }, []);

    const restore = useCallback((id) => {
        setAllWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, deleted: false } : w)));
    }, []);

    const permanentDelete = useCallback((id) => {
        setAllWorkspaces((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const active = allWorkspaces.filter((w) => !w.deleted);
    const trashed = allWorkspaces.filter((w) => w.deleted);

    return (
        <WorkspacesContext.Provider value={{ workspaces: active, trashed, create, update, trash, restore, permanentDelete }}>
            {children}
        </WorkspacesContext.Provider>
    );
};

export const useWorkspaces = () => {
    const ctx = useContext(WorkspacesContext);
    if (!ctx) throw new Error("useWorkspaces must be used within WorkspacesProvider");
    return ctx;
};
