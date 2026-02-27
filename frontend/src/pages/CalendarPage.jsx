import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react";

const mockEvents = [
  { id: 1, title: "Team standup", time: "10:00 AM", day: "Mon" },
  { id: 2, title: "Design review", time: "2:00 PM", day: "Mon" },
  { id: 3, title: "Sprint planning", time: "9:00 AM", day: "Tue" },
  { id: 4, title: "1-on-1 with manager", time: "11:00 AM", day: "Wed" },
  { id: 5, title: "Demo day", time: "3:00 PM", day: "Fri" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const CalendarPage = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    day: days[0],
    time: "",
  });

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingId(null);
    setForm({
      title: "",
      day: days[0],
      time: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (!events.length) return;

    const eventToEdit =
      events.find((ev) => ev.id === selectedEventId) ?? events[0];

    setModalMode("edit");
    setEditingId(eventToEdit.id);
    setForm({
      title: eventToEdit.title,
      day: eventToEdit.day,
      time: eventToEdit.time,
    });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!events.length) return;

    const idToDelete = selectedEventId ?? events[0].id;
    setEvents((prev) => prev.filter((ev) => ev.id !== idToDelete));
    if (selectedEventId === idToDelete) {
      setSelectedEventId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.time.trim()) {
      return;
    }

    if (modalMode === "add" || editingId == null) {
      const newEvent = {
        id: Date.now(),
        title: form.title.trim(),
        day: form.day,
        time: form.time.trim(),
      };
      setEvents((prev) => [...prev, newEvent]);
      setSelectedEventId(newEvent.id);
    } else {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                title: form.title.trim(),
                day: form.day,
                time: form.time.trim(),
              }
            : ev
        )
      );
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 px-3 h-9 text-xs w-auto"
          >
            <Plus size={14} />
            Add Event
          </button>
          <button
            type="button"
            onClick={handleOpenEdit}
            className="border border-border bg-surface-800 hover:bg-surface-700 text-xs px-3 h-9 rounded-md flex items-center gap-2 transition-colors"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs px-3 h-9 rounded-md flex items-center gap-2 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {days.map((day) => (
          <div key={day}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">
              {day}
            </p>
            <div className="space-y-2">
              {events
                .filter((e) => e.day === day)
                .map((ev) => {
                  const isSelected = ev.id === selectedEventId;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEventId(ev.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-surface-700 border-primary/60"
                          : "bg-surface-800 border-border hover:bg-surface-700"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {ev.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{ev.time}</p>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card-gradient w-full max-w-md p-6 shadow-xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {modalMode === "add" ? "Add Event" : "Edit Event"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <input
                    className="input-dark"
                    placeholder="e.g. Team standup"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Day
                    </label>
                    <select
                      className="input-dark"
                      value={form.day}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, day: e.target.value }))
                      }
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Time
                    </label>
                    <input
                      className="input-dark"
                      placeholder="10:00 AM"
                      value={form.time}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, time: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 h-9 rounded-md border border-border text-xs text-muted-foreground hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary w-auto h-9 px-4 text-xs">
                    {modalMode === "add" ? "Create event" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
