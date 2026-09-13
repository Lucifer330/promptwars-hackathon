import React from 'react';
import { EventProvider, useEventContext } from './context/EventContext';
import { Navbar } from './components/layout/Navbar';
import { AccessibilityBar } from './components/layout/AccessibilityBar';
import { Toast } from './components/common/Toast';
import { InteractiveMap } from './components/attendee/InteractiveMap';
import { EventDiscovery } from './components/attendee/EventDiscovery';
import { CrowdMonitor } from './components/attendee/CrowdMonitor';
import { EmergencySOS } from './components/attendee/EmergencySOS';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, activeView, preferences } = useEventContext();

  const getFontSizeClass = () => {
    switch (preferences.fontSize) {
      case 'large':
        return 'text-[110%]';
      case 'xlarge':
        return 'text-[120%]';
      default:
        return '';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${getFontSizeClass()}`}>
      <div>
        <AccessibilityBar />
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {role === 'organizer' || activeView === 'dashboard' ? (
            <OrganizerDashboard />
          ) : (
            <>
              {activeView === 'discovery' && <EventDiscovery />}
              {activeView === 'map' && <InteractiveMap />}
              {activeView === 'crowd' && <CrowdMonitor />}
              {activeView === 'sos' && <EmergencySOS />}
            </>
          )}
        </main>
      </div>

      {/* Accessible Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-200">Smart Event Experience</span>
            <span className="text-slate-500">| Hackathon Production Build</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> WCAG 2.2 Compliant
            </span>
            <span>Zero Secrets</span>
            <span>Single Branch main</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Global Tech Summit 2026
            </span>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EventProvider>
      <MainContent />
    </EventProvider>
  );
};

export default App;
