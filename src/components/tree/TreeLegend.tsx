import React from 'react';

export const TreeLegend: React.FC = () => {
  return (
    <div className="px-5 py-4 border-t border-[#2a2a2a] bg-[#1a1a1f]">
      <div className="flex w-full max-w-[95%] mx-auto flex-wrap gap-3 items-center shrink-0">
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-4 h-4 rounded bg-[#4caf50] border border-white/10"></div>
          <span>Public Route</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-4 h-4 rounded bg-[#ef5350] border border-white/10"></div>
          <span>Private Route</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-4 h-4 rounded bg-[#9e9e9e] border border-white/10"></div>
          <span>Neutral Route</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-6 h-6 bg-[#3a3a45] flex items-center justify-center text-xs rounded-md border border-white/10 text-[#ffc107]">
            ⚡
          </div>
          <span>Lazy Loaded</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-6 h-6 bg-[#3a3a45] flex items-center justify-center text-xs rounded-md border border-white/10 text-[#9c27b0]">
            ↪
          </div>
          <span>Redirect</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-6 h-6 bg-[#64b5f6] rounded-full flex items-center justify-center text-xs text-white font-semibold border border-[#64b5f6]/30">
            #
          </div>
          <span>Children Count</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45] hover:bg-[#3a3a45] hover:border-[#4a4a55] transition-colors">
          <div className="w-6 h-6 bg-[#3a3a45] flex items-center justify-center text-lg font-bold rounded-md border border-white/10 text-white">
            +
          </div>
          <span>Expand/Collapse</span>
        </div>
      </div>
    </div>
  );
};