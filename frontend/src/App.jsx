import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { WorkspacesProvider } from "./context/WorkspacesContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import HomePage from "./pages/HomePage";
import WorkspaceEditor from "./pages/WorkspaceEditor";
import TrashPage from "./pages/TrashPage";
import SearchPage from "./pages/SearchPage";
import CalendarPage from "./pages/CalendarPage";
import InboxPage from "./pages/InboxPage";
import SettingsPage from "./pages/SettingsPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  // Apply persisted accessibility settings on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("app_settings");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const body = document.body;
      if (!body) return;
      body.classList.toggle("reduce-motion", !!parsed.reduceMotion);
      body.classList.toggle("large-text", !!parsed.largeText);
    } catch {
      // ignore
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <WorkspacesProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route index element={<HomePage />} />
                  <Route path="workspace/:id" element={<WorkspaceEditor />} />
                  <Route path="trash" element={<TrashPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="inbox" element={<InboxPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WorkspacesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
