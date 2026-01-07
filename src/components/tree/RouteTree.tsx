import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { VisualRouteNode } from "../../../utils/type";
import { TreeLegend } from "./TreeLegend";

type TreeProps = {
  routes: VisualRouteNode[];
  selectedNodeId?: string;
  onSelect: (node: VisualRouteNode) => void;
};

export const RouteTree: React.FC<TreeProps> = ({
  routes,
  selectedNodeId,
  onSelect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const allNodeIds = new Set<string>();
    const collectIds = (nodes: VisualRouteNode[]) => {
      nodes.forEach((node) => {
        allNodeIds.add(node.id);
        if (node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    collectIds(routes);
    return allNodeIds;
  });

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        setDimensions({
          width: Math.max(Math.floor(width), 1000),
          height: Math.max(Math.floor(height), 800),
        });
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  // Convert route node to D3 hierarchy format
  const convertToD3Node = (
    node: VisualRouteNode,
    parent?: any,
    depth: number = 0
  ): any => {
    const isExpanded = expandedNodes.has(node.id);
    return {
      id: node.id,
      data: node,
      depth,
      children:
        isExpanded && node.children.length > 0
          ? node.children.map((child) =>
              convertToD3Node(child, node, depth + 1)
            )
          : [],
      _children:
        node.children.length > 0
          ? node.children.map((child) =>
              convertToD3Node(child, node, depth + 1)
            )
          : [],
      parent,
    };
  };

  // Main D3 rendering effect - KEEP THIS AS IS (D3 needs inline styles)
  useEffect(() => {
    if (!svgRef.current || routes.length === 0) return;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // KEY TO SPACING: Use nodeSize instead of size() → guarantees minimum space
    const tree = d3
      .tree<any>()
      .nodeSize([300, 220]) // [horizontal spacing, vertical spacing between levels]
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.3));

    // Convert routes to D3 nodes
    const rootNodes = routes.map((route) => convertToD3Node(route));

    // Virtual root for multiple top-level routes
    const rootData =
      rootNodes.length === 1
        ? d3.hierarchy(rootNodes[0])
        : d3.hierarchy({
            id: "virtual-root",
            data: { type: "virtual" },
            children: rootNodes,
          });

    const root = tree(rootData);

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setTransform(event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Main group (will hold transform)
    const g = svg.append("g").attr("transform", transform.toString());

    // Grid background
    const defs = svg.append("defs");
    const gridPattern = defs
      .append("pattern")
      .attr("id", "grid-pattern")
      .attr("width", 40)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse");

    gridPattern
      .append("rect")
      .attr("width", 40)
      .attr("height", 40)
      .attr("fill", "#1a1a1f");

    gridPattern
      .append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "#2a2a2a")
      .attr("stroke-width", 1);

    svg
      .insert("rect", ":first-child")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid-pattern)");

    // ADD RK BOX AT THE TOP CENTER
    const rkBoxX = 0;
    const rkBoxY = 60;
    const rkBoxWidth = 180;
    const rkBoxHeight = 70;

    const rkBox = g
      .append("g")
      .attr("class", "rk-box")
      .attr("transform", `translate(${rkBoxX}, ${rkBoxY})`);

    // RK Box background
    rkBox
      .append("rect")
      .attr("x", -rkBoxWidth / 2)
      .attr("y", -rkBoxHeight / 2)
      .attr("width", rkBoxWidth)
      .attr("height", rkBoxHeight)
      .attr("rx", 12)
      .attr("ry", 12)
      .attr("fill", "#0d1117")
      .attr("stroke", "#30363d")
      .attr("stroke-width", 2);

    // RK Box left indicator bar
    rkBox
      .append("rect")
      .attr("x", -rkBoxWidth / 2)
      .attr("y", -rkBoxHeight / 2)
      .attr("width", 8)
      .attr("height", rkBoxHeight)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "#58a6ff");

    // RK Box text
    rkBox
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "22px")
      .attr("font-weight", "bold")
      .attr("font-family", "'Segoe UI', 'Roboto', sans-serif")
      .text("RK");

    // ADD APP BOX ON THE LEFT
    const appBoxX = -400;
    const appBoxY = 60;
    const appBoxWidth = 200;
    const appBoxHeight = 70;

    const appBox = g
      .append("g")
      .attr("class", "app-box")
      .attr("transform", `translate(${appBoxX}, ${appBoxY})`);

    // App Box background
    appBox
      .append("rect")
      .attr("x", -appBoxWidth / 2)
      .attr("y", -appBoxHeight / 2)
      .attr("width", appBoxWidth)
      .attr("height", appBoxHeight)
      .attr("rx", 12)
      .attr("ry", 12)
      .attr("fill", "#0d1117")
      .attr("stroke", "#30363d")
      .attr("stroke-width", 2);

    // App Box left indicator bar
    appBox
      .append("rect")
      .attr("x", -appBoxWidth / 2)
      .attr("y", -appBoxHeight / 2)
      .attr("width", 8)
      .attr("height", appBoxHeight)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "#58a6ff");

    // App Box text
    appBox
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "20px")
      .attr("font-weight", "600")
      .attr("font-family", "'Segoe UI', 'Roboto', sans-serif")
      .text("App");

    // LINE FROM RK BOX TO APP BOX
    const appRightX = appBoxX + appBoxWidth / 2;
    const appYCenter = appBoxY;
    const rkLeftX = rkBoxX - rkBoxWidth / 2;
    const rkYCenter = rkBoxY;

    // Draw straight line
    const line = g
      .append("path")
      .attr("class", "rk-app-line")
      .attr("d", `M ${appRightX} ${appYCenter} L ${rkLeftX} ${rkYCenter}`)
      .attr("fill", "none")
      .attr("stroke", "#58a6ff")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "6,4")
      .attr("stroke-opacity", 0.8)
      .attr("marker-end", "url(#arrowhead)");

    // Add arrowhead at the end
    const marker = defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto");

    marker.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#58a6ff");

    line.attr("marker-end", "url(#arrowhead)");

    // Links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical<
            d3.HierarchyPointLink<any>,
            d3.HierarchyPointNode<any>
          >()
          .x((d) => d.x)
          .y((d) => d.y + 120)
      )

      .attr("fill", "none")
      .attr("stroke", (d: any) => {
        const type = d.target.data.data?.type || "neutral";
        return type === "public"
          ? "#4caf50"
          : type === "private"
          ? "#ef5350"
          : "#9e9e9e";
      })
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", (d: any) =>
        d.target.data.data?.type === "virtual" ? "6,4" : "none"
      );

    // Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y + 120})`)
      .style("cursor", (d: any) =>
        d.data.data?.type === "virtual" ? "default" : "pointer"
      )
      .on("click", (event, d: any) => {
        event.stopPropagation();
        if (d.data.data?.type !== "virtual") {
          onSelect(d.data.data);
        }
      });

    const nodeWidth = 220;
    const nodeHeight = 90;

    // Background rectangle
    node
      .append("rect")
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 12)
      .attr("ry", 12)
      .attr("fill", (d: any) => {
        if (d.data.data?.type === "virtual") return "transparent";
        const isSelected = d.data.id === selectedNodeId;
        if (isSelected) return "#2a2a35";
        const type = d.data.data?.type || "neutral";
        return type === "public"
          ? "#1f3b2a"
          : type === "private"
          ? "#3b1f1f"
          : "#2a2a2a";
      })
      .attr("stroke", (d: any) => {
        if (d.data.data?.type === "virtual") return "transparent";
        const isSelected = d.data.id === selectedNodeId;
        if (isSelected) return "#64b5f6";
        const type = d.data.data?.type || "neutral";
        return type === "public"
          ? "#4caf50"
          : type === "private"
          ? "#ef5350"
          : "#9e9e9e";
      })
      .attr("stroke-width", (d: any) => (d.data.id === selectedNodeId ? 3 : 2));

    // Left type indicator bar
    node
      .filter((d: any) => d.data.data?.type !== "virtual")
      .append("rect")
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("width", 8)
      .attr("height", nodeHeight)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", (d: any) => {
        const type = d.data.data?.type || "neutral";
        return type === "public"
          ? "#4caf50"
          : type === "private"
          ? "#ef5350"
          : "#9e9e9e";
      });

    // Content group
    const contentGroup = node
      .filter((d: any) => d.data.data?.type !== "virtual")
      .append("g")
      .attr("transform", `translate(0, 0)`);

    // Route name / path
    contentGroup
      .append("text")
      .attr("class", "node-name")
      .attr("x", 0)
      .attr("y", -nodeHeight / 2 + 24)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "15px")
      .attr("font-weight", "600")
      .text((d: any) => {
        const label = d.data.data?.index ? "Index" : d.data.data?.path || "/";
        return label.length > 18 ? label.substring(0, 18) + "..." : label;
      });

    // Full path
    contentGroup
      .append("text")
      .attr("class", "node-path")
      .attr("x", 0)
      .attr("y", -nodeHeight / 2 + 44)
      .attr("text-anchor", "middle");

    // Route info at bottom
    const routeInfo = contentGroup
      .append("g")
      .attr("transform", `translate(0, ${nodeHeight / 2 - 16})`);

    routeInfo
      .append("text")
      .attr("fill", "#a0a0a0")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("text-anchor", "middle")
      .text((d: any) => {
        const info = [];
        if (d.data.data?.lazy) info.push("⚡ Lazy");
        if (d.data.data?.redirectTo?.pathname) info.push("↪ Redirect");
        if (d.data.data?.dynamic) info.push("🔄 Dynamic");
        if (d.data.data?.layout) info.push("📐 Layout");
        return info.join(" • ");
      });

    // Children count badge (top right)
    node
      .filter((d: any) => d.data.children?.length > 0)
      .append("circle")
      .attr("cx", nodeWidth / 2 - 14)
      .attr("cy", -nodeHeight / 2 + 14)
      .attr("r", 16)
      .attr("fill", "#64b5f6");

    node
      .filter((d: any) => d.data.children?.length > 0)
      .append("text")
      .attr("x", nodeWidth / 2 - 14)
      .attr("y", -nodeHeight / 2 + 18)
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.children?.length || 0);

    // Expand/collapse button (below node)
    node
      .filter((d: any) => d.data._children?.length > 0)
      .append("g")
      .attr("class", "expand-btn")
      .attr("transform", `translate(0, ${nodeHeight / 2 + 30})`)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        event.stopPropagation();
        const newSet = new Set(expandedNodes);
        if (newSet.has(d.data.id)) {
          newSet.delete(d.data.id);
        } else {
          newSet.add(d.data.id);
        }
        setExpandedNodes(newSet);
      });

    node
      .selectAll(".expand-btn")
      .append("circle")
      .attr("r", 18)
      .attr("fill", "#3a3a45")
      .attr("stroke", "#4a4a55")
      .attr("stroke-width", 2);

    node
      .selectAll(".expand-btn")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "#ffffff")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text((d: any) => (expandedNodes.has(d.data.id) ? "−" : "+"));

    // Auto-center on first render
    const bounds = g.node()?.getBBox();
    if (bounds && transform.k === 1 && transform.x === 0 && transform.y === 0) {
      const scale = Math.min(
        1,
        (width - 200) / bounds.width,
        (height - 200) / bounds.height
      );
      const x = (width - bounds.width * scale) / 2 - bounds.x * scale;
      const y = (height - bounds.height * scale) / 2 - (bounds.y + 400) * scale;

      svg.call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
      setTransform(d3.zoomIdentity.translate(x, y).scale(scale));
    }
  }, [routes, selectedNodeId, dimensions, expandedNodes, onSelect, transform]);

  // Zoom controls
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const handleResetView = () => {
    if (!svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>("g");
    const gNode = g.node();

    if (!gNode) return;

    const bounds = gNode.getBBox();

    let newTransform = d3.zoomIdentity;
    if (bounds) {
      const scale = Math.min(
        1,
        (dimensions.width - 200) / bounds.width,
        (dimensions.height - 200) / bounds.height
      );
      const x =
        (dimensions.width - bounds.width * scale) / 2 - bounds.x * scale;
      const y =
        100 +
        (dimensions.height - bounds.height * scale) / 2 -
        bounds.y * scale;
      newTransform = d3.zoomIdentity.translate(x, y).scale(scale);
    }

    svg
      .transition()
      .duration(600)
      .call(zoomRef.current.transform, newTransform);

    setTransform(newTransform);
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const collect = (nodes: VisualRouteNode[]) => {
      nodes.forEach((n) => {
        allIds.add(n.id);
        collect(n.children);
      });
    };
    collect(routes);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleToggleExpandCollapse = () => {
    if (isExpanded) {
      handleCollapseAll();
    } else {
      handleExpandAll();
    }
    setIsExpanded(!isExpanded);
  };

  const totalNodeCount = routes.reduce((sum, root) => {
    const count = (node: VisualRouteNode): number =>
      1 + node.children.reduce((s, c) => s + count(c), 0);
    return sum + count(root);
  }, 0);

  return (
    <div className="h-full flex flex-col bg-[#0f0f12] overflow-hidden">
      {/* Controls section */}
      <div className="border-b py-3 bg-[#1a1a1f] border-[#2a2a2a]">
        <div className="px-5 w-full max-w-[95%] mx-auto flex justify-between items-center shrink-0">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleToggleExpandCollapse}
              className="px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] text-[#e0e0e0] rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
            >
              {isExpanded ? "Collapse All" : "Expand All"}
            </button>
            <button
              onClick={handleResetView}
              className="px-4 py-2 bg-[#2a2a35] border border-[#3a3a45] text-[#e0e0e0] rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 hover:bg-[#3a3a45] hover:border-[#4a4a55] hover:-translate-y-0.5 active:translate-y-0"
            >
              Reset View
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-[#2a2a35] rounded-lg px-2 py-1 border border-[#3a3a45]">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center bg-[#3a3a45] text-white rounded-md cursor-pointer text-lg font-bold transition-all duration-200 hover:bg-[#4a4a55] hover:scale-110 active:scale-95"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="text-sm text-[#a0a0a0] font-medium min-w-[45px] text-center">
              {Math.round(transform.k * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center bg-[#3a3a45] text-white rounded-md cursor-pointer text-lg font-bold transition-all duration-200 hover:bg-[#4a4a55] hover:scale-110 active:scale-95"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-sm text-[#888] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45]">
                <span className="text-base">🌳</span>
                {routes.length} root{routes.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-[#888] px-3 py-2 bg-[#2a2a35] rounded-lg border border-[#3a3a45]">
                <span className="text-base">📊</span>
                {totalNodeCount} nodes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-[#1a1a1f] relative"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block w-full h-full"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#3a3a45 #1a1a1f",
          }}
        />

        {/* Custom CSS for D3 elements */}
        <style>{`
      /* Node rectangle styles */
      .node rect {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
      }
      
      .node rect:hover {
        filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
        stroke-width: 3 !important;
      }
      
      /* Selected node animation */
      rect[stroke='#64b5f6'] {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% {
          stroke-width: 3;
        }
        50% {
          stroke-width: 4;
        }
      }
      
      /* Link hover effect */
      .link:hover {
        stroke-width: 3 !important;
        stroke-opacity: 1 !important;
      }
      
      /* Expand button hover effect */
      .expand-btn circle {
        transition: all 0.2s;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }
      
      .expand-btn:hover circle {
        fill: #4a4a55 !important;
        stroke: #5a5a65 !important;
      }
      
      .expand-btn text {
        transition: transform 0.2s;
      }
      
      .expand-btn:hover text {
        transform: scale(1.2);
      }
      
      /* Children badge hover effect */
      circle[fill='#64b5f6'] {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        transition: transform 0.2s;
      }
      
      circle[fill='#64b5f6']:hover {
        transform: scale(1.1);
      }
      
      /* Node text styling */
      .node-name {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: -0.3px;
      }
      
      .node-path {
        opacity: 0.8;
        font-size: 12px;
        fill: #a0a0a0;
      }
      
      /* Container scrollbar */
      .tree-canvas::-webkit-scrollbar {
        width: 8px;
      }
      
      .tree-canvas::-webkit-scrollbar-track {
        background: #1a1a1f;
      }
      
      .tree-canvas::-webkit-scrollbar-thumb {
        background: #3a3a45;
        border-radius: 4px;
      }
      
      .tree-canvas::-webkit-scrollbar-thumb:hover {
        background: #4a4a55;
      }
    `}</style>
      </div>
      
      <TreeLegend />
    </div>
  );
};
