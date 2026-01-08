// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   FaInfoCircle, 
//   FaPlay,
//   FaSpinner,
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

// interface SingleTestProps {
//   routes: string[] | unknown;
//   timingRecords: RouteTiming[];
//   setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[] | undefined>>;
// }

// export const SingleTest: React.FC<SingleTestProps> = ({
//   routes,
//   timingRecords,
//   setTimingRecords
// }) => {
//   const navigate = useNavigate()


//   const [selectedRoute, setSelectedRoute] = useState<string>('');
//   const [isTesting, setIsTesting] = useState<boolean>(false);

//   // Get latest test record for the selected route
//   const getLatestTestRecord = () => {
//     if (!selectedRoute) return null;
    
//     const filteredRecords = timingRecords.filter(record => 
//       record.intendedPath === selectedRoute 
//     );
    
//     if (filteredRecords.length === 0) return null;
    
//     // Sort by timestamp descending (newest first) and return the first one
//     return filteredRecords.sort((a, b) => 
//       new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     )[0];
//   };

//   const latestTestRecord = getLatestTestRecord();

//   // Filter to show only the latest test record when a route is selected
//   const displayRecords =  latestTestRecord 
//     ? [latestTestRecord] 
//     : [];

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

//   return (
//     <div className="bg-[#1a1a1f] min-h-screen">
//       <div className="space-y-4">
//         {/* Route Selector and Test Button */}
//         <div className="bg-[#1a1a1f] border-b border-[#2a2a2a]">
//           <div className="flex w-full py-3 max-w-[95%] mx-auto items-center gap-3">
//             <div className="flex-1">
//               <select
//                 className="w-full bg-[#0f0f12] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e0e0e0] font-mono focus:outline-none focus:ring-1 focus:ring-[#64b5f6] focus:border-[#64b5f6]"
//                 value={selectedRoute}
//                 onChange={(e) => {
//                   setTimingRecords([...timingRecords]);
//                   setSelectedRoute(e.target.value);
//                 }}
//                 aria-label="Select a route to test"
//               >
//                 <option value="">Select a route to test</option>
//                 {Array.isArray(routes) && routes.map((route) => (
//                   <option
//                     key={route}
//                     value={route}
//                     className="bg-[#1a1a1f] w-full flex items-center justify-between font-mono"
//                   >
//                     {route || "/"}
//                     <span>
//                       {Array.isArray(timingRecords) &&
//                       timingRecords.filter((record) => record.intendedPath === route).length !== 0
//                         ? "✔️"
//                         : ""}
//                     </span>
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
//             <div className="mt-3 p-3 w-full max-w-[95%] mx-auto mb-2 bg-[#2a2a35] border border-[#3a3a45] rounded">
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
//         </div>

//         {/* Timing Records Section */}
//         <div className="bg-[#1a1a1f] rounded p-4">
//           {timingRecords.length === 0 ? (
//             <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded bg-[#0f0f12]">
//               <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
//               <p className="text-sm text-[#888]">No timing records yet. Navigate to routes to collect data.</p>
//             </div>
//           ) : (
//             <div className="">
//               {/* Records List */}
//               <div className="space-y-3">
//                 {sortedRecords.map((record, index) => (
//                   <div 
//                     key={index} 
//                     className={`border rounded p-4 transition-colors ${
//                       record.redirected 
//                         ? 'border-[#9c27b0] bg-[#2a2a35]' 
//                         : record.loadTime > 500 
//                           ? 'border-[#ff9800] hover:bg-[#3a3a45] hover:border-[#4a4a55]' 
//                           : 'border-[#2a2a2a] bg-[#2a2a35] hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0'
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
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleTest;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaInfoCircle, 
} from "react-icons/fa";
import { RouteSelector } from "../RoutesSelector";
import type { RouteTiming } from "../../../utils/type";

interface SingleTestProps {
  routes: string[] | unknown;
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  testingMode?: boolean;
  toggleTestingMode?: () => void;
}

