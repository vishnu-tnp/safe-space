import React, { useState } from 'react';
import { BookOpen, Phone, ExternalLink, Brain, HeartHandshake, Shield, Sparkles, ChevronRight, X } from 'lucide-react';

interface ResourceArticle {
  id: string;
  category: 'science' | 'selfcare';
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  fullContent: string[];
  keyTakeaways: string[];
}

const ARTICLES: ResourceArticle[] = [
  {
    id: 'craving-science',
    category: 'science',
    title: 'The Neurobiology of Cravings',
    subtitle: 'Why cravings last 15-20 minutes and how brain chemistry drives them',
    readTime: '3 min read',
    summary: 'Cravings are automatic neurochemical surges (dopamine triggers) that peak and naturally decay. Understanding this helps depersonalize the distress.',
    fullContent: [
      'A craving is not a conscious choice or moral failing — it is an automated neurochemical response stored in the brain’s limbic reward pathway.',
      'When triggered, the brain experiences a temporary surge in anticipation. However, physiological studies show that an un-fed craving naturally peaks and begins to subside within 15 to 20 minutes.',
      'As a caregiver, your role during a craving isn’t to argue or reason through logic, but to help anchor the person so they can "surf the wave" until neurochemistry stabilizes.'
    ],
    keyTakeaways: [
      'Cravings peak & decay in 15-20 mins.',
      'Don’t debate logic during a peak craving; focus on grounding.',
      'Tactile distractions (like cold water or bubble wrap) help redirect focus.'
    ]
  },
  {
    id: 'halt-triggers',
    category: 'science',
    title: 'Understanding HALT Triggers',
    subtitle: 'Hungry, Angry, Lonely, Tired: The core physiological vulnerability states',
    readTime: '2 min read',
    summary: 'Relapse vulnerabilities are most potent when basic human needs are depleted. HALT serves as a quick diagnostic tool.',
    fullContent: [
      'In recovery literature, HALT stands for Hungry, Angry, Lonely, Tired. When any of these four states are active, executive functioning drops and impulse control weakens.',
      'When your loved one logs high stress or cravings, check if one of these physical foundation states is depleted first before assuming an emotional crisis.',
      'Providing a meal, encouraging a nap, or offering quiet company often solves 80% of immediate distress.'
    ],
    keyTakeaways: [
      'HALT = Hungry, Angry, Lonely, Tired.',
      'Address physical needs (food, rest) before emotional processing.',
      'Keep simple healthy snacks and water accessible.'
    ]
  },
  {
    id: 'caregiver-burnout',
    category: 'selfcare',
    title: 'Preventing Caregiver Burnout',
    subtitle: 'The oxygen mask rule: You cannot pour from an empty cup',
    readTime: '4 min read',
    summary: 'Caregivers frequently experience hyper-vigilance and compassion fatigue. Sustainable support requires explicit self-care boundaries.',
    fullContent: [
      'Supporting someone through addiction recovery is an endurance journey, not a sprint. Chronic hyper-vigilance leads to caregiver burnout, anxiety, and eventual resentment.',
      'The "Oxygen Mask Principle" dictates that you must secure your own mental stability first to be of genuine help to others.',
      'Setting healthy boundaries is an act of love, not abandonment. It communicates stability and prevents codependency.'
    ],
    keyTakeaways: [
      'Schedule non-negotiable personal rest time daily.',
      'Boundaries foster safety; codependency fosters anxiety.',
      'Join support groups (like Al-Anon) to process your own feelings.'
    ]
  },
  {
    id: 'compassionate-boundaries',
    category: 'selfcare',
    title: 'Compassionate Boundaries',
    subtitle: 'How to support without enabling',
    readTime: '3 min read',
    summary: 'Distinguishing between enabling behavior and supportive care is critical for long-term family healing.',
    fullContent: [
      'Enabling occurs when a caregiver steps in to shield an individual from the natural consequences of their choices, which inadvertently delays growth.',
      'Supportive care, on the other hand, empowers the individual by offering emotional presence while letting them own their recovery work.',
      'Clear, calm communication about what you can and cannot do creates a stable container for recovery.'
    ],
    keyTakeaways: [
      'Enabling shields consequences; Support offers presence.',
      'Use "I" statements when stating boundaries.',
      'Consistency creates emotional safety.'
    ]
  }
];

const DIRECTORY_LINKS = [
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: '24/7, 365-day free and confidential treatment referral and information service.',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    badge: '24/7 Helpline',
    color: 'emerald'
  },
  {
    name: 'Al-Anon Family Groups',
    description: 'Support for friends and families of individuals struggling with alcohol addiction.',
    url: 'https://al-anon.org/',
    badge: 'Family Support',
    color: 'cyan'
  },
  {
    name: 'Nar-Anon Family Groups',
    description: '12-step program for family and friends of individuals affected by substance use.',
    url: 'https://www.nar-anon.org/',
    badge: 'Family Support',
    color: 'purple'
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free 24/7 crisis counseling via text message for immediate distress.',
    url: 'https://www.crisistextline.org/',
    badge: 'Text Crisis',
    color: 'amber'
  }
];

export const PsychoeducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'science' | 'selfcare'>('all');
  const [selectedArticle, setSelectedArticle] = useState<ResourceArticle | null>(null);

  const filteredArticles = activeTab === 'all' 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeTab);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-700/60 p-6 shadow-xl space-y-6 backdrop-blur-md">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-50 tracking-tight">Psychoeducation & Support Hub</h2>
            <p className="text-xs text-slate-400">Evidence-based addiction neuroscience, caregiver self-care, and community resources.</p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Guides
          </button>
          <button
            onClick={() => setActiveTab('science')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'science' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Addiction Science
          </button>
          <button
            onClick={() => setActiveTab('selfcare')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'selfcare' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Caregiver Self-Care
          </button>
        </div>
      </div>

      {/* Articles Grid - Fixed min-height prevents layout jump when filtering tabs */}
      <div className="min-h-[340px] flex flex-col justify-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/50 hover:border-cyan-500/30 p-5 rounded-2xl transition-all duration-300 cursor-pointer space-y-3 flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {article.category === 'science' ? <Brain className="w-3 h-3 mr-1" /> : <HeartHandshake className="w-3 h-3 mr-1" />}
                    {article.category === 'science' ? 'Addiction Science' : 'Caregiver Self-Care'}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Read Bite-sized Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Support Groups & Hotlines Directory (Always Visible at Bottom) */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center space-x-2 text-slate-200 font-semibold text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3>Family Support Groups & 24/7 Hotlines</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIRECTORY_LINKS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                {item.phone && (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold pt-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </div>
                )}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-2 rounded-xl transition-all border border-slate-700/60"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pr-6">
              <div className="space-y-1">
                <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {selectedArticle.category === 'science' ? 'Addiction Neuroscience' : 'Caregiver Self-Care'}
                </span>
                <h3 className="text-xl font-bold text-slate-50">{selectedArticle.title}</h3>
                <p className="text-xs text-slate-400">{selectedArticle.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              {selectedArticle.fullContent.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Key Takeaways for Caregivers</h4>
              <ul className="space-y-1.5">
                {selectedArticle.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
