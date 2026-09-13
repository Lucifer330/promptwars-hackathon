import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { LocationCategory, LocationNode } from '../../types';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Utensils,
  Shield,
  HelpCircle,
  Video,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Accessibility,
} from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const {
    locations,
    zones,
    navigationStartId,
    setNavigationStartId,
    navigationEndId,
    setNavigationEndId,
    activeRoute,
    preferences,
    updatePreferences,
  } = useEventContext();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<LocationCategory | 'all'>('all');
  const [hoveredLocation, setHoveredLocation] = useState<LocationNode | null>(null);

  const startLoc = locations.find((l) => l.id === navigationStartId);
  const endLoc = locations.find((l) => l.id === navigationEndId);

  const getCategoryIcon = (category: LocationCategory) => {
    switch (category) {
      case 'stage':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'workshop':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'booth':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'restroom':
        return <span className="text-xs font-bold text-cyan-400">WC</span>;
      case 'helpdesk':
        return <HelpCircle className="w-4 h-4 text-sky-400" />;
      case 'firstaid':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredLocations = locations.filter((loc) =>
    selectedCategoryFilter === 'all' ? true : loc.category === selectedCategoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Navigation className="w-6 h-6 text-blue-400" />
            <span>Interactive Venue Navigation & Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pathfinding across stages, food courts, restrooms, first-aid, and accessible facilities.
          </p>
        </div>

        {/* Accessibility Toggle */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <Accessibility className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-slate-200">Step-Free Wheelchair Mode</p>
            <p className="text-slate-400 text-[11px]">Bypasses stairs & highlights elevators</p>
          </div>
          <button
            onClick={() => updatePreferences({ accessibleRouteOnly: !preferences.accessibleRouteOnly })}
            aria-pressed={preferences.accessibleRouteOnly}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              preferences.accessibleRouteOnly
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {preferences.accessibleRouteOnly ? 'Active' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Main Map + Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pathfinding Controls & Route Steps */}
        <div className="space-y-5 lg:col-span-1">
          {/* Route Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Route Planner</span>
            </h2>

            {/* Start Selector */}
            <div className="space-y-1.5">
              <label htmlFor="start-location-select" className="text-xs text-slate-400 font-medium block">
                Start Location (Current Position):
              </label>
              <select
                id="start-location-select"
                value={navigationStartId}
                onChange={(e) => setNavigationStartId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (Floor {loc.floor})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label htmlFor="destination-location-select" className="text-xs text-slate-400 font-medium block">
                Destination:
              </label>
              <select
                id="destination-location-select"
                value={navigationEndId}
                onChange={(e) => setNavigationEndId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (Floor {loc.floor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Computed Path Summary */}
          {activeRoute ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Active Route</span>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span>{startLoc?.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span>{endLoc?.name}</span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    <span>Distance</span>
                  </div>
                  <p className="text-lg font-extrabold text-white mt-1">{activeRoute.totalDistanceMeters} meters</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Est. Time</span>
                  </div>
                  <p className="text-lg font-extrabold text-white mt-1">~{activeRoute.estimatedMinutes} mins</p>
                </div>
              </div>

              {/* Accessibility Route Status */}
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  activeRoute.isFullyAccessible
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/50 text-amber-300 border-amber-800'
                }`}
              >
                {activeRoute.isFullyAccessible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>100% Step-free & Wheelchair accessible route verified.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Route contains stair segments. Enable step-free mode for elevator path.</span>
                  </>
                )}
              </div>

              {/* Step-by-Step Directions */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Navigation Instructions:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeRoute.steps.map((step) => (
                    <div
                      key={step.stepIndex}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {step.stepIndex}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium leading-relaxed">{step.instruction}</p>
                        {step.requiresStairs && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                            Stairs (Floor Change)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
              No accessible route found between selected points.
            </div>
          )}
        </div>

        {/* Right Column: Visual Interactive Map & Filters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Filter:
            </span>
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'stage', label: 'Stages' },
                { id: 'workshop', label: 'Workshops' },
                { id: 'booth', label: 'Booths' },
                { id: 'food', label: 'Food Courts' },
                { id: 'restroom', label: 'Restrooms' },
                { id: 'helpdesk', label: 'Helpdesk' },
                { id: 'firstaid', label: 'First Aid' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Interactive SVG Venue Floor Plan */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden aspect-[4/3] sm:aspect-[16/10] shadow-inner select-none">
            {/* SVG Background Grid & Zone Boxes */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Render Venue Zones */}
              {zones.map((zone) => {
                const color =
                  zone.crowdLevel === 'LOW'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : zone.crowdLevel === 'MODERATE'
                    ? 'rgba(245, 158, 11, 0.15)'
                    : zone.crowdLevel === 'HIGH'
                    ? 'rgba(239, 68, 68, 0.18)'
                    : 'rgba(147, 51, 234, 0.22)';
                const strokeColor =
                  zone.crowdLevel === 'LOW'
                    ? '#10b981'
                    : zone.crowdLevel === 'MODERATE'
                    ? '#f59e0b'
                    : zone.crowdLevel === 'HIGH'
                    ? '#ef4444'
                    : '#9333ea';

                return (
                  <g key={zone.id}>
                    <rect
                      x={zone.bounds.x}
                      y={zone.bounds.y}
                      width={zone.bounds.width}
                      height={zone.bounds.height}
                      rx="2"
                      fill={color}
                      stroke={strokeColor}
                      strokeWidth="0.5"
                      strokeDasharray="1.5 1"
                    />
                    <text
                      x={zone.bounds.x + 2}
                      y={zone.bounds.y + 5}
                      fill="#94a3b8"
                      fontSize="2.5"
                      fontWeight="bold"
                    >
                      {zone.name} ({zone.crowdLevel})
                    </text>
                  </g>
                );
              })}

              {/* Active Route Path Line */}
              {activeRoute && activeRoute.path.length > 1 && (
                <polyline
                  points={activeRoute.path
                    .map((nodeId) => {
                      const loc = locations.find((l) => l.id === nodeId);
                      return loc ? `${loc.x},${loc.y}` : '';
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.2"
                  strokeDasharray="2 1"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Map Location Pins Overlay */}
            {filteredLocations.map((loc) => {
              const isStart = loc.id === navigationStartId;
              const isEnd = loc.id === navigationEndId;
              const isInPath = activeRoute?.path.includes(loc.id);

              return (
                <div
                  key={loc.id}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onMouseEnter={() => setHoveredLocation(loc)}
                  onClick={() => setNavigationEndId(loc.id)}
                >
                  <div
                    className={`p-2 rounded-full border-2 transition-all transform group-hover:scale-125 shadow-lg flex items-center justify-center ${
                      isStart
                        ? 'bg-blue-600 border-white ring-4 ring-blue-500/30'
                        : isEnd
                        ? 'bg-red-600 border-white ring-4 ring-red-500/30'
                        : isInPath
                        ? 'bg-slate-900 border-blue-400'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {getCategoryIcon(loc.category)}
                  </div>

                  {/* Location Title Tooltip */}
                  <div className="absolute left-1/2 bottom-full mb-1 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-800 whitespace-nowrap shadow-xl z-30 pointer-events-none">
                    {loc.name}
                    {loc.isAccessible && <span className="ml-1 text-emerald-400">♿</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hovered / Selected Location Info Card */}
          {hoveredLocation && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(hoveredLocation.category)}
                  <span className="font-bold text-sm text-white">{hoveredLocation.name}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 uppercase">
                    {hoveredLocation.category}
                  </span>
                  {hoveredLocation.isAccessible && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                      Accessible ♿
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mt-1">{hoveredLocation.description}</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setNavigationStartId(hoveredLocation.id)}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium border border-slate-700"
                >
                  Set as Start
                </button>
                <button
                  onClick={() => setNavigationEndId(hoveredLocation.id)}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Navigate Here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
