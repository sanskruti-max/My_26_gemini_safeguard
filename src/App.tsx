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
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { analyzeMessage, AnalysisResult } from './services/geminiService';

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative">
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-sm group-hover:bg-emerald-500/40 transition-all" />
      <div className="relative w-12 h-12 bg-zinc-900 border border-emerald-500/30 rounded-xl flex items-center justify-center overflow-hidden">
        <Shield className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black tracking-tight text-white leading-none">SAFE<span className="text-emerald-500">GUARD</span></span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Neural Security</span>
    </div>
  </div>
);

const Footer = () => (
  <footer className="py-12 border-t border-zinc-900 mt-auto bg-zinc-950">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 mb-4">
        <div className="w-8 h-[1px] bg-zinc-800" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
          Sanskruti founder and creater
        </p>
        <div className="w-8 h-[1px] bg-zinc-800" />
      </div>
      <div className="flex gap-8 text-zinc-600 text-xs uppercase tracking-widest font-medium">
        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
        <a href="#" className="hover:text-emerald-500 transition-colors">API</a>
      </div>
      <p className="text-zinc-700 text-[10px] mt-4">
        &copy; {new Date().getFullYear()} SAFE GUARD NEURAL SYSTEMS. ALL RIGHTS RESERVED.
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
        <Zap className="w-3 h-3 fill-emerald-400" />
        <span>v3.0 Adversarial Defense Active</span>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]"
      >
        NEURAL <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">PROTECTION.</span>
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Advanced AI analysis with emotional de-escalation and adversarial attack detection. Secure your communication with the next generation of neural defense.
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
          { label: 'Uptime', val: '99.9%' },
          { label: 'Latency', val: '< 200ms' },
          { label: 'Accuracy', val: '99.2%' },
          { label: 'Threats', val: '1.2M+' }
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

  useEffect(() => {
    const saved = localStorage.getItem('safeguard_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeMessage(text);
      setResult(data);
      const newHistory = [data, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('safeguard_history', JSON.stringify(newHistory));
    } catch (err) {
      setError('Neural engine failed to process request. Check connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    a.download = `safeguard-report-${result.id}.txt`;
    a.click();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('safeguard_history');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input & Results */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">NEURAL SCAN</h2>
            <p className="text-zinc-500 text-sm font-medium">Input message content for deep verification.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Engine Ready</span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste message content here for analysis..."
            className="relative w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-lg font-medium"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">
              {text.length} chars
            </span>
            {text.length > 0 && (
              <button onClick={() => setText('')} className="text-zinc-600 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
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
              Processing Neural Layers...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Execute Analysis
            </>
          )}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl glass flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="text-4xl font-black text-white mb-1">{result.safetyScore}%</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Safety</div>
                </div>
                <div className="p-6 rounded-3xl glass flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className={`text-2xl font-black mb-1 ${
                    result.riskLevel === 'Low' ? 'text-emerald-500' : 
                    result.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {result.riskLevel}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Risk</div>
                </div>
                <div className="p-6 rounded-3xl glass flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className={`text-2xl font-black mb-1 ${
                    result.adversarialDefense.attackProbability > 50 ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    {result.adversarialDefense.attackProbability}%
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Adversarial</div>
                </div>
                <div className="p-6 rounded-3xl glass flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="text-2xl font-black text-white mb-1">{result.emotionalIntelligence.tone}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500">Tone</div>
                </div>
              </div>

              {/* Adversarial Defense Feature */}
              <div className={`p-8 rounded-3xl border ${
                result.adversarialDefense.attackProbability > 30 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xs uppercase tracking-[0.3em] font-black flex items-center gap-2 ${
                    result.adversarialDefense.attackProbability > 30 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    <ShieldX className="w-4 h-4" />
                    Adversarial Defense Report
                  </h3>
                  {result.adversarialDefense.isJailbreakAttempt && (
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
                      Jailbreak Detected
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">
                      {result.adversarialDefense.attackProbability > 30 
                        ? `Caution: High probability of adversarial manipulation detected using ${result.adversarialDefense.techniqueDetected || 'unknown'} technique.`
                        : 'No significant adversarial patterns or prompt injection attempts detected in this content.'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <CategoryBar label="Attack Probability" value={result.adversarialDefense.attackProbability} />
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <Lock className="w-3 h-3" />
                      Technique: {result.adversarialDefense.techniqueDetected || 'None'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotional De-escalation Feature */}
              <div className="p-8 rounded-3xl glass border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Emotional Intelligence & De-escalation
                  </h3>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-4 h-4 ${result.emotionalIntelligence.intensity > 60 ? 'text-orange-500' : 'text-zinc-700'}`} />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Intensity: {result.emotionalIntelligence.intensity}%</span>
                  </div>
                  <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.emotionalIntelligence.intensity}%` }}
                      className={`h-full rounded-full ${
                        result.emotionalIntelligence.intensity > 70 ? 'bg-orange-500' : 
                        result.emotionalIntelligence.intensity > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                    <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2 flex items-center gap-2">
                      <MessageSquareQuote className="w-3 h-3" />
                      Suggested De-escalated Version
                    </div>
                    <p className="text-zinc-300 italic font-medium leading-relaxed">
                      "{result.emotionalIntelligence.deEscalatedVersion}"
                    </p>
                    <button 
                      onClick={() => copyToClipboard(result.emotionalIntelligence.deEscalatedVersion, setDeEscalatedCopied)}
                      className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      {deEscalatedCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy De-escalated Text
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl glass space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Category Breakdown
                  </h3>
                  <div className="space-y-4">
                    <CategoryBar label="Phishing" value={result.categories.phishing} />
                    <CategoryBar label="Malware" value={result.categories.malware} />
                    <CategoryBar label="Hate Speech" value={result.categories.hateSpeech} />
                    <CategoryBar label="Spam" value={result.categories.spam} />
                    <CategoryBar label="Harassment" value={result.categories.harassment} />
                  </div>
                </div>
                <div className="p-8 rounded-3xl glass space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Executive Summary
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    {result.summary}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-2">
                    {result.threatsDetected.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-10 rounded-3xl glass relative">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500">Detailed Neural Analysis</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(result.detailedAnalysis, setCopied)}
                      className="p-2 glass hover:bg-white/5 rounded-lg transition-all text-zinc-400 hover:text-white"
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={downloadReport}
                      className="p-2 glass hover:bg-white/5 rounded-lg transition-all text-zinc-400 hover:text-white"
                      title="Download Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="markdown-body">
                  <Markdown>{result.detailedAnalysis}</Markdown>
                </div>
              </div>
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

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="py-12 text-center">
                <History className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">No recent scans</p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setResult(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all text-left group ${
                    result?.id === item.id 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      item.riskLevel === 'Low' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium line-clamp-1 group-hover:text-white transition-colors">
                    {item.summary}
                  </p>
                </button>
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
    <div className="min-h-screen flex flex-col bg-zinc-950 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
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
      <main className="flex-grow">
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