export const SingleTest: React.FC<SingleTestProps> = ({
  routes,
  timingRecords,
  // testingMode,
  // toggleTestingMode
}) => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Get latest test record for the selected route
  const getLatestTestRecord = () => {
    if (!selectedRoute) return null;
    
    const filteredRecords = timingRecords.filter(record => 
      record.intendedPath === selectedRoute 
    );
    
    if (filteredRecords.length === 0) return null;
    
    // Sort by timestamp descending (newest first) and return the first one
    return filteredRecords.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  const latestTestRecord = getLatestTestRecord();

  // Filter to show only the latest test record when a route is selected
  const displayRecords =  latestTestRecord 
    ? [latestTestRecord] 
    : [];

  // Sort all records by timestamp (newest first)
  const sortedRecords = [...displayRecords].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleTestRoute = () => {
    if (!selectedRoute) return;
    
    setIsTesting(true);
    navigate(selectedRoute);
    
    // Reset testing state after navigation
    setTimeout(() => setIsTesting(false), 1000);
  };

  const getLoadTimeClass = (time: number) => {
    if (time < 100) return "text-[#4caf50]";
    if (time < 500) return "text-[#ff9800]";
    return "text-[#ef5350]";
  };

  const getLoadTimeBgClass = (time: number) => {
    if (time < 100) return "bg-[#4caf50]/10";
    if (time < 500) return "bg-[#ff9800]/10";
    return "bg-[#ef5350]/10";
  };

  return (
    <div className="bg-[#1a1a1f] min-h-screen">
      <div className="space-y-4">
        {/* Route Selector Component */}
        <RouteSelector
          routes={Array.isArray(routes) ? routes : []}
          selectedRoute={selectedRoute}
          onRouteChange={(route) => {
            setSelectedRoute(route);
          }}
          onTestRoute={handleTestRoute}
          isTesting={isTesting}
          timingRecords={timingRecords}
        />

        {/* Timing Records Section */}
        <div className="bg-[#1a1a1f] rounded p-4">
          {timingRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded bg-[#0f0f12]">
              <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
              <p className="text-sm text-[#888]">No timing records yet. Navigate to routes to collect data.</p>
            </div>
          ) : (
            <div className="">
              {/* Records List */}
              <div className="space-y-3">
                {!isTesting && sortedRecords.map((record, index) => (
                  <div 
                    key={index} 
                    className={`border rounded p-4 transition-colors ${
                      record.redirected 
                        ? 'border-[#9c27b0] bg-[#2a2a35]' 
                        : record.loadTime > 500 
                          ? 'border-[#ff9800] hover:bg-[#3a3a45] hover:border-[#4a4a55]' 
                          : 'border-[#2a2a2a] bg-[#2a2a35] hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  > 
                    <div className="flex gap-4 mb-3">
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#a0a0a0]">Path</span>
                          <code className="text-sm text-[#e0e0e0] font-mono truncate">
                            {record.path}
                          </code>
                        </div>
                        
                        {record.intendedPath && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#a0a0a0]">Intended Path</span>
                            <code className="text-sm text-[#9c27b0] font-mono truncate">
                              {record.intendedPath}
                            </code>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#a0a0a0]">Load Time</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono ${getLoadTimeBgClass(record.loadTime)} ${getLoadTimeClass(record.loadTime)}`}>
                            {record.loadTime} ms
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-xs text-[#a0a0a0]">Redirected</span>
                          <span className={`text-sm ${record.redirected ? 'text-[#9c27b0]' : 'text-[#4caf50]'}`}>
                            {record.redirected ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                      
                      {(record.metadata?.guard || record.metadata?.reason) && (
                        <div className="space-y-2">
                          {record.metadata?.guard && (
                            <div className="flex flex-col">
                              <span className="text-xs text-[#a0a0a0]">Guard</span>
                              <span className="text-sm text-[#64b5f6]">{record.metadata.guard}</span>
                            </div>
                          )}
                          
                          {record.metadata?.reason && (
                            <div className="flex flex-col">
                              <span className="text-xs text-[#a0a0a0]">Reason</span>
                              <span className="text-sm text-[#ff9800]">{record.metadata.reason}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-[#2a2a2a] text-xs text-[#888]">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};