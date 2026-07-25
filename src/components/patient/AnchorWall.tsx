import React, { useState, useEffect } from 'react';
import { Anchor, Plus, Heart, Compass, ShieldCheck, X } from 'lucide-react';

interface AnchorItem {
  id: string;
  title: string;
  category: 'family' | 'goal' | 'health' | 'note';
  color: string;
}

const DEFAULT_ANCHORS: AnchorItem[] = [
  { id: '1', title: 'My Family & Loved Ones', category: 'family', color: 'from-rose-500/20 to-pink-500/10' },
  { id: '2', title: 'Better Physical & Mental Health', category: 'health', color: 'from-emerald-500/20 to-teal-500/10' },
  { id: '3', title: 'Financial Stability & Freedom', category: 'goal', color: 'from-amber-500/20 to-orange-500/10' },
  { id: '4', title: 'Building a Peaceful Future', category: 'note', color: 'from-cyan-500/20 to-blue-500/10' },
];

const STORAGE_KEY = 'safe_space_anchor_items';

export const AnchorWall: React.FC = () => {
  const [anchors, setAnchors] = useState<AnchorItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ANCHORS;
    } catch {
      return DEFAULT_ANCHORS;
    }
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(anchors));
    } catch (e) {
      console.error('Failed to save anchors', e);
    }
  }, [anchors]);

  const handleAddAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: AnchorItem = {
      id: `anchor-${Date.now()}`,
      title: newTitle.trim(),
      category: 'note',
      color: 'from-purple-500/20 to-indigo-500/10',
    };

    setAnchors([newItem, ...anchors]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Anchor className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">Recovery Anchor Wall</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Anchor</span>
        </button>
      </div>

      {/* Grid of Anchor Cards */}
      <div className="grid grid-cols-2 gap-3">
        {anchors.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 min-h-[100px] shadow-sm hover:border-slate-700 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              {item.category === 'family' && <Heart className="w-4 h-4 text-rose-400" />}
              {item.category === 'health' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              {item.category === 'goal' && <Compass className="w-4 h-4 text-amber-400" />}
              {item.category === 'note' && <Anchor className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-200 leading-snug">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Add Custom Anchor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-100">Add Recovery Reason</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAnchor} className="space-y-3">
              <input
                type="text"
                placeholder="What grounds you? (e.g. My children, my health...)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-medium text-white text-sm transition-colors"
              >
                Save to Anchor Wall
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
