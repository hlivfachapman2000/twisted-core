/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { HeroScene } from './components/QuantumScene';
import { InfrastructureDiagram, AgentWorkflowDiagram } from './components/Diagrams';
import { DesignerPanel } from './components/DesignerPanel';
import { Terminal, Cpu, Shield, Activity, Share2, Bot, Box, MousePointer2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const ProductCard = ({ id, title, description, icon: Icon, tags, color = "blue", onSelect, isSelected }: { id: string, title: string, description: string, icon: any, tags: string[], color?: string, onSelect?: (id: string) => void, isSelected?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorClasses = {
    blue: "text-twisted-blue border-twisted-blue/30 group-hover:border-twisted-blue",
    purple: "text-twisted-purple border-twisted-purple/30 group-hover:border-twisted-purple",
    green: "text-twisted-green border-twisted-green/30 group-hover:border-twisted-green",
    red: "text-twisted-red border-twisted-red/30 group-hover:border-twisted-red",
  }[color as string] || "text-twisted-blue border-twisted-blue/30 group-hover:border-twisted-blue";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onSelect?.(id);
  };

  return (
    <div
      onClick={() => onSelect?.(id)}
      className={`group glass-card p-6 rounded-xl transition-all duration-300 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-twisted-blue/40 ${isSelected ? 'ring-2 ring-twisted-blue shadow-[0_0_20px_rgba(51,153,255,0.2)] animate-selected-pulse' : ''}`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClasses.split(' ')[0]}`}>
        <Icon size={80} />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses} bg-white/5`}>
          <Icon size={20} />
        </div>
        <button
          onClick={handleToggle}
          className="p-1 rounded hover:bg-white/10 text-gray-400 transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <h3 className="font-sans font-bold text-xl text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">{description}</p>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2 border-t border-white/10 text-xs text-gray-500 space-y-2">
          <p className="font-mono uppercase tracking-tighter text-twisted-blue">Neural Path: Active</p>
          <p>Orchestrating autonomous agents across distributed forge nodes. Optimized for low-latency context switching.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [designerActive, setDesignerActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [inputBuffer, setInputBuffer] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      const char = e.key.toLowerCase();
      setInputBuffer(prev => {
        const next = (prev + char).slice(-7);
        if (next === "twisted") {
          toggleDesigner();
          return "";
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [designerActive]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDesigner = async () => {
    if (!designerActive) {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 800));
      setDesignerActive(true);
      setIsProcessing(false);
    } else {
      setDesignerActive(false);
      setSelectedElements([]);
    }
  };

  const handleElementSelect = useCallback((id: string) => {
    if (designerActive) {
      // Toggle selection - click to add/remove from selection
      setSelectedElements(prev =>
        prev.includes(id)
          ? prev.filter(e => e !== id)
          : [...prev, id]
      );
    }
  }, [designerActive]);

  return (
    <div className={`min-h-screen bg-twisted-dark text-gray-200 selection:bg-twisted-blue selection:text-white overflow-x-hidden ${designerActive ? 'cursor-crosshair' : ''}`}>
      <DesignerPanel
        isOpen={designerActive}
        onClose={() => {
          setDesignerActive(false);
          setSelectedElements([]);
        }}
        selectedIds={selectedElements}
        onClearSelection={() => setSelectedElements([])}
      />

      {designerActive && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in pointer-events-none">
          <div className="bg-twisted-blue/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-mono text-xs shadow-2xl flex items-center gap-4 border border-white/20">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
              <MousePointer2 size={16} />
            </div>
            <div>
              <div className="font-bold uppercase tracking-widest">Architect Interaction Mode</div>
              <div className="text-[10px] opacity-70">Click UI nodes to mutate state</div>
            </div>
          </div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-twisted-dark/90 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-8 h-8 transition-transform group-hover:rotate-90 duration-500">
              <div className="absolute inset-0 bg-twisted-blue opacity-20 rotate-45 rounded"></div>
              <div className="absolute inset-0 border-2 border-white rotate-45 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-twisted-blue rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg tracking-tight text-white leading-none uppercase">
                TWISTED<span className="text-twisted-blue">STACKS</span>
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mt-1">Agentic Engineering</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest font-mono text-gray-400">
            <button
              onClick={toggleDesigner}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${designerActive ? 'bg-twisted-blue border-white/20 text-white' : 'border-white/10 hover:border-twisted-blue hover:text-twisted-blue'}`}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <Bot size={14} />}
              <span>{designerActive ? 'EXIT ARCHITECT' : 'INVOKE AGENT'}</span>
            </button>
            <a href="#products" className="hover:text-twisted-blue transition-colors">INFRASTRUCTURE</a>
            <button className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-twisted-blue/50 text-white rounded-full transition-all flex items-center gap-2">
              <Terminal size={14} />
              <span>TERMINAL</span>
            </button>
          </div>
        </div>
      </nav>

      <header
        className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 transition-all duration-500 ${selectedElements.includes('hero') ? 'bg-twisted-blue/5 animate-selected-pulse' : ''}`}
        onClick={() => handleElementSelect('hero')}
      >
        <HeroScene />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-twisted-dark/50 to-twisted-dark" />
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border border-twisted-blue/30 bg-twisted-blue/10 text-twisted-blue text-[10px] tracking-widest uppercase font-black rounded font-mono">
              <Activity size={12} className="animate-pulse" /> Core Engine Online
            </div>
            <h1 className="font-sans font-black text-5xl md:text-7xl lg:text-9xl tracking-tighter leading-none mb-6 text-white neon-text">
              AGENTIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-twisted-blue to-twisted-purple">STACKS</span>
            </h1>
            <p className="max-w-xl text-lg text-gray-400 font-light leading-relaxed mb-10 border-l-2 border-twisted-blue pl-8">
              Decentralized AI orchestration for senior engineering teams. We don't just build software; we build the entities that build software.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section id="products" className="py-32 relative bg-black/30">
          <div className="container mx-auto px-6">
            <div
              className={`text-center mb-24 transition-all ${selectedElements.includes('products-header') ? 'scale-105 animate-selected-pulse text-twisted-blue' : ''}`}
              onClick={() => handleElementSelect('products-header')}
            >
              <span className="text-twisted-blue font-mono text-xs tracking-widest uppercase font-bold">The Fleet Ecosystem</span>
              <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-6 tracking-tight">Core Modules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProductCard
                id="core-card"
                title="TwistedCore"
                description="Distributed AI Development Framework orchestrating multiple agents across our mesh network."
                icon={Cpu}
                tags={['Mesh-Net', 'Llama-3']}
                isSelected={selectedElements.includes('core-card')}
                onSelect={handleElementSelect}
              />
              <ProductCard
                id="command-card"
                title="Command"
                description="Web-based monitoring platform. Visual workflow builder and real-time agent metrics."
                icon={Activity}
                tags={['Real-Time', 'Flux']}
                color="purple"
                isSelected={selectedElements.includes('command-card')}
                onSelect={handleElementSelect}
              />
              <ProductCard
                id="dashboard-card"
                title="Observer"
                description="Native macOS SwiftUI application for system resource monitoring and terminal control."
                icon={Box}
                tags={['SwiftUI', 'Metal']}
                color="green"
                isSelected={selectedElements.includes('dashboard-card')}
                onSelect={handleElementSelect}
              />
              <ProductCard
                id="security-card"
                title="IronBox"
                description="Autonomous security scanning and vulnerability assessment with Kali Linux integration."
                icon={Shield}
                tags={['Ethical', 'SecOps']}
                color="red"
                isSelected={selectedElements.includes('security-card')}
                onSelect={handleElementSelect}
              />
            </div>
          </div>
        </section>

        <section
          id="stack"
          className={`py-32 bg-twisted-card border-y border-white/5 transition-colors ${selectedElements.includes('infra-section') ? 'bg-twisted-blue/5 animate-selected-pulse' : ''}`}
          onClick={() => handleElementSelect('infra-section')}
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-5">
                <span className="text-twisted-purple font-mono text-xs uppercase font-bold tracking-widest mb-4 block">Deployment Architecture</span>
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight">Decentralized Compute Nodes</h2>
                <InfrastructureDiagram />
              </div>
              <div className="lg:col-span-7">
                <AgentWorkflowDiagram />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black border-t border-white/5 py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400">
              <Share2 size={20} />
            </div>
          </div>
          <div className="text-gray-600 text-[10px] font-mono tracking-widest uppercase mb-4">Established 2025 • Secured by BMAD</div>
          <div className="text-gray-400 text-sm font-light uppercase tracking-tighter">Designed by TwistedStacks Neural Agents</div>
        </div>
      </footer>
    </div>
  );
};

export default App;