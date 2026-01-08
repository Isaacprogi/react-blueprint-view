// visualizer/RouteEditor.tsx
import React from "react";
import type { VisualRouteNode } from "../../utils/type";

type Props = {
  node: VisualRouteNode;
};

export const RouteEditor: React.FC<Props> = ({ node }) => {
  const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 pb-5 border-b border-[#2a2a2a] last:border-0 last:mb-0">
      <h4 className="m-0 mb-4 text-white text-sm uppercase tracking-wider font-semibold">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#1a1a1f]">
      
      <div className="px-6 py-5 border-b border-[#2a2a2a] bg-[#25252d]">
        <h3 className="m-0 mb-1 text-white text-lg flex items-center justify-between">
          {node.index ? 'Index Route' : node.path || 'Root'}
          <span className="text-xs text-[#888] font-normal ml-2">Route Details</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <PropertySection title="Basic Information">
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Path:</label>
            <span className="text-white text-sm break-words flex-1">{node.path || '-'}</span>
          </div>
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Full Path:</label>
            <span className="text-white text-sm break-words flex-1">{node.fullPath}</span>
          </div>
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Type:</label>
            <span className="text-white text-sm break-words flex-1">{node.type}</span>
          </div>
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Index Route:</label>
            <span className="text-white text-sm break-words flex-1">{node.index ? 'Yes' : 'No'}</span>
          </div>
        </PropertySection>

        <PropertySection title="Access Control">
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Route Roles:</label>
            <span className="text-white text-sm break-words flex-1">
              {node.roles.length > 0 ? node.roles.join(', ') : 'None'}
            </span>
          </div>
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Allowed Roles:</label>
            <span className="text-white text-sm break-words flex-1">
              {node.inheritedRoles.length > 0 ? node.inheritedRoles.join(', ') : 'None'}
            </span>
          </div>
        </PropertySection>

        <PropertySection title="Behavior">
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Lazy Loaded:</label>
            <span className="text-white text-sm break-words flex-1">{node.lazy ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Redirect To:</label>
            <span className="text-white text-sm break-words flex-1">{node.redirectTo?.pathname || 'None'}</span>
          </div>
        </PropertySection>

        <PropertySection title="Children">
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Children Count:</label>
            <span className="text-white text-sm break-words flex-1">{node.children.length}</span>
          </div>
          {node.children.length > 0 && (
            <div className="mt-3">
              <h5 className="m-0 mb-2 text-[#a0a0a0] text-xs font-semibold">Child Routes:</h5>
              <ul className="p-0 m-0 list-none">
                {node.children.map(child => (
                  <li key={child.id} className="flex justify-between items-center px-2 py-1.5 bg-[#2a2a35] rounded mb-1 last:mb-0">
                    <span className="font-mono text-xs text-white">{child.path || '(index)'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      child.type === 'private' 
                        ? 'bg-[rgba(239,83,80,0.2)] text-[#ef5350]' 
                        : child.type === 'public' 
                        ? 'bg-[rgba(76,175,80,0.2)] text-[#4caf50]' 
                        : 'bg-[rgba(158,158,158,0.2)] text-[#9e9e9e]'
                    }`}>
                      {child.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </PropertySection>

        <PropertySection title="Metadata">
          <div className="flex items-start mb-3 text-sm">
            <label className="w-36 text-[#a0a0a0] font-medium flex-shrink-0 pt-0.5">Node ID:</label>
            <span className="font-mono text-xs text-white break-words flex-1">{node.id}</span>
          </div>
        </PropertySection>
      </div>
    </div>
  );
};