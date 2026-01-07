import React, { useState } from 'react';
import IssuesCard from './IssuesCard';

const IssuesPanel: React.FC = () => {
  const [issues, setIssues] = useState<string[]>([
    "Route '/dashboard' failed to load - 404 Not Found",
    "Authentication guard timed out after 5000ms",
    "API endpoint '/api/users' returned 500 Internal Server Error",
    "Component 'UserProfile' has missing dependency injection",
    "Memory leak detected in 'useEffect' hook",
    "Route redirection loop detected between '/login' and '/dashboard'"
  ]);

  const handleIssueClick = (issue: string, index: number) => {
    console.log(`Clicked issue ${index + 1}:`, issue);
    // You can implement navigation, modal opening, or other actions here
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IssuesCard
          issues={issues}
          title="Errors"
          type="error"
          onIssueClick={handleIssueClick}
        />
      </div>
    </div>
  );
};

export default IssuesPanel;