import { Inbox as InboxIcon, Bell } from "lucide-react";

const InboxPage = () => (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
            <InboxIcon size={24} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        </div>
        <div className="space-y-2">
            {mockNotifs.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-4 rounded-xl bg-surface-800 border border-border">
                    <Bell size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm text-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const mockNotifs = [
    { id: 1, message: "You were added to 'Design System' workspace", time: "2 hours ago" },
    { id: 2, message: "New comment on 'Sprint Notes'", time: "5 hours ago" },
    { id: 3, message: "Workspace 'Q1 Planning' was shared with you", time: "1 day ago" },
];

export default InboxPage;
