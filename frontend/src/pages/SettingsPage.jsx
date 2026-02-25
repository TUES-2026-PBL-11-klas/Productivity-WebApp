import { Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/useAuth";

const SettingsPage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>

            <div className="card-gradient p-6 space-y-4">
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</label>
                    <p className="text-foreground mt-1">
                        {user?.displayName ||
                            (user?.email ? user.email.split("@")[0] : "User")}
                    </p>
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                    <p className="text-foreground mt-1">{user?.email}</p>
                </div>
                <p className="text-xs text-muted-foreground pt-2">Settings are stored locally in your browser.</p>
            </div>
        </div>
    );
};

export default SettingsPage;
