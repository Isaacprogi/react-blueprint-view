// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { 
//   FaRoute, 
//   FaClock, 
//   FaExclamationTriangle, 
//   FaInfoCircle, 
//   FaPlay,
//   FaSpinner,
//   FaHistory
// } from "react-icons/fa";

// interface RouteTiming {
//   path: string;
//   intendedPath?: string;
//   loadTime: number;
//   redirected: boolean;
//   timestamp: string;
//   metadata?: {
//     guard?: string;
//     reason?: string;
//     [key: string]: any;
//   };
// }

// interface RouteHealthPanelProps {
//   routes: string[];
//   timingRecords: RouteTiming[];
// }

// export const RouteHealthPanel: React.FC<RouteHealthPanelProps> = ({
//   routes,
//   timingRecords,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedRoute, setSelectedRoute] = useState<string>("");
//   const [isTesting, setIsTesting] = useState<boolean>(false);
//   const [showRecentOnly, setShowRecentOnly] = useState<boolean>(true);
  
//   console.log("RouteHealthPanel data:", { routes, timingRecords });

//   // Get latest test record for the selected route
//   const getLatestTestRecord = () => {
//     if (!selectedRoute) return null;
    
//     const filteredRecords = timingRecords.filter(record => 
//       record.intendedPath === selectedRoute || record.path === selectedRoute
//     );
    
//     if (filteredRecords.length === 0) return null;
    
//     // Sort by timestamp descending (newest first) and return the first one
//     return filteredRecords.sort((a, b) => 
//       new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     )[0];
//   };

//   const latestTestRecord = getLatestTestRecord();

//   // Filter to show only the latest test record when a route is selected
//   const displayRecords = selectedRoute && latestTestRecord 
//     ? [latestTestRecord] 
//     : timingRecords;

//   // Sort all records by timestamp (newest first)
//   const sortedRecords = [...displayRecords].sort((a, b) => 
//     new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//   );

//   const handleTestRoute = () => {
//     if (!selectedRoute) return;
    
//     setIsTesting(true);
//     navigate(selectedRoute);
    
//     // Reset testing state after navigation
//     setTimeout(() => setIsTesting(false), 1000);
//   };

//   const getLoadTimeClass = (time: number) => {
//     if (time < 100) return "text-[#4caf50]";
//     if (time < 500) return "text-[#ff9800]";
//     return "text-[#ef5350]";
//   };

//   const getLoadTimeBgClass = (time: number) => {
//     if (time < 100) return "bg-[#4caf50]/10";
//     if (time < 500) return "bg-[#ff9800]/10";
//     return "bg-[#ef5350]/10";
//   };

//   // Calculate average load time
//   const averageLoadTime = timingRecords.length > 0 
//     ? Math.round(timingRecords.reduce((acc, r) => acc + r.loadTime, 0) / timingRecords.length)
//     : 0;

//   return (
//     <div className="p-4 bg-[#1a1a1f] min-h-screen">
//       <div className="space-y-4">
//         {/* Route Selector and Test Button */}
//         <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <FaRoute className="w-5 h-5 text-[#64b5f6]" />
//               <h3 className="text-lg font-semibold text-[#e0e0e0]">Route Testing</h3>
//             </div>
            
//             <div className="flex items-center gap-2 text-sm text-[#888]">
//               <FaHistory className="w-4 h-4" />
//               <span>{timingRecords.length} records</span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="flex-1">
//               <select
//                 className="w-full bg-[#0f0f12] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e0e0e0] font-mono focus:outline-none focus:ring-1 focus:ring-[#64b5f6] focus:border-[#64b5f6]"
//                 value={selectedRoute}
//                 onChange={(e) => setSelectedRoute(e.target.value)}
//                 aria-label="Select a route to test"
//               >
//                 <option value="">-- Select a route to test --</option>
//                 {routes?.map((route) => (
//                   <option key={route} value={route} className="bg-[#1a1a1f] font-mono">
//                     {route || "/"}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <button
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleTestRoute}
//               disabled={isTesting || !selectedRoute}
//               aria-label={`Test route ${selectedRoute}`}
//             >
//               {isTesting ? (
//                 <>
//                   <FaSpinner className="w-4 h-4 animate-spin" />
//                   <span>Testing...</span>
//                 </>
//               ) : (
//                 <>
//                   <FaPlay className="w-3 h-3" />
//                   <span>Test Route</span>
//                 </>
//               )}
//             </button>
//           </div>
          
