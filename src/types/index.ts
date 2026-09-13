export type LocationCategory =
  | 'stage'
  | 'workshop'
  | 'booth'
  | 'food'
  | 'restroom'
  | 'helpdesk'
  | 'firstaid'
  | 'security';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LocationNode {
  id: string;
  name: string;
  category: LocationCategory;
  zoneId: string;
  floor: number;
  x: number; // map X coordinate %
  y: number; // map Y coordinate %
  description: string;
  isAccessible: boolean; // elevator/ramp access present
  capacity?: number;
  currentOccupancy?: number;
}

export interface MapEdge {
  from: string;
  to: string;
  distance: number; // in meters
  requiresStairs: boolean;
}

export interface Zone {
  id: string;
  name: string;
  crowdLevel: CrowdLevel;
  occupancyPercentage: number;
  maxCapacity: number;
  currentCount: number;
  bounds: { x: number; y: number; width: number; height: number };
  trend: 'rising' | 'stable' | 'falling';
  alternateZoneId?: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: string;
  speakerRole: string;
  category: 'AI & Data' | 'Web & Cloud' | 'UX & Product' | 'Security & DevOps' | 'Keynote' | 'Workshop';
  locationId: string;
  locationName: string;
  startTime: string; // ISO or formatted HH:MM
  endTime: string;
  capacity: number;
  enrolledCount: number;
  tags: string[];
  isFeatured?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'URGENT' | 'SCHEDULE' | 'CROWD' | 'GENERAL';
  timestamp: string;
  isRead?: boolean;
}

export type SOSType = 'MEDICAL' | 'SECURITY' | 'LOST_ITEM' | 'ASSISTANCE';
export type SOSStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface SOSIncident {
  id: string;
  locationId: string;
  locationName: string;
  type: SOSType;
  description: string;
  status: SOSStatus;
  timestamp: string;
  contactName?: string;
  contactPhone?: string;
}

export interface UserPreferences {
  selectedInterests: string[];
  accessibleRouteOnly: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
}

export interface RouteStep {
  stepIndex: number;
  instruction: string;
  fromNode: string;
  toNode: string;
  distanceMeters: number;
  isAccessible: boolean;
  requiresStairs: boolean;
}

export interface NavigationRoute {
  path: string[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  isFullyAccessible: boolean;
  steps: RouteStep[];
}
