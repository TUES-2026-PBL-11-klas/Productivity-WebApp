import { Calendar as CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react";

const mockEvents = [
    { id: 1, title: "Team standup", time: "10:00 AM", day: "Mon" },
    { id: 2, title: "Design review", time: "2:00 PM", day: "Mon" },
    { id: 3, title: "Sprint planning", time: "9:00 AM", day: "Tue" },
    { id: 4, title: "1-on-1 with manager", time: "11:00 AM", day: "Wed" },
    { id: 5, title: "Demo day", time: "3:00 PM", day: "Fri" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const CalendarPage = () => (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
                <CalendarIcon size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
            </div>
            <div className="flex items-center gap-2">
                <button className="btn-primary flex items-center gap-2 px-3 h-9 text-xs">
                    <Plus size={14} />
                    Add Event
                </button>
                <button className="border border-border bg-surface-800 hover:bg-surface-700 text-xs px-3 h-9 rounded-md flex items-center gap-2 transition-colors">
                    <Pencil size={14} />
                    Edit
                </button>
                <button className="border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs px-3 h-9 rounded-md flex items-center gap-2 transition-colors">
                    <Trash2 size={14} />
                    Delete
                </button>
            </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
            {days.map((day) => (
                <div key={day}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">{day}</p>
                    <div className="space-y-2">
                        {mockEvents.filter((e) => e.day === day).map((ev) => (
                            <div key={ev.id} className="p-3 rounded-lg bg-surface-800 border border-border">
                                <p className="text-sm font-medium text-foreground">{ev.title}</p>
                                <p className="text-xs text-muted-foreground">{ev.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CalendarPage;
