import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Zap, Users, Star, 
  MessageSquare, ChevronRight, Hash,
  ThumbsUp, Smile, Clock, TrendingDown,
  Award, Heart, Target, Send
} from 'lucide-react';

// === MOCK DATA ===
const INITIAL_TEAMS = [
  { id: '1', name: 'Design Divas', points: 450, color: 'bg-pink-100 text-pink-700' },
  { id: '2', name: 'Dev Dynamos', points: 410, color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'Marketing Mavs', points: 380, color: 'bg-green-100 text-green-700' },
];

const SEASON_BADGES = [
  { id: '1', name: 'Perfect Streak', earned: true, icon: Flame, description: 'Played 5 days in a row' },
  { id: '2', name: 'Comeback King', earned: true, icon: Zap, description: 'Won after being last' },
  { id: '3', name: 'Team Player', earned: false, icon: Users, description: 'Every team member played' },
  { id: '4', name: 'Trivia Titan', earned: false, icon: Trophy, description: 'Win 3 seasons' },
];

const INITIAL_SHOUTOUTS = [
  { id: '1', from: 'Amit', to: 'Neha', value: 'Innovation', timestamp: '15m ago', reactions: 8 },
  { id: '2', from: 'Sarah', to: 'David', value: 'Ownership', timestamp: '1h ago', reactions: 24 },
  { id: '3', from: 'Michael', to: 'Priya', value: 'Teamwork', timestamp: '2h ago', reactions: 15 },
];

// === COMPONENTS ===

