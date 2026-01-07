// visualizer/RouteDetails.tsx
import React from "react";
import type { VisualRouteNode } from "../../utils/type";

export const RouteDetails: React.FC<{ node?: VisualRouteNode }> = ({
  node,
}) => {
  if (!node) {
    return <p>Select a route to inspect.</p>;
  }

  return (
    <pre
      style={{
        background: "#0f0f12",
        padding: 12,
        borderRadius: 6,
        overflow: "auto",
      }}
    >
{JSON.stringify(
  {
    fullPath: node.fullPath,
    type: node.type,
    roles: node.roles,
    inheritedRoles: node.inheritedRoles,
    redirectTo: node.redirectTo,
    lazy: node.lazy,
    childrenCount: node.children.length,
  },
  null,
  2
)}
    </pre>
  );
};
