import React, { useState, useMemo } from 'react';
import { useEventContext } from '../../context/EventContext';
import { getPersonalizedRecommendations } from '../../utils/recommendations';
import {
  Search,
  Tag,
  Clock,
  MapPin,
  Bookmark,
  BookmarkCheck,
  User,
  Sparkles,
  Users,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export const EventDiscovery: React.FC = () => {
  const {
    sessions,
    savedSessionIds,
    toggleSavedSession,
    preferences,
    toggleInterest,
    startNavigationTo,
  } = useEventContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'saved'>('all');

  const availableInterests = ['AI & Data', 'Web & Cloud', 'UX & Product', 'Security & DevOps', 'Keynote', 'Workshop'];

  // Calculate explainable recommendations
  const recommendedList = useMemo(() => {
    return getPersonalizedRecommendations(sessions, preferences.selectedInterests, savedSessionIds);
  }, [sessions, preferences.selectedInterests, savedSessionIds]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Tab filter
      if (activeTab === 'saved' && !savedSessionIds.includes(session.id)) return false;

      // Category filter
      if (selectedCategory !== 'all' && session.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(query);
        const matchesSpeaker = session.speaker.toLowerCase().includes(query);
        const matchesTags = session.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesSpeaker || matchesTags;
      }

      return true;
    });
  }, [sessions, activeTab, selectedCategory, searchQuery, savedSessionIds]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Event Discovery & Personalized Agenda
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Global Tech Summit 2026</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Explore keynotes, developer workshops, and fireside chats. Select your technical interests to receive explainable rule-based recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <BookmarkCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-slate-400">My Saved Agenda:</span>
              <p className="font-extrabold text-white text-sm">{savedSessionIds.length} Sessions Bookmarked</p>
            </div>
          </div>
        </div>

        {/* User Interest Selector Pill Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" /> Tailor your preferences for recommendations:
            </span>
            <span className="text-[11px] text-slate-400">Rule-based scoring matches selected tags below</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableInterests.map((interest) => {
              const isSelected = preferences.selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600/90 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* Main Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'recommended' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended ({recommendedList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Saved Agenda ({savedSessionIds.length})
          </button>
        </div>

        {/* Search Input & Category Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sessions or speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tracks</option>
            <option value="Keynote">Keynote</option>
            <option value="AI & Data">AI & Data</option>
            <option value="Web & Cloud">Web & Cloud</option>
            <option value="UX & Product">UX & Product</option>
            <option value="Security & DevOps">Security & DevOps</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>
      </div>

      {/* Recommended View Dedicated Banner */}
      {activeTab === 'recommended' && (
        <div className="bg-indigo-950/40 border border-indigo-800/80 p-4 rounded-xl text-xs text-indigo-200 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-indigo-100">Explainable Recommendation Engine Active</p>
            <p className="text-indigo-300 mt-0.5">
              Recommendations are calculated transparently using an interest tag matching matrix, track affinity, capacity availability, and featured summit status.
            </p>
          </div>
        </div>
      )}

      {/* Sessions Grid */}
      {activeTab === 'recommended' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedList.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center col-span-2">
              No new recommendations right now. Select additional interests above to explore more tracks!
            </p>
          ) : (
            recommendedList.map(({ session, score, matchReasons }) => {
              const isSaved = savedSessionIds.includes(session.id);
              const occupancyPct = Math.round((session.enrolledCount / session.capacity) * 100);

              return (
                <div
                  key={session.id}
                  className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 hover:border-indigo-500/60 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top metadata & Match reasons */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {session.category}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {matchReasons.map((reason, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="bg-indigo-600/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded-lg border border-indigo-500/30">
                        Score: {score}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 leading-snug">{session.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{session.description}</p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold">{session.speaker}</span>
                      <span className="text-slate-500">({session.speakerRole})</span>
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {session.enrolledCount}/{session.capacity} enrolled ({occupancyPct}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => startNavigationTo(session.locationId)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{session.locationName}</span>
                      </button>

                      <button
                        onClick={() => toggleSavedSession(session.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          isSaved
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Bookmarked' : 'Add to Agenda'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center col-span-2">
              No sessions match your active filters.
            </p>
          ) : (
            filteredSessions.map((session) => {
              const isSaved = savedSessionIds.includes(session.id);
              const occupancyPct = Math.round((session.enrolledCount / session.capacity) * 100);

              return (
                <div
                  key={session.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-blue-300 border border-slate-700">
                        {session.category}
                      </span>
                      {session.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{session.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{session.description}</p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold">{session.speaker}</span>
                      <span className="text-slate-500 text-[11px]">({session.speakerRole})</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {session.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {session.enrolledCount}/{session.capacity} ({occupancyPct}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => startNavigationTo(session.locationId)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{session.locationName}</span>
                      </button>

                      <button
                        onClick={() => toggleSavedSession(session.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          isSaved
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Bookmarked' : 'Add to Agenda'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
