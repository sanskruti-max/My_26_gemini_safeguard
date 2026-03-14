/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  Loader2, 
  RefreshCcw, 
  History, 
  Download, 
  Copy, 
  Check, 
  Trash2,
  ExternalLink,
  Zap,
  Lock,
  Eye,
  AlertTriangle,
  Heart,
  ShieldX,
  MessageSquareQuote,
  Flame,
  Dna,
  Cpu,
  Fingerprint,
  Globe,
  Binary,
  Activity,
  Orbit,
  Share2,
  TrendingUp,
  Hash,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  BarChart3,
  Smile,
  Meh,
  Frown,
  FileText,
  Terminal,
  Volume2,
  VolumeX,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { analyzeMessage, AnalysisResult, generateSpeech } from './services/geminiService';

// --- Components ---

const QuantumStatus = () => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
    <div className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </div>
    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Quantum-Resistant Active</span>
  </div>
);

const NeuralDNA = ({ sequence }: { sequence: string }) => (
  <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-500/60 overflow-hidden">
    {sequence.split('').map((char, i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
      >
        {char}
      </motion.span>
    ))}
  </div>
);

const SkeletonLoader = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex flex-wrap gap-2 p-2 glass rounded-3xl">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 w-24 bg-zinc-800 rounded-2xl" />
      ))}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 glass rounded-3xl" />
      ))}
    </div>

    <div className="p-8 rounded-3xl glass space-y-4">
      <div className="h-4 w-32 bg-zinc-800 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-zinc-800/50 rounded" />
        <div className="h-4 w-5/6 bg-zinc-800/50 rounded" />
        <div className="h-4 w-4/6 bg-zinc-800/50 rounded" />
      </div>
    </div>
  </div>
);

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-[10px] font-black text-zinc-300 uppercase tracking-widest whitespace-nowrap shadow-2xl pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative">
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-sm group-hover:bg-emerald-500/40 transition-all" />
      <div className="relative w-12 h-12 bg-zinc-900 border border-emerald-500/30 rounded-xl flex items-center justify-center overflow-hidden">
        <Share2 className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black tracking-tight text-white leading-none">SOCIAL<span className="text-emerald-500">PULSE</span></span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">AI Intelligence Engine</span>
    </div>
  </div>
);

const Scanline = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    <motion.div 
      animate={{ y: ['0%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 blur-sm"
    />
  </div>
);

const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
  </div>
);

const Footer = () => (
  <footer className="py-12 border-t border-zinc-900 mt-auto bg-zinc-950">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 mb-4">
        <div className="w-12 h-[1px] bg-emerald-500/20" />
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-emerald-400 text-sm font-black uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(16,185_129,0.5)] text-center">
          Sanskruti Founder and Creator
        </p>
        <div className="w-12 h-[1px] bg-emerald-500/20" />
      </div>
      <div className="flex gap-8 text-zinc-600 text-xs uppercase tracking-widest font-medium">
        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">API</a>
      </div>
      <p className="text-zinc-700 text-[10px] mt-4">
        &copy; {new Date().getFullYear()} SOCIAL PULSE AI SYSTEMS. ALL RIGHTS RESERVED.
      </p>
    </div>
  </footer>
);

const CategoryBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold">
      <span className="text-zinc-500">{label}</span>
      <span className={value > 50 ? 'text-red-400' : 'text-emerald-400'}>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full rounded-full ${
          value > 70 ? 'bg-red-500' : value > 30 ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />
    </div>
  </div>
);

// --- Pages ---

