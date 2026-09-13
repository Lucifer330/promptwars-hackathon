import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { SOSType } from '../../types';
import {
  AlertTriangle,
  Phone,
  Shield,
  HeartPulse,
  HelpCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Info,
} from 'lucide-react';

export const EmergencySOS: React.FC = () => {
  const { locations, createSOSIncident, incidents, startNavigationTo } = useEventContext();

  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || '');
  const [sosCategory, setSosCategory] = useState<SOSType>('MEDICAL');
  const [description, setDescription] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId || !description.trim()) return;

    createSOSIncident(selectedLocationId, sosCategory, description, contactName, contactPhone);
    setIsSubmitted(true);
    setDescription('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-red-950/40 border border-red-800/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Emergency & SOS Support Desk</h1>
          </div>
          <p className="text-xs sm:text-sm text-red-200 mt-1">
            Immediate access to on-site medical first aid, venue security, lost items, and organizer dispatch.
          </p>
        </div>

        {/* Real Emergency Disclaimer */}
        <div className="bg-slate-950 p-3 rounded-xl border border-red-900/60 text-xs text-slate-300 max-w-sm">
          <p className="font-bold text-red-400 flex items-center gap-1">
            <Info className="w-4 h-4" /> DEMO DISPATCH SYSTEM
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            This dispatches on-site event staff. For life-threatening off-site emergencies outside venue, call local 911 immediately.
          </p>
        </div>
      </div>

      {/* Grid Layout: Quick Contacts & SOS Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Direct Phone Hotlines */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct Event Hotlines</span>
            </h2>

            <div className="space-y-3">
              {/* Medical */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-950 text-red-400 rounded-lg border border-red-900/50">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Medical First Aid</p>
                    <p className="text-[11px] text-slate-400">On-site Paramedic Tent</p>
                  </div>
                </div>
                <a
                  href="tel:+15550192831"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Call
                </a>
              </div>

              {/* Security */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-900/50">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Venue Security Post</p>
                    <p className="text-[11px] text-slate-400">24/7 Security Dispatch</p>
                  </div>
                </div>
                <a
                  href="tel:+15550192832"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Call
                </a>
              </div>

              {/* Help Desk */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950 text-blue-400 rounded-lg border border-blue-900/50">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Central Helpdesk</p>
                    <p className="text-[11px] text-slate-400">Lost & Found / Info</p>
                  </div>
                </div>
                <a
                  href="tel:+15550192833"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SOS Trigger Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-red-400" />
                <span>Instant SOS Emergency Dispatch Request</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Notify the nearest organizer team and security post to your precise venue location.
              </p>
            </div>

            {isSubmitted && (
              <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-xl text-xs text-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-100">SOS Incident Broadcast Sent!</p>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    On-site staff dispatched to your location. Stay at the designated area.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Radio buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Incident Type:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'MEDICAL', label: 'Medical First Aid', color: 'red' },
                      { id: 'SECURITY', label: 'Security Incident', color: 'indigo' },
                      { id: 'LOST_ITEM', label: 'Lost Belonging', color: 'amber' },
                      { id: 'ASSISTANCE', label: 'Mobility Help', color: 'blue' },
                    ] as const
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSosCategory(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        sosCategory === cat.id
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-1.5">
                <label htmlFor="sos-location-select" className="text-xs font-semibold text-slate-300 block">
                  Select Your Venue Location / Nearby Landmark:
                </label>
                <select
                  id="sos-location-select"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.category.toUpperCase()} - Floor {loc.floor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="sos-description-input" className="text-xs font-semibold text-slate-300 block">
                  Briefly describe the assistance required:
                </label>
                <textarea
                  id="sos-description-input"
                  rows={3}
                  required
                  placeholder="e.g. Need assistance with wheelchair ramp access or lost backpack at food court..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Contact info optional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="contact-name-input" className="text-xs text-slate-400 font-medium block">
                    Your Name (Optional):
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="contact-phone-input" className="text-xs text-slate-400 font-medium block">
                    Phone Number (Optional):
                  </label>
                  <input
                    id="contact-phone-input"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-sm transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>DISPATCH EMERGENCY SOS SIGNAL</span>
              </button>
            </form>
          </div>

          {/* Active Incident Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Recent SOS Alerts & Resolution Status</span>
            </h2>

            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {inc.locationName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        inc.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : inc.status === 'IN_PROGRESS'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      Type: <strong className="text-slate-200">{inc.type}</strong>
                    </span>
                    <button
                      onClick={() => startNavigationTo(inc.locationId)}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Navigate to location
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
