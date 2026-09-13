import React, { useState } from 'react';
import { useEventContext } from '../../context/EventContext';
import { CrowdLevel, Session, SOSStatus } from '../../types';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Megaphone,
  Edit,
  Radio,
  BarChart2,
  Send,
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const {
    zones,
    sessions,
    announcements,
    incidents,
    addAnnouncement,
    updateIncidentStatus,
    updateZoneCrowd,
    updateSession,
  } = useEventContext();

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annCategory, setAnnCategory] = useState<'URGENT' | 'SCHEDULE' | 'CROWD' | 'GENERAL'>('GENERAL');

  // Edit Session Modal State
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const pendingIncidents = incidents.filter((i) => i.status === 'PENDING');
  const inProgressIncidents = incidents.filter((i) => i.status === 'IN_PROGRESS');
  const highCrowdZones = zones.filter((z) => z.crowdLevel === 'HIGH' || z.crowdLevel === 'CRITICAL');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    addAnnouncement(annTitle, annMessage, annCategory);
    setAnnTitle('');
    setAnnMessage('');
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    updateSession(editingSession);
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Organizer Operational Command Desk</h1>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            Real-time event oversight, emergency response dispatch, crowd control, and broadcast management.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
          <div>
            <span className="text-slate-400">Operations Control:</span>
            <p className="font-bold text-white">LIVE ACTIVE</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Venue Occupancy</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">2,391</p>
          <p className="text-[11px] text-slate-400">Capacity headroom ~30%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High Density Zones</span>
            <BarChart2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{highCrowdZones.length} Zones</p>
          <p className="text-[11px] text-slate-400">Zone B & Zone A congested</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Emergency SOS</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-red-400">{pendingIncidents.length + inProgressIncidents.length}</p>
          <p className="text-[11px] text-slate-400">{pendingIncidents.length} pending dispatch</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Broadcasts Published</span>
            <Megaphone className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{announcements.length}</p>
          <p className="text-[11px] text-slate-400">Latest: {announcements[0]?.timestamp || 'N/A'}</p>
        </div>
      </div>

      {/* Main Command Desk Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Live Emergency SOS Dispatch Desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>SOS Emergency Incident Desk</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">{incidents.length} Total Logs</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{inc.locationName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-800">
                        {inc.type}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">Reported at {inc.timestamp}</p>
                  </div>

                  <select
                    value={inc.status}
                    onChange={(e) => updateIncidentStatus(inc.id, e.target.value as SOSStatus)}
                    className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {inc.description}
                </p>

                {(inc.contactName || inc.contactPhone) && (
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-md">
                    Contact: <strong className="text-slate-200">{inc.contactName || 'Anonymous'}</strong>{' '}
                    {inc.contactPhone && <span className="text-blue-400">({inc.contactPhone})</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Live Announcement Dispatcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              <span>Broadcast Announcement Dispatcher</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Publish real-time alerts instantly to attendee devices.</p>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="ann-title-input" className="font-semibold text-slate-300 block">
                Announcement Title:
              </label>
              <input
                id="ann-title-input"
                type="text"
                required
                placeholder="e.g. Stage Change for Keynote..."
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="ann-category-select" className="font-semibold text-slate-300 block">
                  Category Priority:
                </label>
                <select
                  id="ann-category-select"
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="SCHEDULE">SCHEDULE</option>
                  <option value="CROWD">CROWD</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="ann-message-input" className="font-semibold text-slate-300 block">
                Message Body:
              </label>
              <textarea
                id="ann-message-input"
                rows={3}
                required
                placeholder="Write message content here..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement Now</span>
            </button>
          </form>
        </div>
      </div>

      {/* Live Crowd Override Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Zone Density Override Controls</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{zone.name}</span>
                <span className="text-[10px] text-slate-400">{zone.occupancyPercentage}% Occupied</span>
              </div>

              <div className="flex items-center gap-1.5">
                {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as CrowdLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateZoneCrowd(zone.id, level)}
                    className={`flex-1 py-1 rounded text-[10px] font-extrabold transition-colors border ${
                      zone.crowdLevel === level
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Manager Desk */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400" />
            <span>Session Schedule & Stage Management</span>
          </h2>
          <span className="text-xs text-slate-400">{sessions.length} Active Sessions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((sess) => (
            <div key={sess.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm">{sess.title}</h3>
                  <p className="text-slate-400 mt-0.5">{sess.speaker} • {sess.locationName}</p>
                </div>
                <button
                  onClick={() => setEditingSession(sess)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Time: {sess.startTime} - {sess.endTime}</span>
                <span>Enrolled: {sess.enrolledCount} / {sess.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Edit Session: {editingSession.title}</h3>

            <form onSubmit={handleSaveSession} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Session Title:</label>
                <input
                  type="text"
                  value={editingSession.title}
                  onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Speaker:</label>
                <input
                  type="text"
                  value={editingSession.speaker}
                  onChange={(e) => setEditingSession({ ...editingSession, speaker: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Start Time:</label>
                  <input
                    type="text"
                    value={editingSession.startTime}
                    onChange={(e) => setEditingSession({ ...editingSession, startTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Capacity:</label>
                  <input
                    type="number"
                    value={editingSession.capacity}
                    onChange={(e) => setEditingSession({ ...editingSession, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
