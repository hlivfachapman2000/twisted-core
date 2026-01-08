
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
// Added missing Bot and AlertTriangle icons
import { X, Sparkles, Wand2, Image as ImageIcon, Loader2, Code2, Palette, Info, CheckCircle2, Bot, AlertTriangle } from 'lucide-react';

interface DesignerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
}

const DESIGN_GUIDELINES = [
  "Maintain Glassmorphism: Blur 10px-20px, 1px border white/10.",
  "Neon Accents: Primary #3399ff, Secondary #a855f7.",
  "Typography: JetBrains Mono for data, Inter for UI.",
  "Motion: Use subtle float (6s) or slide-in transitions.",
  "Brand: Agentic, high-tech, precise, and decentralized."
];

export const DesignerPanel: React.FC<DesignerPanelProps> = ({ isOpen, onClose, selectedId }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<{role: 'agent' | 'user', text: string}[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleDesign = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const userMsg = prompt;
    setHistory(prev => [{role: 'user', text: userMsg}, ...prev]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Redesign Task for Component: "${selectedId}". 
        Request: "${userMsg}"
        Context: TwistedStacks Brand (Agentic Dev Team).
        Rules: 
        1. Stick to the neon-blue/dark-glass theme.
        2. Provide specific Tailwind classes.
        3. Explain the UX improvement.`,
        config: {
          systemInstruction: `You are the TwistedStacks Design Agent. 
          Your persona is elite, precise, and forward-thinking. 
          Refer to users as "Lead Developer". 
          Always structure your response with: 
          1. Architectural Assessment 
          2. Recommended Mutation (Code) 
          3. Behavioral Guardrails check.`,
        }
      });

      setHistory(prev => [{role: 'agent', text: response.text || "Simulation incomplete."}, ...prev]);
      setPrompt("");
    } catch (err) {
      console.error("Design failed", err);
      setHistory(prev => [{role: 'agent', text: "Error in context orchestration. Check API link."}, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAsset = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `TwistedStacks high-tech UI asset: ${prompt}. Aesthetic: Unreal Engine 5 render, holographic, blueprint style, neon blue glow, black matte background.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (err) {
      console.error("Asset generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-[450px] h-full z-[100] bg-twisted-dark border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right font-sans">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-twisted-blue to-twisted-purple flex items-center justify-center shadow-lg shadow-twisted-blue/20">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-black tracking-tight text-lg">DESIGN ARCHITECT</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-twisted-green animate-pulse"></span>
               <p className="text-[10px] text-twisted-blue font-mono uppercase tracking-widest">Neural Link Active</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all">
          <X size={24} />
        </button>
      </div>

      {/* Guidelines Accordion */}
      <div className="px-6 py-3 bg-black/40 border-b border-white/5">
        <details className="group">
          <summary className="list-none cursor-pointer flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest hover:text-twisted-blue">
            <span className="flex items-center gap-2"><Info size={12}/> Design Guidelines</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <ul className="mt-3 space-y-2 pb-2">
            {DESIGN_GUIDELINES.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-gray-400">
                <CheckCircle2 size={12} className="text-twisted-blue mt-0.5 flex-shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Target Indicator */}
      <div className="px-6 py-2 bg-twisted-blue/5 border-b border-twisted-blue/10 flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-500 uppercase">Selected Component</span>
        <span className="text-xs font-mono text-twisted-blue font-bold px-2 py-0.5 bg-twisted-blue/10 rounded border border-twisted-blue/20">
          {selectedId ? `#${selectedId}` : "--- NULL ---"}
        </span>
      </div>

      {/* Feed */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {generatedImage && (
          <div className="relative rounded-xl overflow-hidden border border-twisted-blue/30 group">
            <img src={generatedImage} alt="Generated Asset" className="w-full h-auto" />
            <button 
              onClick={() => setGeneratedImage(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Sparkles size={64} className="mb-6 text-twisted-blue" />
            <p className="text-sm font-mono uppercase tracking-widest">Awaiting Command...</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-6">
            {history.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[90%] p-4 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-twisted-blue/10 border border-twisted-blue/30 text-white font-medium' 
                  : 'bg-white/5 border border-white/10 text-gray-300 font-light'
                }`}>
                  <div className="flex items-center gap-2 text-[9px] uppercase font-mono mb-2 opacity-50">
                    {msg.role === 'user' ? 'Lead Dev Request' : 'Architect Response'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 bg-[#080808]">
        {!selectedId && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-[11px] text-red-400 flex items-center gap-2">
            <AlertTriangle size={14} />
            SELECT A UI ELEMENT TO BEGIN ARCHITECTING
          </div>
        )}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!selectedId}
            placeholder={selectedId ? "Propose a mutation..." : "Select component first..."}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-twisted-blue transition-all min-h-[120px] mb-4 text-gray-200 resize-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute bottom-6 right-3 text-[10px] font-mono text-gray-600">
            {prompt.length} chars
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleDesign}
            disabled={isGenerating || !selectedId || !prompt}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-twisted-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-twisted-darkBlue transition-all disabled:opacity-30 shadow-lg shadow-twisted-blue/10"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
            MORPH UI
          </button>
          <button
            onClick={generateAsset}
            disabled={isGenerating || !selectedId || !prompt}
            className="p-3.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-twisted-blue/30 transition-all disabled:opacity-30"
            title="Generate Visual Asset"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
