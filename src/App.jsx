import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Zap, Users, Star, 
  ChevronRight, Hash, TrendingDown,
  Award, Heart, Target, Clock, Lock, ArrowDownRight
} from 'lucide-react';

// === MOCK DATA ===
const INITIAL_TEAMS = [
  { id: '1', name: 'Design Divas', points: 450 },
  { id: '2', name: 'Dev Dynamos', points: 410 },
  { id: '3', name: 'Marketing Mavs', points: 380 },
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

// === CSS STYLES ===
const styles = `
  /* Globals */
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; }
  .app-container { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background-color: #FAF9FF; min-height: 100vh; padding-bottom: 80px; }
  .header { background-color: #FFFFFF; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 50; }
  .header-content { max-width: 900px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 22px; color: #111827; }
  .brand-icon { width: 36px; height: 36px; background-color: #6C4FF6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; }
  .nav-pills { display: flex; background-color: #F3F4F6; padding: 4px; border-radius: 8px; }
  .nav-pill { padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
  .nav-pill.active { background-color: #FFFFFF; color: #6C4FF6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .nav-pill:not(.active) { color: #6B7280; }
  .nav-pill:not(.active):hover { color: #374151; }

  .main-content { max-width: 900px; margin: 0 auto; padding: 48px 20px 0; }
  .hero-text { text-align: center; margin-bottom: 48px; }
  .hero-title { font-size: 36px; font-weight: 800; color: #111827; margin: 0 0 16px 0; }
  .hero-subtitle { color: #6B7280; max-width: 600px; margin: 0 auto; line-height: 1.6; font-size: 16px; }

  .toggle-container { display: flex; justify-content: center; margin-bottom: 40px; }
  .toggle { display: inline-flex; background-color: #E5E7EB; padding: 6px; border-radius: 999px; }
  .toggle-btn { padding: 10px 32px; border-radius: 999px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: none; background: transparent; }
  .toggle-btn.active { background-color: #6C4FF6; color: #FFFFFF; box-shadow: 0 2px 8px rgba(108, 79, 246, 0.4); }
  .toggle-btn:not(.active) { color: #4B5563; }
  .toggle-btn:not(.active):hover { color: #111827; background-color: #D1D5DB; }

  /* Cards */
  .card { background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 24px; border: 1px solid #F3F4F6; }
  .card-slack { border-left: 6px solid #6C4FF6; }
  .card-slack-emerald { border-left: 6px solid #10B981; }
  .card-slack-gray { border-left: 6px solid #9CA3AF; }
  .card-body { padding: 24px; }
  .slack-header { display: flex; align-items: center; gap: 8px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #F3F4F6; }
  .slack-channel { font-weight: 700; color: #1F2937; display: flex; align-items: center; gap: 4px; }
  .slack-title-sep { color: #D1D5DB; font-weight: 400; }
  .slack-title { color: #6B7280; font-size: 14px; font-weight: 500; }

  /* Trivia Tabs */
  .gradient-hero { background: linear-gradient(135deg, #6C4FF6, #FFB020); padding: 32px; color: #FFFFFF; position: relative; overflow: hidden; border-radius: 16px 16px 0 0; }
  .season-tag { background: rgba(255,255,255,0.25); backdrop-filter: blur(4px); padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 16px; }
  .season-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; line-height: 1.2; }
  .season-timer { color: rgba(255,255,255,0.95); font-size: 14px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
  .hero-icon { position: absolute; right: -24px; bottom: -24px; color: rgba(255,255,255,0.15); transform: rotate(-15deg); }

  .grid-2-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
  @media (max-width: 768px) { .grid-2-1 { grid-template-columns: 1fr; } }
  .flex-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-weight: 800; color: #1F2937; font-size: 16px; margin: 0; }

  .sim-btn { background-color: #6C4FF6; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 6px rgba(108,79,246,0.3); }
  .sim-btn:hover { background-color: #5B3FE0; }

  .leaderboard-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border-radius: 12px; background-color: #F9FAFB; border: 1px solid #E5E7EB; margin-bottom: 10px; }
  .rank-badge { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
  .rank-1 { background-color: #FFB020; color: #FFFFFF; box-shadow: 0 2px 6px rgba(255,176,32,0.4); }
  .rank-other { background-color: #E5E7EB; color: #4B5563; }
  .team-name { flex: 1; font-weight: 700; color: #1F2937; font-size: 15px; }
  .team-points { font-weight: 800; color: #6C4FF6; font-size: 16px; }

  .mvp-card { background-color: #FAF9FF; border-radius: 12px; padding: 20px; border: 2px solid rgba(108, 79, 246, 0.15); text-align: center; }
  .mvp-avatar { width: 72px; height: 72px; margin: 0 auto 12px; background: linear-gradient(135deg, #6C4FF6, #FFB020); border-radius: 50%; padding: 3px; position: relative; }
  .mvp-avatar-inner { background-color: #FFFFFF; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #6C4FF6; }
  .mvp-star { position: absolute; bottom: -2px; right: -2px; background-color: #FFB020; color: #FFFFFF; padding: 5px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.15); }
  .mvp-name { font-weight: 800; color: #1F2937; margin: 0 0 4px 0; font-size: 16px; }
  .mvp-desc { font-size: 13px; color: #6B7280; margin: 0; line-height: 1.4; }

  .badges-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB; }
  .badges-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px; }
  @media (max-width: 640px) { .badges-grid { grid-template-columns: repeat(2, 1fr); } }
  .badge-item { padding: 16px; border-radius: 16px; border: 2px solid; text-align: center; position: relative; }
  .badge-earned { background-color: rgba(255, 176, 32, 0.05); border-color: rgba(255, 176, 32, 0.2); }
  .badge-locked { background-color: #F9FAFB; border-color: #E5E7EB; opacity: 0.7; }
  .badge-icon-wrapper { width: 48px; height: 48px; margin: 0 auto 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .badge-icon-earned { background-color: #FFB020; color: #FFFFFF; box-shadow: 0 4px 12px rgba(255, 176, 32, 0.3); }
  .badge-icon-locked { background-color: #D1D5DB; color: #6B7280; }
  .badge-name { font-size: 13px; font-weight: 800; color: #1F2937; margin: 0; }
  .lock-icon { position: absolute; top: 8px; right: 8px; color: #9CA3AF; }

  /* Shoutout Tabs */
  .shoutout-before-layout { display: flex; gap: 32px; align-items: flex-start; }
  @media (max-width: 768px) { .shoutout-before-layout { flex-direction: column; } }
  .shoutout-form { flex: 2; width: 100%; }
  .shoutout-friction { flex: 1; background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 16px; padding: 24px; margin-top: 16px; }
  .friction-title { font-weight: 800; color: #991B1B; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px; font-size: 16px; }
  .friction-desc { font-size: 14px; color: #7F1D1D; line-height: 1.6; margin: 0; }

  .form-group { margin-bottom: 24px; }
  .form-label { display: block; font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 10px; }
  .form-input { width: 100%; padding: 14px; border: 1px solid #D1D5DB; border-radius: 10px; background-color: #F9FAFB; color: #6B7280; font-size: 14px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; font-family: inherit; }
  .form-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .form-chip { padding: 8px 16px; border: 1px solid #D1D5DB; border-radius: 999px; font-size: 14px; font-weight: 500; color: #4B5563; background-color: #FFFFFF; }
  .form-textarea { height: 100px; resize: none; width: 100%; padding: 14px; border: 1px solid #D1D5DB; border-radius: 10px; background-color: #F9FAFB; font-family: inherit; font-size: 14px; box-sizing: border-box; }
  .form-submit { width: 100%; background-color: #E5E7EB; color: #9CA3AF; padding: 16px; border-radius: 10px; font-weight: 800; border: none; font-size: 16px; }
  .form-disabled-overlay { opacity: 0.6; pointer-events: none; }

  .slack-message { display: flex; gap: 16px; position: relative; }
  .slack-avatar { width: 44px; height: 44px; border-radius: 8px; background-color: #DBEAFE; color: #1D4ED8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0; }
  .slack-msg-content { flex: 1; }
  .slack-msg-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
  .slack-msg-name { font-weight: 800; color: #1F2937; font-size: 15px; }
  .slack-msg-time { font-size: 12px; color: #9CA3AF; font-weight: 500; }
  .slack-msg-text { color: #374151; line-height: 1.5; margin: 0 0 16px 0; font-size: 15px; }
  .slack-actions { display: flex; align-items: center; gap: 12px; }
  .reaction-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; border: 1px solid #D1D5DB; background-color: #FFFFFF; color: #6B7280; cursor: pointer; transition: all 0.2s; font-size: 13px; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .reaction-btn:hover:not(.reacted) { background-color: #F3F4F6; border-color: #9CA3AF; }
  .reaction-btn.reacted { background-color: #FFFBEB; border-color: #FFB020; color: #B45309; }
  .reaction-hint { font-size: 13px; color: #6B7280; display: flex; align-items: center; gap: 6px; font-weight: 500; background-color: #F3F4F6; padding: 4px 12px; border-radius: 999px; }
  .emoji-trigger-badge { position: absolute; top: -16px; left: 0; background-color: #6C4FF6; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(108,79,246,0.3); }

  .feed-container { position: relative; margin-top: 32px; padding-left: 24px; }
  .feed-line { position: absolute; left: 44px; top: -32px; bottom: 0; width: 2px; background-color: #E5E7EB; z-index: 0; }
  .feed-card-wrapper { position: relative; z-index: 10; margin-left: 12px; }

  .feed-list { max-height: 400px; overflow-y: auto; padding-right: 8px; }
  .feed-list::-webkit-scrollbar { width: 6px; }
  .feed-list::-webkit-scrollbar-track { background: transparent; }
  .feed-list::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 6px; }
  .feed-item { padding: 16px; border-radius: 12px; border: 1px solid #E5E7EB; background-color: #FFFFFF; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .feed-item.new-item { background-color: #ECFDF5; border-color: #10B981; border-left: 4px solid #10B981; }
  .feed-item-content { display: flex; gap: 12px; align-items: flex-start; }
  .avatars-overlap { display: flex; margin-right: 8px; }
  .avatar-1 { width: 36px; height: 36px; border-radius: 50%; background-color: #6C4FF6; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2px solid #FFFFFF; z-index: 2; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
  .avatar-2 { width: 36px; height: 36px; border-radius: 50%; background-color: #FFB020; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2px solid #FFFFFF; z-index: 1; margin-left: -12px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
  .feed-text { font-size: 14px; color: #374151; margin: 0 0 10px 0; line-height: 1.5; }
  .feed-text strong { color: #111827; font-weight: 800; }
  .feed-value-tag { display: inline-block; padding: 2px 10px; background-color: #FAF9FF; color: #6C4FF6; border-radius: 999px; font-size: 12px; font-weight: 800; margin: 0 4px; border: 1px solid rgba(108,79,246,0.2); }
  .feed-meta { display: flex; align-items: center; gap: 16px; font-size: 12px; color: #6B7280; font-weight: 500; }
  .feed-reactions { display: flex; align-items: center; gap: 4px; }

  .stat-strip { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E5E7EB; margin-top: 20px; padding-top: 20px; }
  .stat-item { display: flex; align-items: center; gap: 16px; }
  .stat-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .stat-icon-up { background-color: #D1FAE5; color: #059669; }
  .stat-text { font-size: 15px; font-weight: 800; color: #111827; display: flex; align-items: baseline; gap: 6px; }
  .stat-subtext { color: #6B7280; font-weight: 500; font-size: 14px; }
  .stat-desc { font-size: 13px; color: #6B7280; margin-top: 4px; margin-bottom: 0; }
  
  .trend-box { padding: 16px; border: 1px solid #E5E7EB; border-radius: 12px; background-color: #FFFFFF; display: flex; align-items: flex-end; gap: 8px; height: 160px; margin-top: 12px; }
  .trend-bar { background-color: #E5E7EB; flex: 1; border-radius: 4px 4px 0 0; position: relative; }
  .trend-label { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #6B7280; font-weight: 600; white-space: nowrap; }
`;

// --- TAB 1: TRIVIA SEASONS ---

const TriviaBefore = () => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
    style={{ maxWidth: '600px', margin: '0 auto' }}
  >
    <div className="card card-slack card-slack-gray">
      <div className="card-body">
        <div className="slack-header">
          <Hash size={18} color="#9CA3AF" />
          <span className="slack-channel">trivia-time</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#6C4FF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
            <Target size={20} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: '800', color: '#1F2937', fontSize: '16px' }}>Quiz complete!</h4>
            <p style={{ margin: '0 0 16px 0', color: '#4B5563', fontSize: '14px' }}>Winner: Priya (8/10)</p>
            
            <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#374151' }}>Session Leaderboard</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: '#1F2937', fontWeight: '600' }}>1. Priya</span><span style={{ fontWeight: '700' }}>8 pts</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: '#6B7280' }}>2. Rahul</span><span style={{ color: '#9CA3AF', fontWeight: '600' }}>6 pts</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: '#6B7280' }}>3. Amit</span><span style={{ color: '#9CA3AF', fontWeight: '600' }}>5 pts</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style={{ padding: '0 8px', marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <TrendingDown size={18} color="#EF4444" />
        <h4 style={{ margin: 0, fontWeight: '700', color: '#374151', fontSize: '14px' }}>Engagement Plateau</h4>
      </div>
      <div className="trend-box">
        <div className="trend-bar" style={{ height: '100%' }}><span className="trend-label">Week 1</span></div>
        <div className="trend-bar" style={{ height: '65%' }}><span className="trend-label">Week 4</span></div>
        <div className="trend-bar" style={{ height: '30%' }}><span className="trend-label">Week 8</span></div>
      </div>
      <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '40px', textAlign: 'center', fontStyle: 'italic' }}>
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
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="card card-slack" style={{ padding: 0 }}>
        <div className="gradient-hero">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <span className="season-tag">Week 2 of 4</span>
            <h2 className="season-title">Season 3: Q3 Trivia Cup</h2>
            <div className="season-timer">
              <Clock size={16} color="#FFFFFF" /> Season ends in 12 days — next reset unlocks new badges
            </div>
          </div>
          <Trophy size={150} className="hero-icon" />
        </div>
        
        <div className="card-body">
          <div className="slack-header">
            <Hash size={18} color="#9CA3AF" />
            <span className="slack-channel">trivia-time</span>
            <span className="slack-title-sep">|</span>
            <span className="slack-title">Season Standings</span>
          </div>
          
          <div className="grid-2-1">
            <div>
              <div className="flex-between">
                <h3 className="section-title">Team Leaderboard</h3>
                <button onClick={simulateSession} className="sim-btn">
                  <Zap size={14} color="#FFFFFF" /> Simulate next session
                </button>
              </div>
              <div>
                <AnimatePresence>
                  {teams.map((team, index) => (
                    <motion.div 
                      key={team.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="leaderboard-row"
                    >
                      <div className={`rank-badge ${index === 0 ? 'rank-1' : 'rank-other'}`}>
                        {index + 1}
                      </div>
                      <div className="team-name">{team.name}</div>
                      <div className="team-points">{team.points} pts</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <h3 className="section-title" style={{ marginBottom: '16px' }}>Season MVP</h3>
              <div className="mvp-card">
                <div className="mvp-avatar">
                  <div className="mvp-avatar-inner">P</div>
                  <div className="mvp-star"><Star size={12} color="#FFFFFF" fill="#FFFFFF" /></div>
                </div>
                <h4 className="mvp-name">Priya Sharma</h4>
                <p className="mvp-desc">Most consistent player — played 7/8 sessions this season</p>
              </div>
            </div>
          </div>

          <div className="badges-section">
            <h3 className="section-title">Your Season Badges</h3>
            <div className="badges-grid">
              {SEASON_BADGES.map(badge => (
                <div key={badge.id} className={`badge-item ${badge.earned ? 'badge-earned' : 'badge-locked'}`}>
                  {!badge.earned && <Lock size={14} className="lock-icon" />}
                  <div className={`badge-icon-wrapper ${badge.earned ? 'badge-icon-earned' : 'badge-icon-locked'}`}>
                    <badge.icon size={24} color={badge.earned ? "#FFFFFF" : "#9CA3AF"} fill={badge.earned ? "#FFFFFF" : "transparent"} />
                  </div>
                  <h4 className="badge-name">{badge.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- TAB 2: ONE-TAP SHOUTOUTS ---

const EngageBefore = () => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
    className="shoutout-before-layout"
  >
    <div className="shoutout-form">
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} color="#FFFFFF" />
            </div>
            <h3 style={{ margin: 0, fontWeight: '800', color: '#111827', fontSize: '18px' }}>Give Recognition</h3>
          </div>
          
          <div className="form-disabled-overlay">
            <div className="form-group">
              <label className="form-label">Step 1: Select a teammate</label>
              <div className="form-input">
                Select user... <ChevronRight size={16} color="#9CA3AF" style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Step 2: Select a core value</label>
              <div className="form-chips">
                <span className="form-chip">Collaboration</span>
                <span className="form-chip">Innovation</span>
                <span className="form-chip">Ownership</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Step 3: Write a note</label>
              <textarea className="form-textarea" placeholder="Why are you recognizing them?" disabled></textarea>
            </div>
            <div style={{ paddingTop: '8px' }}>
              <button className="form-submit" disabled>Submit Recognition</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="shoutout-friction">
      <h4 className="friction-title"><TrendingDown size={20} color="#991B1B" /> High Friction</h4>
      <p className="friction-desc">
        <strong style={{ color: '#7F1D1D', fontWeight: '800' }}>4 steps, ~90 seconds.</strong><br/><br/>
        Most spontaneous appreciation moments never make it this far because the formal process is too heavy for small wins.
      </p>
    </div>
  </motion.div>
);

const EngageAfter = () => {
  const [shoutouts, setShoutouts] = useState(INITIAL_SHOUTOUTS);
  const [reacted, setReacted] = useState(false);

  const handleReact = () => {
    if (reacted) return;
    setReacted(true);
    
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
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="card" style={{ padding: '24px' }}>
        <div className="slack-header">
          <Hash size={18} color="#9CA3AF" />
          <span className="slack-channel">product-team</span>
        </div>
        
        <div className="slack-message">
          <div className="emoji-trigger-badge">
            <Star size={12} color="#FFFFFF" fill="#FFFFFF" /> Trigger via Emoji
          </div>
          
          <div className="slack-avatar">R</div>
          <div className="slack-msg-content">
            <div className="slack-msg-header">
              <span className="slack-msg-name">Rahul</span>
              <span className="slack-msg-time">11:42 AM</span>
            </div>
            <p className="slack-msg-text">Just pushed the new dashboard updates to production. Analytics are tracking perfectly! 🚀</p>
            
            <div className="slack-actions">
              <button onClick={handleReact} className={`reaction-btn ${reacted ? 'reacted' : ''}`}>
                <Star size={14} color={reacted ? "#B45309" : "#6B7280"} fill={reacted ? "#B45309" : "transparent"} />
                <span>{reacted ? '2' : '1'}</span>
              </button>
              {!reacted && (
                <div className="reaction-hint">
                  <ArrowDownRight size={14} color="#6B7280" /> Click the star to give a shoutout!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="feed-container">
        <div className="feed-line"></div>
        <div className="feed-card-wrapper">
          <div className="card card-slack-emerald">
            <div className="card-body">
              <div className="slack-header">
                <Hash size={18} color="#9CA3AF" />
                <span className="slack-channel">kudos</span>
                <span className="slack-title-sep">|</span>
                <span className="slack-title">Company-wide Feed</span>
              </div>
              
              <div className="feed-list">
                <AnimatePresence initial={false}>
                  {shoutouts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, height: 0, y: -20, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', y: 0, marginBottom: 12 }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className={`feed-item ${post.isNew ? 'new-item' : ''}`}>
                        <div className="feed-item-content">
                          <div className="avatars-overlap">
                            <div className="avatar-1">{post.from.charAt(0)}</div>
                            <div className="avatar-2">{post.to.charAt(0)}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p className="feed-text">
                              <strong>{post.from}</strong> gave <strong>{post.to}</strong> a shoutout for 
                              <span className="feed-value-tag">{post.value}</span> 🎉
                            </p>
                            <div className="feed-meta">
                              <span>{post.timestamp}</span>
                              {post.reactions > 0 && (
                                <span className="feed-reactions">
                                  <Heart size={12} color="#EF4444" fill="#EF4444" /> {post.reactions}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="stat-strip">
                <div className="stat-item">
                  <div className="stat-icon stat-icon-up">
                    <TrendingDown size={18} color="#059669" style={{ transform: 'rotate(180deg)' }} />
                  </div>
                  <div>
                    <div className="stat-text">
                      This week: 47 shoutouts <span className="stat-subtext">vs 6 formal recognitions</span>
                    </div>
                    <p className="stat-desc">Formal awards still matter — shoutouts just catch what slips through.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    <>
      <style>{styles}</style>
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="brand">
              <div className="brand-icon">
                <Zap size={20} color="#FFFFFF" fill="#FFFFFF" />
              </div>
              Springworks
            </div>
            
            <div className="nav-pills">
              <button 
                onClick={() => { setActiveTab('trivia'); setIsAfter(true); }}
                className={`nav-pill ${activeTab === 'trivia' ? 'active' : ''}`}
              >
                Trivia Seasons
              </button>
              <button 
                onClick={() => { setActiveTab('engage'); setIsAfter(true); }}
                className={`nav-pill ${activeTab === 'engage' ? 'active' : ''}`}
              >
                One-Tap Shoutouts
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {activeTab === 'trivia' ? 'From One-Off Games to Persistent Play' : 'Frictionless Peer Recognition'}
            </h1>
            <p className="hero-subtitle">
              {activeTab === 'trivia' 
                ? 'Solving the engagement plateau by turning single sessions into multi-week team seasons with unlockable rewards.'
                : 'Empowering spontaneous appreciation by replacing heavy forms with intuitive emoji-triggered workflows.'}
            </p>
          </div>

          <div className="toggle-container">
            <div className="toggle">
              <button 
                onClick={() => setIsAfter(false)}
                className={`toggle-btn ${!isAfter ? 'active' : ''}`}
              >
                Before: The Gap
              </button>
              <button 
                onClick={() => setIsAfter(true)}
                className={`toggle-btn ${isAfter ? 'active' : ''}`}
              >
                After: The Solution
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
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
      </div>
    </>
  );
}
