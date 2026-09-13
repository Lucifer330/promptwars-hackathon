import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { Eye, Accessibility, ZoomIn, Activity } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { preferences, updatePreferences } = useEventContext();

  return (
    <div
      role="region"
      aria-label="Accessibility controls"
      className="bg-slate-900 border-b border-slate-800 text-xs px-4 py-2 text-slate-300 flex flex-wrap items-center justify-between gap-3 shadow-inner"
    >
      <div className="flex items-center gap-2 font-medium text-slate-200">
        <Accessibility className="w-4 h-4 text-blue-400" aria-hidden="true" />
        <span>Accessibility Tools:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Wheelchair / Accessible Navigation Route Toggle */}
        <label className="inline-flex items-center gap-1.5 cursor-pointer bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-colors">
          <input
            type="checkbox"
            checked={preferences.accessibleRouteOnly}
            onChange={(e) => updatePreferences({ accessibleRouteOnly: e.target.checked })}
            className="rounded border-slate-600 text-blue-500 focus:ring-blue-400 focus:ring-offset-slate-900"
            aria-label="Filter navigation routes for step-free wheelchair accessibility"
          />
          <span className="font-medium text-slate-200">Step-Free / Ramp Routes Only</span>
        </label>

        {/* High Contrast Mode Toggle */}
        <button
          onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
          aria-pressed={preferences.highContrast}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${
            preferences.highContrast
              ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{preferences.highContrast ? 'High Contrast: ON' : 'High Contrast'}</span>
        </button>

        {/* Font Scaling */}
        <div className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
          <ZoomIn className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-slate-400 mr-1">Text:</span>
          {(['normal', 'large', 'xlarge'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updatePreferences({ fontSize: size })}
              aria-label={`Set font size to ${size}`}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase transition-colors ${
                preferences.fontSize === size
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {size === 'normal' ? '1x' : size === 'large' ? '1.25x' : '1.5x'}
            </button>
          ))}
        </div>

        {/* Reduced Motion Toggle */}
        <button
          onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
          aria-pressed={preferences.reducedMotion}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border transition-colors ${
            preferences.reducedMotion
              ? 'bg-blue-900/60 text-blue-300 border-blue-600'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{preferences.reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion'}</span>
        </button>
      </div>
    </div>
  );
};
