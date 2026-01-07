import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaInfoCircle, 
  FaPlay,
  FaSpinner,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

import type { RouteTiming } from "../../../utils/type";

interface MultipleTestProps {
  routes: string[] | unknown;
  timingRecords: RouteTiming[];
  setTimingRecords: React.Dispatch<React.SetStateAction<RouteTiming[]>>;
}

type SortField = 'timestamp' | 'loadTime' | 'path' | 'intendedPath';
type SortDirection = 'asc' | 'desc';

export const MultipleTest: React.FC<MultipleTestProps> = ({
  routes,
  timingRecords,
  setTimingRecords
}) => {
  const navigate = useNavigate();
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filter, setFilter] = useState<string>('all'); // 'all', 'success', 'redirected', 'slow'

  // Group records by route
  const groupedByRoute: Record<string, RouteTiming[]> = {};
  
  timingRecords.forEach(record => {
    const route = record.intendedPath || record.path;
    if (!groupedByRoute[route]) {
      groupedByRoute[route] = [];
    }
    groupedByRoute[route].push(record);
  });

  // Get latest test for each route
  const latestTests = Object.keys(groupedByRoute).map(route => {
    const tests = groupedByRoute[route];
    return tests.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  });

  // Apply filter
  const filteredTests = latestTests.filter(test => {
    if (filter === 'all') return true;
    if (filter === 'success') return !test.redirected && test.loadTime <= 500;
    if (filter === 'redirected') return test.redirected;
    if (filter === 'slow') return test.loadTime > 500 && !test.redirected;
    return true;
  });

  // Apply sorting
  const sortedTests = [...filteredTests].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'timestamp') {
      aValue = new Date(a.timestamp).getTime();
      bValue = new Date(b.timestamp).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleTestAllRoutes = () => {
    if (!Array.isArray(routes) || routes.length === 0) return;
    
    setIsTestingAll(true);
    
    // Test each route sequentially with a delay
    routes.forEach((route, index) => {
      setTimeout(() => {
        navigate(route);
        // Update timing records after navigation
        setTimeout(() => {
          setTimingRecords(prev => {
            if (!prev) return prev;
            const newRecord: RouteTiming = {
              path: window.location.pathname,
              intendedPath: route,
              loadTime: Math.random() * 1000, // Simulated load time
              redirected: false, // This should come from actual navigation
              timestamp: new Date().toISOString(),
            };
            return [...prev, newRecord];
          });
        }, 100);
      }, index * 2000); // 2 second delay between tests
    });
    
    // Reset testing state after all tests
    setTimeout(() => setIsTestingAll(false), routes.length * 2000 + 1000);
  };

  const handleTestSingleRoute = (route: string) => {
    navigate(route);
    
    // Add a test record
    setTimeout(() => {
      setTimingRecords(prev => {
        if (!prev) return prev;
        const newRecord: RouteTiming = {
          path: window.location.pathname,
          intendedPath: route,
          loadTime: Math.random() * 1000, // Simulated load time
          redirected: false, // This should come from actual navigation
          timestamp: new Date().toISOString(),
        };
        return [...prev, newRecord];
      });
    }, 100);
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

  const getTestStatus = (test: RouteTiming) => {
    if (test.redirected) return { label: 'Redirected', color: 'bg-[#9c27b0]/20', text: 'text-[#9c27b0]', icon: FaExclamationTriangle };
    if (test.loadTime > 500) return { label: 'Slow', color: 'bg-[#ff9800]/20', text: 'text-[#ff9800]', icon: FaExclamationTriangle };
    return { label: 'Success', color: 'bg-[#4caf50]/20', text: 'text-[#4caf50]', icon: FaCheckCircle };
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Calculate statistics
  const totalRoutes = Array.isArray(routes) ? routes.length : 0;
  const testedRoutes = latestTests.length;
  const successTests = latestTests.filter(t => !t.redirected && t.loadTime <= 500).length;
  const redirectedTests = latestTests.filter(t => t.redirected).length;
  const slowTests = latestTests.filter(t => t.loadTime > 500 && !t.redirected).length;
  const averageLoadTime = latestTests.length > 0 
    ? Math.round(latestTests.reduce((acc, t) => acc + t.loadTime, 0) / latestTests.length)
    : 0;

  return (
    <div className="bg-[#1a1a1f] min-h-screen">
      <div className="space-y-4">
        {/* Header with Test All Button and Statistics */}
        <div className="bg-[#1a1a1f] border-b border-[#2a2a2a]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full py-3 max-w-[95%] mx-auto">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#e0e0e0]">Multiple Route Tests</h3>
              <p className="text-sm text-[#888]">View and test all routes at once</p>
            </div>
            
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleTestAllRoutes}
              disabled={isTestingAll || !Array.isArray(routes) || routes.length === 0}
              aria-label="Test all routes"
            >
              {isTestingAll ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Testing All Routes...</span>
                </>
              ) : (
                <>
                  <FaPlay className="w-3 h-3" />
                  <span>Test All Routes</span>
                </>
              )}
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-[95%] mx-auto pb-4">
            <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-3">
              <div className="text-2xl font-bold text-[#e0e0e0] text-center">
                {totalRoutes}
              </div>
              <div className="text-xs text-[#a0a0a0] text-center mt-1">Total Routes</div>
            </div>
            <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-3">
              <div className="text-2xl font-bold text-[#4caf50] text-center">
                {testedRoutes}
              </div>
              <div className="text-xs text-[#a0a0a0] text-center mt-1">Tested</div>
            </div>
            <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-3">
              <div className="text-2xl font-bold text-[#4caf50] text-center">
                {successTests}
              </div>
              <div className="text-xs text-[#a0a0a0] text-center mt-1">Success</div>
            </div>
            <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-3">
              <div className="text-2xl font-bold text-[#ff9800] text-center">
                {slowTests}
              </div>
              <div className="text-xs text-[#a0a0a0] text-center mt-1">Slow</div>
            </div>
            <div className="bg-[#0f0f12] border border-[#2a2a2a] rounded p-3">
              <div className="text-2xl font-bold text-[#9c27b0] text-center">
                {redirectedTests}
              </div>
              <div className="text-xs text-[#a0a0a0] text-center mt-1">Redirected</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1a1a1f] border-b border-[#2a2a2a]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full py-3 max-w-[95%] mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                <FaFilter className="w-4 h-4" />
                <span>Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'success', 'slow', 'redirected'].map((filterType) => (
                  <button
                    key={filterType}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filter === filterType
                        ? filterType === 'success'
                          ? 'bg-[#4caf50]/20 text-[#4caf50] border border-[#4caf50]/40'
                          : filterType === 'slow'
                          ? 'bg-[#ff9800]/20 text-[#ff9800] border border-[#ff9800]/40'
                          : filterType === 'redirected'
                          ? 'bg-[#9c27b0]/20 text-[#9c27b0] border border-[#9c27b0]/40'
                          : 'bg-[#64b5f6]/20 text-[#64b5f6] border border-[#64b5f6]/40'
                        : 'bg-[#2a2a35] text-[#888] border border-[#2a2a2a] hover:border-[#3a3a45]'
                    }`}
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                <FaSortAmountDown className="w-4 h-4" />
                <span>Sort:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { field: 'timestamp', label: 'Time' },
                  { field: 'loadTime', label: 'Load Time' },
                  { field: 'intendedPath', label: 'Route' }
                ].map((sortOption) => (
                  <button
                    key={sortOption.field}
                    className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${
                      sortField === sortOption.field
                        ? 'bg-[#64b5f6]/20 text-[#64b5f6] border border-[#64b5f6]/40'
                        : 'bg-[#2a2a35] text-[#888] border border-[#2a2a2a] hover:border-[#3a3a45]'
                    }`}
                    onClick={() => handleSort(sortOption.field as SortField)}
                  >
                    {sortOption.label}
                    {sortField === sortOption.field && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="w-3 h-3" /> : <FaSortAmountDown className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-[#1a1a1f] rounded p-4">
          {sortedTests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border border-[#2a2a2a] rounded bg-[#0f0f12]">
              <FaInfoCircle className="w-8 h-8 text-[#888] mb-3" />
              <p className="text-sm text-[#888]">
                {timingRecords.length === 0 
                  ? "No test results yet. Run tests to see results."
                  : "No tests match the current filter."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTests.map((test, index) => {
                const status = getTestStatus(test);
                const StatusIcon = status.icon;
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded p-4 transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                      test.redirected 
                        ? 'border-[#9c27b0] bg-[#2a2a35] hover:bg-[#3a3a45] hover:border-[#9c27b0]/60' 
                        : test.loadTime > 500 
                          ? 'border-[#ff9800] bg-[#2a2a35] hover:bg-[#3a3a45] hover:border-[#ff9800]/60' 
                          : 'border-[#2a2a2a] bg-[#2a2a35] hover:bg-[#3a3a45] hover:border-[#4a4a55]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#a0a0a0]">Route</span>
                          <code className="text-sm text-[#e0e0e0] font-mono truncate">
                            {test.intendedPath || test.path}
                          </code>
                        </div>
                        
                        {test.path !== test.intendedPath && (
                          <div className="flex flex-col">
                            <span className="text-xs text-[#a0a0a0]">Actual Path</span>
                            <code className="text-sm text-[#9c27b0] font-mono truncate">
                              {test.path}
                            </code>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-[#a0a0a0]">Load Time</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-mono ${getLoadTimeBgClass(test.loadTime)} ${getLoadTimeClass(test.loadTime)}`}>
                            {test.loadTime} ms
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${status.color} ${status.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="text-xs font-medium">{status.label}</span>
                        </div>
                        
                        <button
                          className="px-3 py-1 text-xs bg-[#2a2a35] border border-[#2a2a2a] text-[#a0a0a0] rounded hover:bg-[#3a3a45] hover:border-[#3a3a45] transition-colors"
                          onClick={() => handleTestSingleRoute(test.intendedPath || test.path)}
                          disabled={isTestingAll}
                        >
                          Test Again
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-[#2a2a2a] text-xs text-[#888]">
                      <div>
                        Tested: {new Date(test.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-4 mt-1 md:mt-0">
                        {test.metadata?.guard && (
                          <span className="text-[#64b5f6]">Guard: {test.metadata.guard}</span>
                        )}
                        {test.metadata?.reason && (
                          <span className="text-[#ff9800]">Reason: {test.metadata.reason}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Routes that haven't been tested */}
          {Array.isArray(routes) && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-[#a0a0a0] mb-3">Untested Routes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {routes
                  .filter(route => !latestTests.some(test => 
                    (test.intendedPath || test.path) === route
                  ))
                  .map((route, index) => (
                    <div 
                      key={index}
                      className="border border-[#2a2a2a] bg-[#0f0f12] rounded p-3 hover:bg-[#1a1a1f] hover:border-[#3a3a45] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-[#e0e0e0] font-mono truncate">
                          {route || "/"}
                        </code>
                        <button
                          className="px-2 py-1 text-xs bg-[#2a2a35] border border-[#2a2a2a] text-[#a0a0a0] rounded hover:bg-[#3a3a45] hover:border-[#3a3a45] transition-colors"
                          onClick={() => handleTestSingleRoute(route)}
                          disabled={isTestingAll}
                        >
                          Test
                        </button>
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

export default MultipleTest;