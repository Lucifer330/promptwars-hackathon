import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  LocationNode,
  Zone,
  Session,
  Announcement,
  SOSIncident,
  UserPreferences,
  NavigationRoute,
  SOSType,
  CrowdLevel,
} from '../types';
import {
  INITIAL_LOCATIONS,
  INITIAL_ZONES,
  INITIAL_EDGES,
  INITIAL_SESSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_INCIDENTS,
} from '../data/mockData';
import { findShortestRoute } from '../utils/pathfinding';

export type UserRole = 'attendee' | 'organizer';
export type ActiveView = 'discovery' | 'map' | 'crowd' | 'sos' | 'dashboard';

interface EventContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Data
  locations: LocationNode[];
  setLocations: React.Dispatch<React.SetStateAction<LocationNode[]>>;
  zones: Zone[];
  sessions: Session[];
  announcements: Announcement[];
  incidents: SOSIncident[];
  savedSessionIds: string[];

  // User preferences & accessibility
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  toggleInterest: (interest: string) => void;
  toggleSavedSession: (sessionId: string) => void;

  // Navigation
  navigationStartId: string;
  setNavigationStartId: (id: string) => void;
  navigationEndId: string;
  setNavigationEndId: (id: string) => void;
  activeRoute: NavigationRoute | null;
  startNavigationTo: (locationId: string) => void;

  // Actions for Attendees
  createSOSIncident: (locationId: string, type: SOSType, description: string, name?: string, phone?: string) => void;

  // Actions for Organizers
  addAnnouncement: (title: string, message: string, category: Announcement['category']) => void;
  updateIncidentStatus: (incidentId: string, status: SOSIncident['status']) => void;
  updateZoneCrowd: (zoneId: string, level: CrowdLevel, count?: number) => void;
  updateSession: (updatedSession: Session) => void;

  // Simulation & Feedback
  triggerSimulatedAlert: () => void;
  activeToast: string | null;
  clearToast: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('attendee');
  const [activeView, setActiveView] = useState<ActiveView>('discovery');

  const [locations, setLocations] = useState<LocationNode[]>(INITIAL_LOCATIONS);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [incidents, setIncidents] = useState<SOSIncident[]>(INITIAL_INCIDENTS);
  const [savedSessionIds, setSavedSessionIds] = useState<string[]>(['sess-101']);

  const [navigationStartId, setNavigationStartId] = useState<string>('loc-helpdesk');
  const [navigationEndId, setNavigationEndId] = useState<string>('loc-main-stage');

  const [activeToast, setActiveToast] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedInterests: ['AI & Data', 'Web & Cloud'],
    accessibleRouteOnly: false,
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
  });

  const clearToast = () => setActiveToast(null);

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...partial }));
  };

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => {
      const exists = prev.selectedInterests.includes(interest);
      const nextInterests = exists
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest];
      return { ...prev, selectedInterests: nextInterests };
    });
  };

  const toggleSavedSession = (sessionId: string) => {
    setSavedSessionIds((prev) => {
      const exists = prev.includes(sessionId);
      const nextSaved = exists ? prev.filter((id) => id !== sessionId) : [...prev, sessionId];
      const targetSession = sessions.find((s) => s.id === sessionId);
      if (targetSession) {
        const msg = exists
          ? `Removed "${targetSession.title}" from your schedule.`
          : `Added "${targetSession.title}" to your schedule.`;
        setActiveToast(msg);
      }
      return nextSaved;
    });
  };

  // Route calculation
  const activeRoute = useMemo(() => {
    return findShortestRoute(
      navigationStartId,
      navigationEndId,
      locations,
      INITIAL_EDGES,
      preferences.accessibleRouteOnly
    );
  }, [navigationStartId, navigationEndId, locations, preferences.accessibleRouteOnly]);

  const startNavigationTo = (locationId: string) => {
    setNavigationEndId(locationId);
    setActiveView('map');
    const loc = locations.find((l) => l.id === locationId);
    if (loc) {
      setActiveToast(`Navigating to ${loc.name}`);
    }
  };

  // Create SOS incident
  const createSOSIncident = (
    locationId: string,
    type: SOSType,
    description: string,
    contactName?: string,
    contactPhone?: string
  ) => {
    const loc = locations.find((l) => l.id === locationId);
    const newIncident: SOSIncident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      locationId,
      locationName: loc ? loc.name : 'Unknown Location',
      type,
      description,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactName,
      contactPhone,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setActiveToast(`🚨 SOS Emergency alert dispatched for ${newIncident.locationName}! Dispatch team notified.`);
  };

  // Organizer Actions
  const addAnnouncement = (title: string, message: string, category: Announcement['category']) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title,
      message,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setActiveToast(`📢 Broadcast published: "${title}"`);
  };

  const updateIncidentStatus = (incidentId: string, status: SOSIncident['status']) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status } : inc))
    );
    setActiveToast(`Incident #${incidentId} status updated to ${status}`);
  };

  const updateZoneCrowd = (zoneId: string, level: CrowdLevel, count?: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextCount = count !== undefined ? count : Math.round(z.maxCapacity * (level === 'LOW' ? 0.3 : level === 'MODERATE' ? 0.6 : level === 'HIGH' ? 0.85 : 0.98));
          const pct = Math.round((nextCount / z.maxCapacity) * 100);
          return {
            ...z,
            crowdLevel: level,
            currentCount: nextCount,
            occupancyPercentage: pct,
          };
        }
        return z;
      })
    );
    const targetZone = zones.find((z) => z.id === zoneId);
    if (targetZone) {
      setActiveToast(`Updated crowd level for ${targetZone.name} to ${level}`);
    }
  };

  const updateSession = (updatedSession: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    setActiveToast(`Updated session details for "${updatedSession.title}"`);
  };

  // Demo Simulation trigger
  const triggerSimulatedAlert = () => {
    const categories: Announcement['category'][] = ['URGENT', 'CROWD', 'SCHEDULE'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    let title = '';
    let message = '';

    if (randomCat === 'URGENT') {
      title = 'Safety Announcement: Weather Advisory';
      message = 'Light rain expected outdoors. Outdoor Terrace (Zone E) canopy covers deployed.';
    } else if (randomCat === 'CROWD') {
      title = 'Crowd Shift Notice: Main Hall Clearing';
      message = 'Main Stage session wrapped up. Expect high foot traffic near Bites & Brews Food Court.';
      // Spike food court crowd
      updateZoneCrowd('zone-d', 'HIGH', 430);
    } else {
      title = 'Schedule Update: Lab A Workshop';
      message = 'Ollama & PyTorch workshop start delayed by 15 mins to allow set up.';
    }

    addAnnouncement(title, message, randomCat);
  };

  // High contrast mode effect
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [preferences.highContrast]);

  const value = {
    role,
    setRole,
    activeView,
    setActiveView,
    locations,
    setLocations,
    zones,
    sessions,
    announcements,
    incidents,
    savedSessionIds,
    preferences,
    updatePreferences,
    toggleInterest,
    toggleSavedSession,
    navigationStartId,
    setNavigationStartId,
    navigationEndId,
    setNavigationEndId,
    activeRoute,
    startNavigationTo,
    createSOSIncident,
    addAnnouncement,
    updateIncidentStatus,
    updateZoneCrowd,
    updateSession,
    triggerSimulatedAlert,
    activeToast,
    clearToast,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
