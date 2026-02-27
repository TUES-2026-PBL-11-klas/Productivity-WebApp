import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Zap, Type } from "lucide-react";
import { useAuth } from "../context/useAuth";

const SETTINGS_KEY = "app_settings";

const defaultSettings = {
    reduceMotion: false,
    largeText: false,
};

const SettingsPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setSettings({ ...defaultSettings, ...parsed });
            }
        } catch {
            setSettings(defaultSettings);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

        const body = document.body;
        if (!body) return;

        body.classList.toggle("reduce-motion", settings.reduceMotion);
        body.classList.toggle("large-text", settings.largeText);
    }, [settings]);

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>

            {/* Account info */}
            <div className="card-gradient p-6 space-y-4 mb-8">
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Display Name
                    </label>
                    <p className="text-foreground mt-1">
                        {user?.displayName || (user?.email ? user.email.split("@")[0] : "User")}
                    </p>
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Email
                    </label>
                    <p className="text-foreground mt-1">{user?.email}</p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                    Settings are stored locally in your browser.
                </p>
            </div>

            {/* Preferences */}
            <div className="card-gradient p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Zap size={16} className="text-primary" />
                            Reduce motion
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Turn off most animations for a calmer experience.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleSetting("reduceMotion")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.reduceMotion ? "bg-primary" : "bg-surface-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${
                                settings.reduceMotion ? "translate-x-5" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Type size={16} className="text-primary" />
                            Larger text
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Slightly increase font sizes across the app.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleSetting("largeText")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.largeText ? "bg-primary" : "bg-surface-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${
                                settings.largeText ? "translate-x-5" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