const HomePage = ({ onStart }: { onStart: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative atmosphere min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
  >
    {/* Decorative Elements */}
    <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

    <div className="relative z-10 max-w-4xl mx-auto">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-emerald text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
      >
        <TrendingUp className="w-3 h-3 text-emerald-400" />
        <span>v4.0 Social Impact Engine Active</span>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
      >
        SOCIAL <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">IMPACT.</span>
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Advanced AI analysis for social media posts. Predict engagement, viral potential, and sentiment while ensuring safety and neural integrity.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button 
          onClick={onStart}
          className="group relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95"
        >
          Initialize Core
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-10 py-5 glass hover:bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">
          View Documentation
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24"
      >
        {[
          { label: 'Engagement', val: '94.2%' },
          { label: 'Viral Rate', val: '12.5%' },
          { label: 'Accuracy', val: '99.2%' },
          { label: 'Analyzed', val: '2.4M+' }
        ].map((stat, i) => (
          <div key={i} className="p-4 glass rounded-2xl">
            <div className="text-xl font-black text-white">{stat.val}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const AnalysisPage = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deEscalatedCopied, setDeEscalatedCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingStep, setLoadingStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [filterThreat, setFilterThreat] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  const filteredHistory = React.useMemo(() => {
    let filtered = history.filter(item => {
      const matchesRisk = filterRisk === 'All' || item.riskLevel === filterRisk;
      const matchesThreat = !filterThreat || 
        item.threatsDetected.some(t => t.toLowerCase().includes(filterThreat.toLowerCase())) ||
        item.summary.toLowerCase().includes(filterThreat.toLowerCase());
      return matchesRisk && matchesThreat;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      } else {
        const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
    });
  }, [history, filterRisk, filterThreat, sortBy]);

  const loadingSteps = [
    "Initializing Neural Engine...",
    "Scanning Linguistic Patterns...",
    "Decoding Social Fingerprint...",
    "Verifying Adversarial Integrity...",
    "Synthesizing Impact Report..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingSteps.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const playAudioFeedback = async (isSafe: boolean) => {
    if (isMuted) return;
    const message = isSafe ? "Analysis complete. The content is verified as safe." : "Warning. Neural threats detected. Proceed with extreme caution.";
    const base64Data = await generateSpeech(message);
    if (base64Data) {
      try {
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const numSamples = bytes.length / 2;
        const audioBuffer = audioContext.createBuffer(1, numSamples, 24000);
        const channelData = audioBuffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        
        for (let i = 0; i < numSamples; i++) {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Clarity Enhancement: High-shelf filter to boost presence
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highshelf';
        filter.frequency.value = 3000;
        filter.gain.value = 6; // 6dB boost for clarity

        // Normalization: Gain node to ensure consistent volume
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1.2; // Slight boost

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        source.start();
      } catch (e) {
        console.error("Audio playback failed:", e);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeMessage(text);
      setResult(res);
      setHistory(prev => [res, ...prev].slice(0, 10));
      
      // Audio Feedback
      const isSafe = res.safetyScore >= 70 && res.threatsDetected.length === 0;
      playAudioFeedback(isSafe);

    } catch (err) {
      setError("Neural link failed. Please retry initialization.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const highlightedAnalysis = React.useMemo(() => {
    if (!result) return '';
    let content = result.detailedAnalysis;
    result.threatsDetected.forEach(threat => {
      if (threat.length < 3) return;
      // Escape special regex characters
      const escapedThreat = threat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedThreat})`, 'gi');
      content = content.replace(regex, '<mark class="threat-highlight">$1</mark>');
    });
    return content;
  }, [result]);

  useEffect(() => {
    const saved = localStorage.getItem('socialpulse_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('socialpulse_history', JSON.stringify(history));
  }, [history]);

  const copyToClipboard = (content: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(content);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([result.detailedAnalysis], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `socialpulse-report-${result.id}.txt`;
    a.click();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('socialpulse_history');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      {/* Left Column: Input & Results */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 glass hover:bg-white/5 rounded-xl transition-all text-zinc-400 hover:text-white"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="h-8 w-[1px] bg-white/5" />
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Social Pulse Analysis</h2>
              <p className="text-zinc-500 text-sm font-medium">Input social media content for deep impact verification.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Engine Ready</span>
          </div>
        </div>

        <div className="relative group">
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px]" />
                <motion.div
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-6 w-full max-w-xs px-8">
                    <div className="relative">
                      <Activity className="w-16 h-16 text-emerald-500 animate-pulse" />
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border-2 border-dashed border-emerald-500/20 rounded-full"
                      />
                    </div>
                    <div className="space-y-3 w-full text-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={loadingStep}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]"
                        >
                          {loadingSteps[loadingStep]}
                        </motion.div>
                      </AnimatePresence>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your social media post, tweet, or message for deep analysis..."
            className="relative w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-lg font-medium"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-700 mb-1">Character Count</span>
              <span className={`text-xs font-mono font-bold ${text.length > 2000 ? 'text-amber-500' : 'text-zinc-500'}`}>
                {text.length.toLocaleString()}
              </span>
            </div>
            {text.length > 0 && (
              <button 
                onClick={() => setText('')} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/20 transition-all group"
                title="Clear Input"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Clear</span>
                <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Social Impact...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Execute Analysis
            </>
          )}
        </button>

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <SkeletonLoader />
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`space-y-8 p-1 rounded-[2.5rem] transition-all duration-500 ${
                result.categories.spam > 70 
                  ? 'bg-gradient-to-b from-red-500/20 to-transparent ring-2 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                  : ''
              }`}
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-2 glass rounded-3xl">
                {[
                  { id: 'overview', label: 'Overview', icon: Info },
                  { id: 'social', label: 'Social Media', icon: TrendingUp },
                  { id: 'safety', label: 'Safety', icon: ShieldX },
                  { id: 'intelligence', label: 'Intelligence', icon: Heart },
                  { id: 'report', label: 'Detailed Report', icon: Binary },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Left Column: Primary Stats */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className={`p-8 rounded-[2rem] glass relative overflow-hidden group border-2 transition-all duration-500 ${
                        result.safetyScore > 80 ? 'border-emerald-500/30' : 
                        result.safetyScore > 50 ? 'border-amber-500/30' : 'border-red-500/30'
                      }`}>
                        <div className={`absolute inset-0 opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20 ${
                          result.safetyScore > 80 ? 'bg-emerald-500' : 
                          result.safetyScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <Tooltip text="Aggregate Safety Score">
                            <div className={`text-7xl font-black mb-2 tracking-tighter cursor-help ${
                              result.safetyScore > 80 ? 'text-emerald-500' : 
                              result.safetyScore > 50 ? 'text-amber-500' : 'text-red-500'
                            }`}>{result.safetyScore}%</div>
                          </Tooltip>
                          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 mb-6">Safety Integrity</div>
                          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            result.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-500' :
                            result.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {result.riskLevel} Risk Profile
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl glass text-center group hover:bg-white/5 transition-all">
                          <div className="text-2xl font-black text-white mb-1">{result.socialMedia.engagementPotential}%</div>
                          <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Engagement</div>
                        </div>
                        <div className="p-6 rounded-3xl glass text-center group hover:bg-white/5 transition-all">
                          <div className="text-2xl font-black text-white mb-1">{result.socialMedia.viralProbability}%</div>
                          <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Viral Prob.</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Summary & Threats */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="p-8 rounded-[2rem] glass relative overflow-hidden min-h-[200px] flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        <div className="relative z-10 space-y-4">
                          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            Neural Summary
                          </h3>
                          <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                            {result.summary}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 rounded-[2rem] glass space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Detected Anomalies</h3>
                        <div className="flex flex-wrap gap-3">
                          {result.threatsDetected.length > 0 ? (
                            result.threatsDetected.map((t, i) => (
                              <motion.span 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all cursor-default"
                              >
                                {t}
                              </motion.span>
                            ))
                          ) : (
                            <div className="flex items-center gap-3 text-emerald-500/60 py-2">
                              <ShieldCheck className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase tracking-widest">No Critical Threats Detected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'social' && (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Engagement & Viral Stats */}
                    <div className="lg:col-span-8 p-8 rounded-[2rem] glass relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-32 h-32" />
                      </div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                              <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Engagement Metrics</h3>
                          </div>
                          <div className="flex gap-12">
                            <div className="space-y-1">
                              <Tooltip text="Likelihood of audience engagement">
                                <div className="text-4xl font-black text-white cursor-help">{result.socialMedia.engagementPotential}%</div>
                              </Tooltip>
                              <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Engagement Potential</div>
                            </div>
                            <div className="space-y-1">
                              <Tooltip text="Likelihood of rapid social spread">
                                <div className="text-4xl font-black text-white cursor-help">{result.socialMedia.viralProbability}%</div>
                              </Tooltip>
                              <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Viral Probability</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-48 space-y-4">
                          <CategoryBar label="Viral Velocity" value={result.socialMedia.viralProbability} />
                          <CategoryBar label="Audience Retention" value={result.socialMedia.engagementPotential} />
                        </div>
                      </div>
                    </div>

                    {/* Sentiment Card */}
                    <div className="lg:col-span-4 p-8 rounded-[2rem] glass flex flex-col items-center justify-center text-center space-y-6">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        result.socialMedia.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-500' :
                        result.socialMedia.sentiment === 'Negative' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {result.socialMedia.sentiment === 'Positive' ? <Smile className="w-10 h-10" /> :
                         result.socialMedia.sentiment === 'Negative' ? <Frown className="w-10 h-10" /> : <Meh className="w-10 h-10" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white uppercase tracking-tighter">{result.socialMedia.sentiment}</div>
                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Neural Sentiment</div>
                      </div>
                    </div>

                    {/* Platform Optimization */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-8 rounded-[2rem] glass border-white/5 space-y-6 group hover:bg-[#1DA1F2]/5 transition-all">
                        <div className="flex items-center justify-between">
                          <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                          <div className="px-2 py-1 rounded bg-[#1DA1F2]/10 text-[#1DA1F2] text-[8px] font-black uppercase tracking-widest">X-Optimization</div>
                        </div>
                        <p className="text-base text-zinc-300 leading-relaxed font-medium">"{result.socialMedia.platformOptimization.twitter}"</p>
                      </div>
                      <div className="p-8 rounded-[2rem] glass border-white/5 space-y-6 group hover:bg-[#E4405F]/5 transition-all">
                        <div className="flex items-center justify-between">
                          <Instagram className="w-6 h-6 text-[#E4405F]" />
                          <div className="px-2 py-1 rounded bg-[#E4405F]/10 text-[#E4405F] text-[8px] font-black uppercase tracking-widest">Insta-Boost</div>
                        </div>
                        <p className="text-base text-zinc-300 leading-relaxed font-medium">"{result.socialMedia.platformOptimization.instagram}"</p>
                      </div>
                      <div className="p-8 rounded-[2rem] glass border-white/5 space-y-6 group hover:bg-[#0A66C2]/5 transition-all">
                        <div className="flex items-center justify-between">
                          <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                          <div className="px-2 py-1 rounded bg-[#0A66C2]/10 text-[#0A66C2] text-[8px] font-black uppercase tracking-widest">Pro-Network</div>
                        </div>
                        <p className="text-base text-zinc-300 leading-relaxed font-medium">"{result.socialMedia.platformOptimization.linkedIn}"</p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="lg:col-span-12 p-8 rounded-[2rem] glass border-white/5">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Hash className="w-5 h-5 text-emerald-500" />
                          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Neural Hashtag Generation</h3>
                        </div>
                        <TrendingUp className="w-4 h-4 text-zinc-700" />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {result.socialMedia.suggestedHashtags.map((tag, i) => (
                          <motion.span 
                            key={i}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="px-5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                          >
                            #{tag.replace('#', '')}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'safety' && (
                  <motion.div
                    key="safety"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    <div className="lg:col-span-12">
                      <div className={`p-8 rounded-[2rem] border-2 relative overflow-hidden ${
                        result.adversarialDefense.attackProbability > 30 
                          ? 'bg-red-500/5 border-red-500/20' 
                          : 'bg-emerald-500/5 border-emerald-500/20'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${
                              result.adversarialDefense.attackProbability > 30 ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                            }`}>
                              <ShieldX className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Adversarial Defense</h3>
                              <Tooltip text="Probability of adversarial manipulation or prompt injection">
                                <div className={`text-xl font-black cursor-help ${
                                  result.adversarialDefense.attackProbability > 30 ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                  {result.adversarialDefense.attackProbability > 30 ? 'High Risk Detected' : 'Secure Integrity'}
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                          {result.adversarialDefense.isJailbreakAttempt && (
                            <div className="px-6 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full animate-pulse shadow-lg shadow-red-500/40">
                              Jailbreak Attempt
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-4">
                            <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                              {result.adversarialDefense.attackProbability > 30 
                                ? `Our neural scanners have identified patterns consistent with ${result.adversarialDefense.techniqueDetected || 'advanced'} adversarial manipulation.`
                                : 'Linguistic integrity verified. No significant adversarial patterns or prompt injection attempts detected.'}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-white/5">
                                <Lock className="w-3 h-3" />
                                {result.adversarialDefense.techniqueDetected || 'None'}
                              </div>
                            </div>
                          </div>
                          <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                            <CategoryBar label="Attack Probability" value={result.adversarialDefense.attackProbability} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 p-8 rounded-[2rem] glass space-y-8">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-zinc-500" />
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Risk Category Breakdown</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <CategoryBar label="Phishing" value={result.categories.phishing} />
                        <CategoryBar label="Malware" value={result.categories.malware} />
                        <CategoryBar label="Hate Speech" value={result.categories.hateSpeech} />
                        <CategoryBar label="Spam" value={result.categories.spam} />
                        <CategoryBar label="Harassment" value={result.categories.harassment} />
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-8 rounded-[2rem] glass flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-full border-4 border-dashed border-zinc-800 flex items-center justify-center">
                        <ShieldCheck className={`w-10 h-10 ${result.safetyScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`} />
                      </div>
                      <div className="space-y-2">
                        <div className="text-4xl font-black text-white">{result.safetyScore}%</div>
                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Overall Safety Score</div>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed px-4">
                        This score represents the aggregate safety integrity across all neural scanning categories.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'intelligence' && (
                  <motion.div
                    key="intelligence"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Neural Fingerprint */}
                    <div className="lg:col-span-12 p-8 rounded-[2rem] glass relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fingerprint className="w-32 h-32" />
                      </div>
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                              <Fingerprint className="w-6 h-6" />
                            </div>
                            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Neural Fingerprint</h3>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <Tooltip text="Probability that content was AI-generated">
                              <span className="text-5xl font-black text-white cursor-help">{result.neuralFingerprint.aiProbability}%</span>
                            </Tooltip>
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">AI Probability</span>
                          </div>
                        </div>
                        <div className="space-y-4 min-w-[240px]">
                          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 mb-2">DNA Sequence</div>
                          <Tooltip text="Unique linguistic signature generated from neural patterns">
                            <div className="cursor-help">
                              <NeuralDNA sequence={result.neuralFingerprint.dnaSequence} />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    {/* Tone & Style */}
                    <div className="lg:col-span-6 p-8 rounded-[2rem] glass space-y-8">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500/50" />
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Emotional Intelligence</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                          <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Primary Tone</div>
                          <div className="text-xl font-black text-white capitalize">{result.emotionalIntelligence.tone}</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                          <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Intensity</div>
                          <div className="text-xl font-black text-white">{result.emotionalIntelligence.intensity}%</div>
                        </div>
                      </div>
                      <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                        <div className="text-[8px] uppercase tracking-widest font-black text-emerald-500/60">Origin Style</div>
                        <div className="text-xl font-black text-emerald-400">{result.neuralFingerprint.originStyle}</div>
                      </div>
                    </div>

                    {/* De-escalation */}
                    <div className="lg:col-span-6 p-8 rounded-[2rem] glass relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <RefreshCcw className="w-5 h-5 text-emerald-500" />
                          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Neural De-escalation</h3>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(result.emotionalIntelligence.deEscalatedVersion, setDeEscalatedCopied)}
                          className="p-2 glass hover:bg-white/5 rounded-lg transition-all text-zinc-400 hover:text-white"
                        >
                          {deEscalatedCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex-1 p-6 rounded-3xl bg-black/20 border border-white/5 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Zap className="w-4 h-4 text-emerald-500/40" />
                        </div>
                        <p className="text-zinc-300 text-base leading-relaxed font-medium italic">
                          "{result.emotionalIntelligence.deEscalatedVersion}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'report' && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Report Header / Metadata */}
                    <div className="lg:col-span-12 p-8 rounded-[2rem] glass flex flex-wrap items-center justify-between gap-8">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
                          <FileText className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Neural Intelligence Dossier</h3>
                          <div className="text-xl font-black text-white">Scan ID: {result.id.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="text-[8px] uppercase tracking-widest font-black text-zinc-500">Timestamp</div>
                          <div className="text-xs font-mono text-zinc-300">{new Date(result.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <Tooltip text="Copy Markdown">
                            <button 
                              onClick={() => copyToClipboard(result.detailedAnalysis, setCopied)}
                              className="p-3 glass hover:bg-white/5 rounded-xl transition-all text-zinc-400 hover:text-white"
                            >
                              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </Tooltip>
                          <Tooltip text="Download PDF">
                            <button 
                              onClick={downloadReport}
                              className="p-3 glass hover:bg-white/5 rounded-xl transition-all text-zinc-400 hover:text-white"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-12 p-10 rounded-[2rem] glass relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Terminal className="w-96 h-96" />
                      </div>
                      <div className="markdown-body relative z-10">
                        <Markdown rehypePlugins={[rehypeRaw]}>{highlightedAnalysis}</Markdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: History & Stats */}
      <div className="lg:col-span-4 space-y-8">
        <div className="p-8 rounded-3xl glass space-y-6 sticky top-32">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500 flex items-center gap-2">
              <History className="w-4 h-4" />
              Scan History
            </h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 hover:text-red-400 transition-colors">
                Clear
              </button>
            )}
          </div>

          {history.length > 0 && (
            <div className="space-y-4">
              {/* Search & Filter Controls */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input 
                  type="text"
                  value={filterThreat}
                  onChange={(e) => setFilterThreat(e.target.value)}
                  placeholder="Search threats or summary..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-bold text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                  <select 
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as any)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-8 pr-4 text-[10px] font-bold text-zinc-400 appearance-none focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="All">All Risks</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <button 
                  onClick={() => setSortBy(prev => prev === 'date' ? 'risk' : 'date')}
                  className={`flex items-center gap-2 px-4 rounded-xl border transition-all ${
                    sortBy === 'risk' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={`Sorting by ${sortBy === 'date' ? 'Date' : 'Risk Level'}`}
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {sortBy === 'date' ? 'Date' : 'Risk'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="py-12 text-center">
                <History className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
                  {history.length === 0 ? 'No recent scans' : 'No matches found'}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (result?.id === item.id) {
                        setResult(null);
                      } else {
                        setResult(item);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (result?.id === item.id) {
                          setResult(null);
                        } else {
                          setResult(item);
                        }
                      }
                    }}
                    className={`w-full p-4 rounded-2xl border transition-all text-left group relative overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                      result?.id === item.id 
                        ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 relative z-10">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        item.riskLevel === 'Low' ? 'text-emerald-500' : item.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </div>
                    <p className={`text-xs font-medium transition-colors relative z-10 ${
                      result?.id === item.id ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                    } ${result?.id === item.id ? '' : 'line-clamp-1'}`}>
                      {item.summary}
                    </p>

                    <AnimatePresence>
                      {result?.id === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-emerald-500/20 space-y-4 relative z-10"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                              <div className="text-[8px] uppercase tracking-widest text-zinc-500 font-black mb-1">Safety</div>
                              <div className="flex items-center gap-2">
                                <Shield className={`w-3 h-3 ${item.safetyScore > 70 ? 'text-emerald-500' : 'text-red-500'}`} />
                                <span className="text-sm font-black text-white">{item.safetyScore}%</span>
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                              <div className="text-[8px] uppercase tracking-widest text-zinc-500 font-black mb-1">Engagement</div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-sm font-black text-white">{item.socialMedia.engagementPotential}%</span>
                              </div>
                            </div>
                          </div>

                          {item.threatsDetected.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="text-[8px] uppercase tracking-widest text-red-400 font-black">Threats Detected</div>
                              <div className="flex flex-wrap gap-1">
                                {item.threatsDetected.slice(0, 3).map((threat, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[8px] font-bold text-red-400 uppercase tracking-tighter">
                                    {threat}
                                  </span>
                                ))}
                                {item.threatsDetected.length > 3 && (
                                  <span className="text-[8px] font-bold text-zinc-600">+{item.threatsDetected.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-3 h-3" />
                            View Full Analysis
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {result?.id === item.id && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider">Neural Privacy</div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">End-to-End Encrypted</div>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">
                All message data is processed in real-time and never stored on our servers. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyze'>('home');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden flex flex-col">
      <Scanline />
      <GridBackground />
      
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 glass border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => setCurrentPage('home')} className="hover:opacity-80 transition-opacity">
            <Logo />
          </button>
          
          <nav className="hidden md:flex items-center gap-12">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`text-[10px] uppercase tracking-[0.3em] font-black transition-colors ${currentPage === 'home' ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'}`}
            >
              System
            </button>
            <button 
              onClick={() => setCurrentPage('analyze')}
              className={`text-[10px] uppercase tracking-[0.3em] font-black transition-colors ${currentPage === 'analyze' ? 'text-emerald-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Neural Scan
            </button>
            <a 
              href="#"
              className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          <button 
            onClick={() => setCurrentPage('analyze')}
            className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-800 transition-all active:scale-95"
          >
            Launch Core
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <HomePage key="home" onStart={() => setCurrentPage('analyze')} />
          ) : (
            <AnalysisPage key="analyze" />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
