// visualizer/buildRouteGraph.ts
import { isLazyElement } from "../../utils/functions";
import type { RouteConfig } from "../../utils/type";
import type { VisualRouteNode } from "../../utils/type";

export function buildRouteGraph(
  routes: RouteConfig[],
  parentPath = "",
  parentRoles: string[] = [],
  inheritedType: "private" | "public" | "neutral" = "public"
): VisualRouteNode[] {
  return routes.map((route) => {
    const fullPath = route.index
      ? parentPath || "/"
      : `${parentPath}/${route.path ?? ""}`.replace(/\/+/g, "/");

    const inheritedRoles =
      route.excludeParentRole
        ? route.roles ?? []
        : [...new Set([...parentRoles, ...(route.roles ?? [])])];

    return {
      id: crypto.randomUUID(),
      path: route.path,
      index: route.index,
      fullPath,
      type: route.type ?? inheritedType,
      roles: route.roles ?? [],
      inheritedRoles,
      redirectTo: route.redirectTo,
      lazy: isLazyElement(route.element),
      children: route.children
        ? buildRouteGraph(
            route.children,
            fullPath,
            inheritedRoles,
            route.type ?? inheritedType
          )
        : [],
    };
  });
}
