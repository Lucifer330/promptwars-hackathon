import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { CrowdLevel } from '../../types';
import { Users, AlertTriangle, ArrowRight, Utensils, RefreshCw, Compass } from 'lucide-react';

export const CrowdMonitor: React.FC = () => {
  const { zones, setActiveView } = useEventContext();

  const getBadgeStyle = (level: CrowdLevel) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'MODERATE':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'HIGH':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'CRITICAL':
        return 'bg-purple-950 text-purple-300 border-purple-800';
    }
  };

  const getProgressColor = (level: CrowdLevel) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-500';
      case 'MODERATE':
        return 'bg-amber-500';
      case 'HIGH':
        return 'bg-red-500';
      case 'CRITICAL':
        return 'bg-purple-500 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Live Crowd Density & Zone Coordination</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time occupancy tracking, queue estimates, and alternate route guidance to avoid congested areas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <span className="text-slate-400">Crowd Telemetry:</span>
            <p className="font-semibold text-emerald-400">Live Updating</p>
          </div>
        </div>
      </div>

      {/* Zone Occupancy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const isHighOrCritical = zone.crowdLevel === 'HIGH' || zone.crowdLevel === 'CRITICAL';
          const alternateZone = zone.alternateZoneId ? zones.find((z) => z.id === zone.alternateZoneId) : null;

          return (
            <div
              key={zone.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all ${
                isHighOrCritical ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white leading-snug">{zone.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getBadgeStyle(
                      zone.crowdLevel
                    )}`}
                  >
                    {zone.crowdLevel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Density Occupancy</span>
                    <span className="text-slate-200">{zone.occupancyPercentage}% ({zone.currentCount} / {zone.maxCapacity})</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressColor(zone.crowdLevel)}`}
                      style={{ width: `${zone.occupancyPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Trend Info */}
                <p className="text-[11px] text-slate-400 mt-2">
                  Foot Traffic Trend:{' '}
                  <span className="font-semibold text-slate-200 capitalize">{zone.trend}</span>
                </p>
              </div>

              {/* Alternate suggestion box if high/critical */}
              {isHighOrCritical && alternateZone && (
                <div className="bg-amber-950/40 border border-amber-800/80 p-3 rounded-xl text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Heavy Crowd Advisory</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Consider visiting <strong className="text-white">{alternateZone.name}</strong> ({alternateZone.crowdLevel} density) for shorter queues.
                  </p>
                  <button
                    onClick={() => setActiveView('map')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline"
                  >
                    <span>View alternate zone on map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Footer quick action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Zone Code: {zone.id.toUpperCase()}</span>
                <button
                  onClick={() => setActiveView('map')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Locate Zone</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Amenity Queue Estimates */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          <span>Food Court & Restroom Wait Estimates</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Bites & Brews Food Court</span>
            <p className="text-xl font-extrabold text-amber-400">~12 mins wait</p>
            <p className="text-[11px] text-slate-400">Moderate queue length</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Green Oasis Vegan Hub</span>
            <p className="text-xl font-extrabold text-emerald-400">&lt; 3 mins wait</p>
            <p className="text-[11px] text-slate-400">Fast service, light crowd</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Central Restrooms Block A</span>
            <p className="text-xl font-extrabold text-emerald-400">No Wait</p>
            <p className="text-[11px] text-slate-400">Accessible WC available in Block B</p>
          </div>
        </div>
      </div>
    </div>
  );
};
