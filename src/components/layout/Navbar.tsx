import React, { useState } from 'react';
import { useEventContext, ActiveView } from '../../context/EventContext';
import {
  MapPin,
  Compass,
  Users,
  AlertTriangle,
  LayoutDashboard,
  Bell,
  Sparkles,
  ShieldCheck,
  UserCheck,
  X,
  Volume2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeView,
    setActiveView,
    announcements,
    incidents,
    triggerSimulatedAlert,
  } = useEventContext();

  const [showNotifications, setShowNotifications] = useState(false);

  const pendingIncidentsCount = incidents.filter((i) => i.status === 'PENDING').length;

  const attendeeNavItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'discovery', label: 'Discover & Agenda', icon: <Compass className="w-4 h-4" /> },
    { id: 'map', label: 'Venue Navigation', icon: <MapPin className="w-4 h-4" /> },
    { id: 'crowd', label: 'Crowd Coordination', icon: <Users className="w-4 h-4" /> },
    {
      id: 'sos',
      label: 'Emergency & SOS',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: pendingIncidentsCount > 0 ? pendingIncidentsCount : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('discovery')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Smart Event</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Global Tech 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Interactive Navigation & Event Operations</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {role === 'attendee' ? (
              attendeeNavItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/90 text-white shadow-sm shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <button
                onClick={() => setActiveView('dashboard')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Organizer Command Desk</span>
              </button>
            )}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Simulator button */}
            <button
              onClick={triggerSimulatedAlert}
              title="Simulate incoming real-time alert"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Alert</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View Announcements & Notifications"
                aria-expanded={showNotifications}
                className="relative p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-4"
                  role="dialog"
                  aria-label="Real-time Announcements"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-semibold text-sm text-white">
                      <Volume2 className="w-4 h-4 text-blue-400" />
                      <span>Live Event Broadcasts</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white p-1 rounded-md"
                      aria-label="Close notifications"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
                    {announcements.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No announcements yet.</p>
                    ) : (
                      announcements.map((ann) => (
                        <div
                          key={ann.id}
                          className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                ann.category === 'URGENT'
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : ann.category === 'CROWD'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-blue-950 text-blue-300 border border-blue-800'
                              }`}
                            >
                              {ann.category}
                            </span>
                            <span className="text-slate-400 text-[10px]">{ann.timestamp}</span>
                          </div>
                          <p className="font-semibold text-slate-200">{ann.title}</p>
                          <p className="text-slate-400 mt-1 leading-relaxed">{ann.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => {
                  setRole('attendee');
                  setActiveView('discovery');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  role === 'attendee'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Attendee</span>
              </button>
              <button
                onClick={() => {
                  setRole('organizer');
                  setActiveView('dashboard');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  role === 'organizer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Organizer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View Tab Strip */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800 gap-1 no-scrollbar">
          {role === 'attendee' ? (
            attendeeNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  activeView === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))
          ) : (
            <button
              onClick={() => setActiveView('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Organizer Command Desk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
