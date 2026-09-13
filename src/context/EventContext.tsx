import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
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

  const clearToast = useCallback(() => setActiveToast(null), []);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setPreferences((prev) => {
      const exists = prev.selectedInterests.includes(interest);
      const nextInterests = exists
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest];
      return { ...prev, selectedInterests: nextInterests };
    });
  }, []);

  const toggleSavedSession = useCallback((sessionId: string) => {
    setSavedSessionIds((prev) => {
      const exists = prev.includes(sessionId);
      const nextSaved = exists ? prev.filter((id) => id !== sessionId) : [...prev, sessionId];
      const targetSession = sessions.find((s) => s.id === sessionId);
      if (targetSession) {
        const msg = exists
          ? `Removed "${targetSession.title.slice(0, 40)}" from agenda.`
          : `Added "${targetSession.title.slice(0, 40)}" to agenda.`;
        setActiveToast(msg);
      }
      return nextSaved;
    });
  }, [sessions]);

  // Optimized route calculation memoized by node IDs, locations graph, and accessibility preference
  const activeRoute = useMemo(() => {
    return findShortestRoute(
      navigationStartId,
      navigationEndId,
      locations,
      INITIAL_EDGES,
      preferences.accessibleRouteOnly
    );
  }, [navigationStartId, navigationEndId, locations, preferences.accessibleRouteOnly]);

  const startNavigationTo = useCallback((locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    if (!loc) return; // Input validation check
    setNavigationEndId(locationId);
    setActiveView('map');
    setActiveToast(`Navigating to ${loc.name}`);
  }, [locations]);

  // Create SOS incident with input boundary validation
  const createSOSIncident = useCallback(
    (
      locationId: string,
      type: SOSType,
      description: string,
      contactName?: string,
      contactPhone?: string
    ) => {
      const loc = locations.find((l) => l.id === locationId);
      const sanitizedDesc = description.trim().slice(0, 500); // Cap description length
      const sanitizedName = contactName ? contactName.trim().slice(0, 100) : undefined;
      const sanitizedPhone = contactPhone ? contactPhone.trim().slice(0, 30) : undefined;

      const newIncident: SOSIncident = {
        id: `inc-${Date.now().toString().slice(-4)}`,
        locationId,
        locationName: loc ? loc.name : 'Unknown Location',
        type: ['MEDICAL', 'SECURITY', 'LOST_ITEM', 'ASSISTANCE'].includes(type) ? type : 'ASSISTANCE',
        description: sanitizedDesc || 'Emergency assistance requested',
        status: 'PENDING',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contactName: sanitizedName,
        contactPhone: sanitizedPhone,
      };

      setIncidents((prev) => [newIncident, ...prev]);
      setActiveToast(`🚨 SOS Emergency alert dispatched for ${newIncident.locationName}! Dispatch team notified.`);
    },
    [locations]
  );

  // Organizer Actions
  const addAnnouncement = useCallback((title: string, message: string, category: Announcement['category']) => {
    const sanitizedTitle = title.trim().slice(0, 150);
    const sanitizedMsg = message.trim().slice(0, 500);
    const validCategory = ['URGENT', 'SCHEDULE', 'CROWD', 'GENERAL'].includes(category) ? category : 'GENERAL';

    const newAnn: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: sanitizedTitle || 'Event Notice',
      message: sanitizedMsg || 'Event operational update',
      category: validCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setActiveToast(`📢 Broadcast published: "${newAnn.title}"`);
  }, []);

  const updateIncidentStatus = useCallback((incidentId: string, status: SOSIncident['status']) => {
    const validStatus = ['PENDING', 'IN_PROGRESS', 'RESOLVED'].includes(status) ? status : 'PENDING';
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: validStatus } : inc))
    );
    setActiveToast(`Incident #${incidentId} status updated to ${validStatus}`);
  }, []);

  const updateZoneCrowd = useCallback((zoneId: string, level: CrowdLevel, count?: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextCount =
            count !== undefined
              ? Math.max(0, Math.min(z.maxCapacity, count))
              : Math.round(
                  z.maxCapacity *
                    (level === 'LOW' ? 0.3 : level === 'MODERATE' ? 0.6 : level === 'HIGH' ? 0.85 : 0.98)
                );
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
  }, [zones]);

  const updateSession = useCallback((updatedSession: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
    setActiveToast(`Updated session details for "${updatedSession.title.slice(0, 40)}"`);
  }, []);

  // Demo Simulation trigger
  const triggerSimulatedAlert = useCallback(() => {
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
      updateZoneCrowd('zone-d', 'HIGH', 430);
    } else {
      title = 'Schedule Update: Lab A Workshop';
      message = 'Ollama & PyTorch workshop start delayed by 15 mins to allow set up.';
    }

    addAnnouncement(title, message, randomCat);
  }, [addAnnouncement, updateZoneCrowd]);

  // High contrast mode DOM toggle
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [preferences.highContrast]);

  // Stable Memoized Context Value
  const value = useMemo(
    () => ({
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
    }),
    [
      role,
      activeView,
      locations,
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
      navigationEndId,
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
    ]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