//           {isTesting && selectedRoute && (
//             <div className="mt-3 p-3 bg-[#2a2a35] border border-[#3a3a45] rounded">
//               <div className="flex items-center gap-3">
//                 <div className="w-4 h-4 border-2 border-[#64b5f6] border-t-transparent rounded-full animate-spin"></div>
//                 <div className="flex-1">
//                   <span className="text-sm text-[#e0e0e0]">Testing route:</span>
//                   <code className="ml-2 text-sm text-[#64b5f6] bg-[#64b5f6]/10 px-2 py-1 rounded font-mono">
//                     {selectedRoute}
//                   </code>
//                   <div className="text-xs text-[#888] mt-1">Simulating navigation...</div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* Show latest test result */}
//           {selectedRoute && latestTestRecord && !isTesting && (
//             <div className="mt-3 p-3 bg-[#0f0f12] border border-[#2a2a2a] rounded">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-[#e0e0e0]">Latest test result:</span>
//                 <span className="text-xs text-[#888]">
//                   {new Date(latestTestRecord.timestamp).toLocaleTimeString()}
//                 </span>
//               </div>
//               <div className="flex flex-wrap items-center gap-4">
//                 <div className="flex flex-col">
//                   <span className="text-xs text-[#a0a0a0]">Path</span>
//                   <code className="text-sm text-[#e0e0e0] font-mono">
//                     {latestTestRecord.path}
//                   </code>
//                 </div>
//                 {latestTestRecord.intendedPath && (
//                   <div className="flex flex-col">
//                     <span className="text-xs text-[#a0a0a0]">Intended</span>
//                     <code className="text-sm text-[#9c27b0] font-mono">
//                       {latestTestRecord.intendedPath}
//                     </code>
//                   </div>
//                 )}
//                 <div className="flex flex-col">
//                   <span className="text-xs text-[#a0a0a0]">Load Time</span>
//                   <span className={`text-sm font-mono ${getLoadTimeClass(latestTestRecord.loadTime)}`}>
//                     {latestTestRecord.loadTime} ms
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-xs text-[#a0a0a0]">Redirected</span>
//                   <span className={`text-sm ${latestTestRecord.redirected ? 'text-[#9c27b0]' : 'text-[#4caf50]'}`}>
//                     {latestTestRecord.redirected ? "Yes" : "No"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Timing Records Section */}
//         <div className="bg-[#1a1a1f] border border-[#2a2a2a] rounded p-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <FaClock className="w-5 h-5 text-[#ff9800]" />
//                 <h2 className="text-lg font-semibold text-[#e0e0e0]">
//                   {selectedRoute ? `Latest Test Result` : `Route Timing Records`}
//                 </h2>
//               </div>
//               <div className="px-2 py-1 bg-[#2a2a35] rounded text-sm text-[#a0a0a0]">
//                 {sortedRecords.length} of {timingRecords.length} records
//               </div>
//             </div>
            
//             {selectedRoute && (
//               <button 
//                 className="px-3 py-1 text-sm bg-[#2a2a35] text-[#a0a0a0] border border-[#2a2a2a] rounded hover:bg-[#3a3a45] hover:border-[#3a3a45] transition-colors"
//                 onClick={() => setSelectedRoute("")}
//               >
//                 Show All Routes
//               </button>
//             )}
//           </div>

//           {timingRecords.length === 0 ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded bg-[#0f0f12]">
//               <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
//               <p className="text-sm text-[#888]">No timing records yet. Navigate to routes to collect data.</p>
//             </div>
//           ) : (
//             <div className="">
//               {/* Performance Summary */}
//               {!selectedRoute && (
//                 <div className="flex gap-3 mb-4">
//                   <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-4">
//                     <div className="text-2xl font-bold text-[#e0e0e0] text-center">
//                       {averageLoadTime} ms
//                     </div>
//                     <div className="text-sm text-[#a0a0a0] text-center mt-1">Avg Load Time</div>
//                   </div>
//                   <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-4">
//                     <div className="text-2xl font-bold text-[#ff9800] text-center">
//                       {timingRecords.filter(r => r.loadTime > 500).length}
//                     </div>
//                     <div className="text-sm text-[#a0a0a0] text-center mt-1">Slow Routes</div>
//                   </div>
//                   <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-4">
//                     <div className="text-2xl font-bold text-[#9c27b0] text-center">
//                       {timingRecords.filter(r => r.redirected).length}
//                     </div>
//                     <div className="text-sm text-[#a0a0a0] text-center mt-1">Redirects</div>
//                   </div>
//                 </div>
//               )}

//               {/* Records List */}
//               <div className="space-y-3">
//                 {sortedRecords.map((record, index) => (
//                   <div 
//                     key={index} 
//                     className={`border rounded p-4 transition-colors ${
//                       record.redirected 
//                         ? 'border-[#9c27b0] bg-[#9c27b0]/5' 
//                         : record.loadTime > 500 
//                           ? 'border-[#ff9800] bg-[#ff9800]/5' 
//                           : 'border-[#2a2a2a] bg-[#0f0f12] hover:bg-[#1a1a1f]'
//                     }`}
//                   >
//                     <div className="flex gap-4 mb-3">
//                       <div className="space-y-2">
//                         <div className="flex flex-col">
//                           <span className="text-xs text-[#a0a0a0]">Path</span>
//                           <code className="text-sm text-[#e0e0e0] font-mono truncate">
//                             {record.path}
//                           </code>
//                         </div>
                        
//                         {record.intendedPath && (
//                           <div className="flex flex-col">
//                             <span className="text-xs text-[#a0a0a0]">Intended Path</span>
//                             <code className="text-sm text-[#9c27b0] font-mono truncate">
//                               {record.intendedPath}
//                             </code>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="space-y-2">
//                         <div className="flex flex-col">
//                           <span className="text-xs text-[#a0a0a0]">Load Time</span>
//                           <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono ${getLoadTimeBgClass(record.loadTime)} ${getLoadTimeClass(record.loadTime)}`}>
//                             {record.loadTime} ms
//                           </div>
//                         </div>
                        
//                         <div className="flex flex-col">
//                           <span className="text-xs text-[#a0a0a0]">Redirected</span>
//                           <span className={`text-sm ${record.redirected ? 'text-[#9c27b0]' : 'text-[#4caf50]'}`}>
//                             {record.redirected ? "Yes" : "No"}
//                           </span>
//                         </div>
//                       </div>
                      
//                       {(record.metadata?.guard || record.metadata?.reason) && (
//                         <div className="space-y-2">
//                           {record.metadata?.guard && (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-[#a0a0a0]">Guard</span>
//                               <span className="text-sm text-[#64b5f6]">{record.metadata.guard}</span>
//                             </div>
//                           )}
                          
//                           {record.metadata?.reason && (
//                             <div className="flex flex-col">
//                               <span className="text-xs text-[#a0a0a0]">Reason</span>
//                               <span className="text-sm text-[#ff9800]">{record.metadata.reason}</span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="pt-3 border-t border-[#2a2a2a] text-xs text-[#888]">
//                       {new Date(record.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {!selectedRoute && showRecentOnly && timingRecords.length > 5 && (
//                 <div className="text-center mt-4">
//                   <button 
//                     className="px-4 py-2 text-sm bg-[#2a2a35] text-[#a0a0a0] border border-[#2a2a2a] rounded hover:bg-[#3a3a45] hover:border-[#3a3a45] transition-colors"
//                     onClick={() => setShowRecentOnly(false)}
//                   >
//                     Show all {timingRecords.length} records
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RouteHealthPanel;

import React, { useState } from "react";
import SingleTest from "./SingleTest";
import MultipleTest from "./MultipleTest";
import { 
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import type { RouteTiming } from "../../../utils/type";

type TabType = 'single' | 'all';



interface RouteMountPanelProps {
  routes: string | unknown[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
}

const TabButtons: React.FC<{
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unauthCount: number;
  authCount: number;
}> = ({ activeTab, onTabChange, unauthCount, authCount }) => (
  <div className="w-full border-b border-[#2a2a2a]">
    <div className="w-full flex items-center gap-3 mx-auto max-w-[95%]">
      <button
        className={`flex items-center gap-2 px-4 pt-[1rem] pb-[1.2rem] text-sm font-medium border-b-2 transition-all ${
          activeTab === 'all' 
            ? 'border-[#4caf50] text-[#4caf50]' 
            : 'border-transparent text-[#888] hover:text-[#e0e0e0]'
        }`}
        onClick={() => onTabChange('single')}
      >
        <FaUserCheck className="w-4 h-4" />
        <span>Single</span>
        <span className={`px-2 rounded text-sm ${
          activeTab === 'all' 
            ? 'bg-[#4caf50]/20 text-[#4caf50]' 
            : 'bg-[#2a2a35] text-[#888]'
        }`}>
          {authCount}
        </span>
      </button>
      
      <button
        className={`flex items-center gap-2 px-4 pt-[1rem] pb-[1.2rem] text-sm font-medium border-b-2 transition-all ${
          activeTab === 'single' 
            ? 'border-[#ef5350] text-[#ef5350]' 
            : 'border-transparent text-[#888] hover:text-[#e0e0e0]'
        }`}
        onClick={() => onTabChange('all')}
      >
        <FaUser className="w-4 h-4" />
        <span>All</span>
        <span className={`px-2 rounded text-sm ${
          activeTab === 'single' 
            ? 'bg-[#ef5350]/20 text-[#ef5350]' 
            : 'bg-[#2a2a35] text-[#888]'
        }`}>
          {unauthCount}
        </span>
      </button>
    </div>
  </div>
);

export const RouteMountPanel: React.FC<RouteMountPanelProps> = ({
  routes,
  timingRecords,
  setTimingRecords
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  return (
    <div className="bg-[#1a1a1f] min-h-screen">
      <TabButtons
        activeTab={activeTab}
        authCount={1}
        unauthCount={Array.isArray(routes) ? routes.length : 0}
        onTabChange={(value) => setActiveTab(value)}
      />
      {activeTab === 'single' ? (
        <SingleTest
          timingRecords={timingRecords}
          routes={routes}
          setTimingRecords={setTimingRecords}
        />
      ) : (
        <MultipleTest routes={routes} timingRecords={timingRecords} setTimingRecords={setTimingRecords} />
      )}
    </div>
  );
};

export default RouteMountPanel;