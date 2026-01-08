/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Terminal, Globe, Lock, Cpu, ArrowRight, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

// --- INFRASTRUCTURE MAP ---
export const InfrastructureDiagram: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden rounded-xl">
      {/* Background Mesh */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-10 pointer-events-none">
         {[...Array(144)].map((_, i) => <div key={i} className="w-1 h-1 bg-blue-500 rounded-full"></div>)}
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-12 w-full max-w-4xl px-8">
        
        {/* COCKPIT */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
        >
            <div className="relative w-32 h-32 rounded-full border-2 border-twisted-blue bg-twisted-blue/10 flex items-center justify-center shadow-[0_0_30px_rgba(51,153,255,0.2)]">
                <Terminal size={48} className="text-twisted-blue" />
                <div className="absolute -top-2 px-2 py-1 bg-twisted-dark border border-twisted-blue text-xs text-twisted-blue font-mono rounded">Active</div>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white font-mono">COCKPIT</h3>
            <p className="text-center text-sm text-gray-400 mt-2">Interactive Work<br/>Orchestration</p>
        </motion.div>

        {/* FORGE */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
        >
             <div className="relative w-32 h-32 rounded-full border-2 border-twisted-purple bg-twisted-purple/10 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Cpu size={48} className="text-twisted-purple" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white font-mono">FORGE</h3>
            <p className="text-center text-sm text-gray-400 mt-2">Autonomous Build<br/>Execution</p>
        </motion.div>

        {/* ARCHIVE */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
        >
             <div className="relative w-32 h-32 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center">
                <Database size={48} className="text-gray-300" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white font-mono">ARCHIVE</h3>
            <p className="text-center text-sm text-gray-400 mt-2">Knowledge Base<br/>Vector Store</p>
        </motion.div>

      </div>

      {/* Connecting Lines */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
          <line x1="33%" y1="50%" x2="66%" y2="50%" stroke="#3399ff" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
      </svg>
      <div className="absolute bottom-8 flex gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-2"><Globe size={14}/> TAILSCALE MESH NETWORK</div>
          <div className="flex items-center gap-2"><Lock size={14}/> ENCRYPTED</div>
      </div>
    </div>
  );
};

// --- AGENT WORKFLOW ---
export const AgentWorkflowDiagram: React.FC = () => {
  return (
    <div className="flex flex-nowrap md:justify-center items-center gap-4 p-8 min-w-max">
        
        {/* Step 1 */}
        <div className="w-64 p-6 bg-twisted-card border border-white/10 rounded-xl relative group hover:border-twisted-blue/50 transition-colors">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-twisted-blue rounded-lg flex items-center justify-center font-bold text-white shadow-lg">1</div>
            <h4 className="text-lg font-bold text-white mb-2">OpenCode</h4>
            <p className="text-sm text-gray-400">Interactive planning & prototyping. Generates initial spec.</p>
        </div>

        <ArrowRight className="text-gray-600 flex-shrink-0" />

        {/* Step 2 */}
        <div className="w-64 p-6 bg-twisted-card border border-white/10 rounded-xl relative group hover:border-twisted-purple/50 transition-colors">
             <div className="absolute -top-3 -left-3 w-8 h-8 bg-twisted-purple rounded-lg flex items-center justify-center font-bold text-white shadow-lg">2</div>
            <h4 className="text-lg font-bold text-white mb-2">Rovodev</h4>
            <p className="text-sm text-gray-400">Deep context analysis (20M token pool). Generates detailed architecture.</p>
        </div>

         <ArrowRight className="text-gray-600 flex-shrink-0" />

        {/* Step 3 */}
        <div className="w-64 p-6 bg-twisted-card border border-white/10 rounded-xl relative group hover:border-twisted-green/50 transition-colors">
             <div className="absolute -top-3 -left-3 w-8 h-8 bg-twisted-green rounded-lg flex items-center justify-center font-bold text-white shadow-lg">3</div>
            <h4 className="text-lg font-bold text-white mb-2">Agent Zero</h4>
            <p className="text-sm text-gray-400">Autonomous execution in Docker containers on Forge machine.</p>
        </div>

         <ArrowRight className="text-gray-600 flex-shrink-0" />

        {/* Step 4 */}
        <div className="w-64 p-6 bg-twisted-card border border-white/10 rounded-xl relative group hover:border-twisted-red/50 transition-colors">
             <div className="absolute -top-3 -left-3 w-8 h-8 bg-twisted-red rounded-lg flex items-center justify-center font-bold text-white shadow-lg">4</div>
            <h4 className="text-lg font-bold text-white mb-2">Security Box</h4>
            <p className="text-sm text-gray-400">Vulnerability scanning and compliance check before merge.</p>
        </div>
    </div>
  );
};

// --- BMAD DIAGRAM ---
export const BmadDiagram: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/10">
                <div className="p-2 bg-twisted-blue/20 rounded text-twisted-blue"><FileText size={20}/></div>
                <div>
                    <div className="text-xs text-gray-400 uppercase font-mono">Input</div>
                    <div className="text-white font-bold">Context Engineering</div>
                </div>
            </div>
            
            <div className="flex justify-center"><div className="h-6 w-[1px] bg-white/20"></div></div>

            <div className="p-4 bg-twisted-dark border border-twisted-blue/30 rounded-lg shadow-[0_0_15px_rgba(51,153,255,0.1)]">
                <div className="text-center text-twisted-blue font-bold font-mono mb-4">BMAD CORE ENGINE</div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-black/40 rounded border border-white/5 text-center">
                        <ShieldCheck className="mx-auto text-green-500 mb-2" size={20}/>
                        <div className="text-xs text-gray-300">Guardrails</div>
                     </div>
                     <div className="p-3 bg-black/40 rounded border border-white/5 text-center">
                        <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={20}/>
                        <div className="text-xs text-gray-300">Safety Check</div>
                     </div>
                </div>
            </div>

            <div className="flex justify-center"><div className="h-6 w-[1px] bg-white/20"></div></div>

            <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/10">
                <div className="p-2 bg-twisted-purple/20 rounded text-twisted-purple"><Cpu size={20}/></div>
                <div>
                    <div className="text-xs text-gray-400 uppercase font-mono">Output</div>
                    <div className="text-white font-bold">Professional SysEng Agent</div>
                </div>
            </div>
        </div>
    )
}