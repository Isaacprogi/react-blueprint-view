import React, { useEffect } from "react";
import { SingleTest } from "./SingleTest";
import type { RouteTiming } from "../../../utils/type";

interface RouteMountPanelProps {
  routes: string | unknown[];
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
  testingMode: boolean;
  toggleTestingMode: () => void;
}

export const RouteMountPanel: React.FC<RouteMountPanelProps> = ({
  routes,
  timingRecords,
  setTimingRecords,
  testingMode,
  toggleTestingMode
}) => {

 useEffect(()=>{
    console.log('ehkllo',testingMode)
 },[testingMode])

 const handleTest =() => {
  console.log(testingMode)
  toggleTestingMode()
 }

  return (
    <div className="bg-[#1a1a1f] min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#e0e0e0]">
          Route Performance Testing
        </h1>
        
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] text-[#e0e0e0] rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          {testingMode ? (
            <>
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6 14.586l9.293-9.293a1 1 0 011.414 0z" 
                  clipRule="evenodd"
                />
              </svg>
              Disable Testing Mode
            </>
          ) : (
            <>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Enable Testing Mode
            </>
          )}
        </button>
      </div>

      {testingMode ? (
        <SingleTest
          timingRecords={timingRecords}
          routes={routes}
          setTimingRecords={setTimingRecords}
          testingMode={testingMode}
          toggleTestingMode={toggleTestingMode}
        />
      ) : (
        <div className="bg-[#2a2a35] border border-[#3a3a45] rounded-xl p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1a1a1f] border border-[#3a3a45] flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-[#e0e0e0]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-[#e0e0e0]">
              Testing Mode is Disabled
            </h2>
            <p className="text-[#a0a0a0] max-w-md">
              Enable testing mode to render the component and start performance testing.
              This prevents accidental test runs and saves resources.
            </p>
            <button
              onClick={toggleTestingMode}
              className="mt-4 px-6 py-3 bg-purple-600 border border-blue-700 text-white rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-blue-700 hover:border-blue-800 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Enable Testing Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMountPanel;