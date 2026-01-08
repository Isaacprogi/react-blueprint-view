import React from "react";
import { FaRoute } from "react-icons/fa";
import type { RouteTiming } from "../../utils/type";

interface RouteSelectorProps {
  routes: string[] | unknown[];
  selectedRoute: string;
  onRouteChange: (route: string) => void;
  onTestRoute: () => void;
  isTesting: boolean;
  timingRecords: Array<RouteTiming>;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({ 
  routes, 
  selectedRoute, 
  onRouteChange, 
  onTestRoute, 
  isTesting,
  timingRecords 
}) => {
  // Safely convert routes to string array
  const getStringRoutes = (): string[] => {
    if (!Array.isArray(routes)) return [];
    
    return routes.filter((route): route is string => {
      return typeof route === 'string' || typeof route === 'number';
    }).map(route => String(route));
  };

  const stringRoutes = getStringRoutes();

  // Check if a route has been tested
  const hasBeenTested = (route: string) => {
    return Array.isArray(timingRecords) && 
           timingRecords.some(record => record.intendedPath === route);
  };

  return (
    <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#e0e0e0] flex items-center gap-2">
          <FaRoute className="w-4 h-4 text-[#64b5f6]" />
         
        </h3>
        <span className="text-xs text-[#888] bg-[#2a2a35] px-2 py-1 rounded">
          {stringRoutes.length} routes
        </span>
      </div>
      
      <div className="flex gap-2">
        <select
          className="flex-1 bg-[#202025] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e0e0e0] font-mono focus:outline-none focus:border-[#64b5f6] focus:ring-1 focus:ring-[#64b5f6]"
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
        >
          <option value="" className="bg-[#1a1a1f]">All Routes</option>
          {stringRoutes.map((route) => {
            const tested = hasBeenTested(route);
            const displayText = tested ? `${route || "/"} ✓` : (route || "/");
            return (
              <option 
                key={route} 
                value={route} 
                className={`bg-[#1a1a1f] font-mono ${tested ? 'text-green-400' : 'text-[#e0e0e0]'}`}
                title={tested ? "This route has been tested" : ""}
              >
                {displayText}
              </option>
            );
          })}
        </select>
        
        <button
          className="px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] text-[#e0e0e0] rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onTestRoute}
          disabled={isTesting || !selectedRoute}
        >
          {isTesting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Testing...</span>
            </>
          ) : (
            <>
              <span>Test Route</span>
            </>
          )}
        </button>
      </div>

      {/* Show tested routes summary below the selector */}
      {stringRoutes.length > 0 && (
        <div className="mt-3 text-xs text-[#888] flex items-center gap-2">
          <span>Tested routes:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {stringRoutes
              .filter(route => hasBeenTested(route))
              .map((route) => (
                <code 
                  key={route} 
                  className="text-green-400 font-mono bg-[#2a2a35] px-1.5 py-0.5 rounded border border-green-400/20"
                  title="Tested"
                >
                  {route || "/"}
                </code>
              ))}
            {stringRoutes.filter(route => hasBeenTested(route)).length === 0 && (
              <span className="text-[#666] italic">None yet</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};