const Card = ({ children, className = '', slackStyle = false, borderColor = 'border-brand-purple' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${slackStyle ? `border-l-4 ${borderColor}` : ''} ${className}`}>
    {children}
  </div>
);

const SlackHeader = ({ channel, title }) => (
  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-50">
    <Hash size={18} className="text-gray-400" />
    <span className="font-bold text-gray-800">{channel}</span>
    {title && (
      <>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-sm">{title}</span>
      </>
    )}
  </div>
);

const Toggle = ({ active, onChange, label1, label2 }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="bg-gray-100 p-1 rounded-full inline-flex">
      <button
        onClick={() => onChange(false)}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          !active ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label1}
      </button>
      <button
        onClick={() => onChange(true)}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          active ? 'bg-brand-purple text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label2}
      </button>
    </div>
  </div>
);

// --- TAB 1: TRIVIA SEASONS ---

const TriviaBefore = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    className="max-w-xl mx-auto space-y-6"
  >
    <Card slackStyle borderColor="border-gray-400" className="p-5">
      <SlackHeader channel="trivia-time" />
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded bg-brand-purple flex items-center justify-center text-white font-bold">
          <Target size={20} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">Quiz complete!</h4>
          <p className="text-gray-600 mt-1">Winner: Priya (8/10)</p>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">Session Leaderboard</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-800">1. Priya</span><span className="font-medium">8 pts</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">2. Rahul</span><span className="font-medium text-gray-500">6 pts</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">3. Amit</span><span className="font-medium text-gray-500">5 pts</span></div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <div className="px-2">
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown size={18} className="text-red-400" />
        <h4 className="font-semibold text-gray-700 text-sm">Engagement Plateau</h4>
      </div>
      <div className="h-32 bg-white rounded-xl border border-gray-100 p-4 flex items-end gap-2">
        {/* Mock Sparkline */}
        <div className="w-1/3 bg-gray-200 rounded-t h-full relative group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Week 1</div>
        </div>
        <div className="w-1/3 bg-gray-200 rounded-t h-2/3 relative group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Week 4</div>
        </div>
        <div className="w-1/3 bg-gray-200 rounded-t h-1/3 relative group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Week 8</div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3 text-center italic">
        "Same 4 people play every time. Everyone else stopped opening it."
      </p>
    </div>
  </motion.div>
);

const TriviaAfter = () => {
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  const simulateSession = () => {
    const newTeams = teams.map(team => ({
      ...team,
      points: team.points + Math.floor(Math.random() * 50) + 10
    })).sort((a, b) => b.points - a.points);
    setTeams(newTeams);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <Card slackStyle borderColor="border-brand-purple" className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-purple to-brand-accent p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Week 2 of 4
            </span>
            <h2 className="text-2xl font-extrabold mt-3 mb-1">Season 3: Q3 Trivia Cup</h2>
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Clock size={14} /> Season ends in 12 days — next reset unlocks new badges
            </p>
          </div>
          <Trophy className="absolute right-[-20px] bottom-[-20px] text-white/10 w-48 h-48 rotate-[-15deg]" />
        </div>
        
        <div className="p-6">
          <SlackHeader channel="trivia-time" title="Season Standings" />
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Team Leaderboard</h3>
                <button 
                  onClick={simulateSession}
                  className="text-xs bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 px-3 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1"
                >
                  <zap size={12} /> Simulate next session
                </button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {teams.map((team, index) => (
                    <motion.div 
                      key={team.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 font-semibold text-gray-800">{team.name}</div>
                      <div className="font-bold text-brand-purple">{team.points} pts</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Season MVP</h3>
                <div className="bg-brand-bg rounded-xl p-4 border border-brand-purple/20 text-center">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-brand-purple to-brand-accent rounded-full p-1 mb-2 relative">
                    <div className="bg-white w-full h-full rounded-full flex items-center justify-center text-lg font-bold text-brand-purple">
                      P
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white p-1 rounded-full shadow-sm">
                      <Star size={12} className="fill-current" />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800">Priya Sharma</h4>
                  <p className="text-xs text-gray-500 mt-1">Most consistent player — played 7/8 sessions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Your Season Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SEASON_BADGES.map(badge => (
                <div key={badge.id} className={`p-3 rounded-xl border text-center transition-all ${
                  badge.earned ? 'bg-brand-accent/10 border-brand-accent/30' : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                }`}>
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    badge.earned ? 'bg-brand-accent text-white shadow-sm' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <badge.icon size={20} className={badge.earned ? 'fill-white/20' : ''} />
                  </div>
                  <div className="text-xs font-bold text-gray-800">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// --- TAB 2: ONE-TAP SHOUTOUTS ---

const EngageBefore = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    className="max-w-2xl mx-auto flex flex-col md:flex-row gap-8 items-start"
  >
    <div className="w-full md:w-2/3">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-white">
            <Award size={16} />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Give Recognition</h3>
        </div>
        
        <div className="space-y-5 relative opacity-80 pointer-events-none">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Step 1: Select a teammate</label>
            <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 flex justify-between">
              Select user... <ChevronRight size={16} className="rotate-90" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Step 2: Select a core value</label>
            <div className="flex gap-2 flex-wrap">
              {['Collaboration', 'Innovation', 'Ownership'].map(v => (
                <span key={v} className="px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-500 bg-gray-50">{v}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Step 3: Write a note</label>
            <textarea className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 h-24 text-sm" placeholder="Why are you recognizing them?" disabled></textarea>
          </div>
          <div className="pt-2">
            <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-bold">Submit Recognition</button>
          </div>
        </div>
      </Card>
    </div>
    
    <div className="w-full md:w-1/3 pt-8">
      <div className="bg-red-50 border border-red-100 rounded-xl p-5 relative">
        <div className="absolute -left-3 top-6 w-3 h-3 bg-red-400 rotate-45 hidden md:block"></div>
        <TrendingDown className="text-red-500 mb-3" size={24} />
        <h4 className="font-bold text-gray-800 mb-2">High Friction</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          <strong className="text-gray-800">4 steps, ~90 seconds.</strong><br/><br/>
          Most spontaneous appreciation moments never make it this far because the formal process is too heavy for small wins.
        </p>
      </div>
    </div>
  </motion.div>
);

const EngageAfter = () => {
  const [shoutouts, setShoutouts] = useState(INITIAL_SHOUTOUTS);
  const [reacted, setReacted] = useState(false);

  const handleReact = () => {
    if (reacted) return;
    setReacted(true);
    
    // Simulate auto-generation delay
    setTimeout(() => {
      setShoutouts([{
        id: Date.now().toString(),
        from: 'You',
        to: 'Rahul',
        value: 'Collaboration',
        timestamp: 'Just now',
        reactions: 0,
        isNew: true
      }, ...shoutouts]);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
        <div className="absolute -top-3 left-6 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Star size={12} className="fill-current" /> Trigger via Emoji
        </div>
        
        <SlackHeader channel="product-team" />
        
        <div className="flex items-start gap-4 mb-2">
          <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            R
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-800">Rahul</span>
              <span className="text-xs text-gray-400">11:42 AM</span>
            </div>
            <p className="text-gray-700 mt-1">Just pushed the new dashboard updates to production. Analytics are tracking perfectly! 🚀</p>
            
            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={handleReact}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all ${
                  reacted ? 'bg-brand-accent/10 border-brand-accent text-brand-accent-dark' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Star size={14} className={reacted ? "fill-current" : ""} />
                <span className="text-xs font-bold">{reacted ? '2' : '1'}</span>
              </button>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <ChevronRight size={14} /> Click the star to give a shoutout!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-[-20px] bottom-0 w-px bg-gray-200 z-0"></div>
        <div className="relative z-10 space-y-4">
          <Card slackStyle borderColor="border-emerald-500" className="p-5 ml-4">
            <SlackHeader channel="kudos" title="Company-wide Feed" />
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {shoutouts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                    className={`p-4 rounded-xl border ${post.isNew ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-gray-100'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold ring-2 ring-white z-10">
                          {post.from.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center text-xs font-bold ring-2 ring-white z-0">
                          {post.to.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 text-sm">
                          <strong>{post.from}</strong> gave <strong>{post.to}</strong> a shoutout for <span className="inline-block px-2 py-0.5 bg-brand-bg text-brand-purple rounded-full text-xs font-bold ml-1">{post.value}</span> 🎉
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{post.timestamp}</span>
                          {post.reactions > 0 && (
                            <span className="flex items-center gap-1">
                              <Heart size={12} className="text-red-400 fill-current" /> {post.reactions}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <TrendingDown size={16} className="rotate-180" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">This week: 47 shoutouts <span className="text-gray-400 font-normal">vs 6 formal recognitions</span></div>
                  <div className="text-xs text-gray-500">Formal awards still matter — shoutouts just catch what slips through.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};


// === MAIN LAYOUT ===

export default function App() {
  const [activeTab, setActiveTab] = useState('trivia'); // 'trivia' | 'engage'
  const [isAfter, setIsAfter] = useState(true);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-black text-xl tracking-tight text-gray-900">
              <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center text-white">
                <Smile size={20} />
              </div>
              Springworks
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => { setActiveTab('trivia'); setIsAfter(true); }}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  activeTab === 'trivia' ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Trivia Seasons
              </button>
              <button 
                onClick={() => { setActiveTab('engage'); setIsAfter(true); }}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  activeTab === 'engage' ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                One-Tap Shoutouts
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            {activeTab === 'trivia' ? 'From One-Off Games to Persistent Play' : 'Frictionless Peer Recognition'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {activeTab === 'trivia' 
              ? 'Solving the engagement plateau by turning single sessions into multi-week team seasons with unlockable rewards.'
              : 'Empowering spontaneous appreciation by replacing heavy forms with intuitive emoji-triggered workflows.'}
          </p>
        </div>

        <Toggle 
          active={isAfter} 
          onChange={setIsAfter} 
          label1="Before: The Gap" 
          label2="After: The Solution" 
        />

        <div className="relative mt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'trivia' && (
              <motion.div key={`trivia-${isAfter}`}>
                {isAfter ? <TriviaAfter /> : <TriviaBefore />}
              </motion.div>
            )}
            {activeTab === 'engage' && (
              <motion.div key={`engage-${isAfter}`}>
                {isAfter ? <EngageAfter /> : <EngageBefore />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* CSS for custom scrollbar hidden in regular tailwind */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
    </div>
  );
}
