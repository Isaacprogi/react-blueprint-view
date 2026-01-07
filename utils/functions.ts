import type { RouteConfig } from "./type";

import React from "react";
export function devWarn(message: string) {
  if (import.meta.env.MODE === "development") {
    console.warn(message);
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

export function isLazyElement(
  node: React.ReactNode
): node is React.ReactElement {
  return (
    React.isValidElement(node) &&
    (node.type as any)?.$$typeof === Symbol.for("react.lazy")
  );
}

export function routesUseRoles(routes: RouteConfig[]): boolean {
  return routes.some((r) =>
    Boolean(
      (r.roles && r.roles.length > 0) ||
      (r.children && routesUseRoles(r.children))
    )
  );
}

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

export const getFullPath = ({ path, index }: { path: string | undefined, index: boolean | undefined }, parentPath = "") => {
  let fullPath = "";
  if (index) {
    fullPath = parentPath || "/";
  } else if (path) {
    fullPath = parentPath + (path.startsWith("/") ? path : "/" + path);
  } else {
    fullPath = parentPath || "/";
  }
  return normalize(fullPath)

};

