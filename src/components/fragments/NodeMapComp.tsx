// PeopleGraph.tsx
import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import type {
  ForceGraphMethods,
  NodeObject,
  LinkObject,
} from "react-force-graph-2d";
import ActionContext from "../../context/ActionContext";
import useWindowSize from "../../helper/useWindowClick";

export type GraphNode = {
  id: string;
  name: string;
  img: string;
  group: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
};

export type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
};

type Props = {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode) => void;
  muteConnections?: boolean;
  showArrayConnections?: boolean;
  showOnlyForNames?: string[];
};

export type PeopleGraphHandle = {
  focusOnNode: (searchValue: string) => GraphNode[] | null;
};

const PeopleGraph = forwardRef<PeopleGraphHandle, Props>(
  (
    {
      nodes,
      links,
      onNodeClick,
      //   onNodeHover,
      muteConnections = false,
      showArrayConnections = false,
      showOnlyForNames = [],
    },
    ref
  ) => {
    const fgRef = useRef<
      | ForceGraphMethods<
          NodeObject<GraphNode>,
          LinkObject<GraphNode, GraphLink>
        >
      | undefined
    >(undefined);
    const actionCtx = useContext(ActionContext);
    const fgContainerRef = useRef<HTMLDivElement>(null);
    const [animatedStyles, setAnimatedStyles] = useState<{
      nodeRadii: Record<string, number>;
      nodeOpacities: Record<string, number>;
      linkOpacities: Record<string, number>;
    }>({
      nodeRadii: {},
      nodeOpacities: {},
      linkOpacities: {},
    });

    const [focusedNodeIds, setFocusedNodeIds] = useState<string[]>([]);
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
    const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
    const [noMatchMessage, setNoMatchMessage] = useState<string | null>(null);
    const [highlightNodes, setHighlightNodes] = useState<Set<string>>(
      new Set()
    );
    const [highlightLinks, setHighlightLinks] = useState<Set<string>>(
      new Set()
    );
    // const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // const lastHoveredNodeIdRef = useRef<string | null>(null);
    // const hasTriggeredRef = useRef<boolean>(false);
    const [searchedNode, setSearchedNode] = useState<GraphNode | null>(null);
    const [searchedConnectedNodeNames, setSearchedConnectedNodeNames] =
      useState<string[]>([]);
    const [hoveredConnectedNodeNames, setHoveredConnectedNodeNames] = useState<
      string[]
    >([]);
    const { width } = useWindowSize();
    const size = useWindowSize();
    const minZoom = 0.5;
    const nodeSize = Number(size?.width) > 700 ? 25 : 30;
    const defaultLinkColor = "#b4c4ec";
    const animateValue = (
      _p0: string, //   key: string,
      from: number,
      to: number,
      duration: number,
      updater: (val: number) => void
    ) => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = from + (to - from) * progress;
        updater(eased);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    useImperativeHandle(ref, () => ({
      focusOnNode: (searchValue: string) => {
        const fg = fgRef.current;
        const container = fgContainerRef.current;
        if (!fg || !container) return null;

        const normalizedSearch = searchValue.trim().toLowerCase();
        if (!normalizedSearch) {
          // Reset chart to default
          setFocusedNodeIds([]);
          setNoMatchMessage(null);
          setSearchedNode(null);
          setSearchedConnectedNodeNames([]);
          nodes.forEach((n) => {
            delete n.fx;
            delete n.fy;
          });
          fg.zoom(Math.max(1, minZoom), 1000);
          fg.centerAt(0, 0, 1000);
          fg.d3ReheatSimulation();
          return null;
        }

        // Match if ANY word fragment matches any part of the node name
        const searchTerms = normalizedSearch.split(" ");
        const matchedNodes = nodes.filter((n) => {
          const name = n.name.toLowerCase();
          return searchTerms.some((term) => name.includes(term));
        });

        if (matchedNodes.length === 0) {
          // No match: reset
          setNoMatchMessage(`No peer found for "${searchValue}"`);
          setFocusedNodeIds([]);
          setSearchedNode(null);
          setSearchedConnectedNodeNames([]);
          nodes.forEach((n) => {
            delete n.fx;
            delete n.fy;
          });
          fg.zoom(Math.max(1, minZoom), 1000);
          fg.centerAt(0, 0, 1000);
          fg.d3ReheatSimulation();
          return null;
        }
        if (matchedNodes.length > 0) {
          setNoMatchMessage(null);
        }

        const firstNode = matchedNodes[0];
        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;

        // Reset node positions
        nodes.forEach((n) => {
          delete n.fx;
          delete n.fy;
        });

        // Center searched node
        firstNode.fx = centerX;
        firstNode.fy = centerY;
        firstNode.x = centerX;
        firstNode.y = centerY;

        // Find connected node IDs
        const connectedIds = new Set<string>();
        links.forEach((link) => {
          const sourceId =
            typeof link.source === "string" ? link.source : link.source.id;
          const targetId =
            typeof link.target === "string" ? link.target : link.target.id;

          if (sourceId === firstNode.id) connectedIds.add(targetId);
          else if (targetId === firstNode.id) connectedIds.add(sourceId);
        });

        const connectedNodes = nodes.filter((n) => connectedIds.has(n.id));

        // Distribute connected nodes around the searched node in a circle
        const radius = 200;
        const angleStep = (2 * Math.PI) / connectedNodes.length;
        connectedNodes.forEach((node, i) => {
          const angle = i * angleStep;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          node.fx = x;
          node.fy = y;
          node.x = x;
          node.y = y;
        });

        // Update UI state
        setFocusedNodeIds(matchedNodes.map((n) => n.id));
        setSearchedNode(firstNode);
        setSearchedConnectedNodeNames(connectedNodes.map((n) => n.name));

        // Animate zoom and pan
        fg.centerAt(centerX, centerY, 1000);
        fg.zoom(Math.max(2, minZoom), 1000);
        fg.d3ReheatSimulation();

        return matchedNodes;
      },
    }));

    const filterList = (list?: string[], param?: string): string[] => {
      if (Array.isArray(list)) {
        return list.filter((ch) => ch !== param);
      }
      return [];
    };

    const resetGraphToDefault = () => {
      const fg = fgRef.current;
      if (!fg) return;

      // Unfix all nodes
      nodes.forEach((n) => {
        delete n.fx;
        delete n.fy;
      });

      setNoMatchMessage(null);
      setFocusedNodeIds([]);
      setSearchedNode(null);
      setSearchedConnectedNodeNames([]);
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());

      fg.zoom(Math.max(1, minZoom), 1000);
      fg.centerAt(0, 0, 1000);
      fg.d3ReheatSimulation();
      actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([]);
    };
    const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);
    const imageCache = useMemo(() => {
      const cache: Record<string, HTMLImageElement> = {};
      nodes.forEach((node) => {
        if (!cache[node.id]) {
          const img = new Image();
          img.src = node.img;
          cache[node.id] = img;
        }
      });
      return cache;
    }, [nodes]);
    const getLinkColor = useCallback(
      (link: LinkObject<GraphNode, GraphLink>) => {
        if (muteConnections) return "rgba(0,0,0,0)";

        const source =
          typeof link.source === "string"
            ? nodes.find((n) => n.id === link.source)
            : link.source;
        const target =
          typeof link.target === "string"
            ? nodes.find((n) => n.id === link.target)
            : link.target;

        const sourceName = source?.name?.toLowerCase() ?? "";
        const targetName = target?.name?.toLowerCase() ?? "";
        const sourceId = source?.id ?? "";
        const targetId = target?.id ?? "";
        const key = `${sourceId}-${targetId}`;

        if (showArrayConnections) {
          const isInList = showOnlyForNames.some((name) =>
            [sourceName, targetName].some((n) => n.includes(name.toLowerCase()))
          );
          if (!isInList) return "rgba(0,0,0,0)";
        }

        return highlightLinks.size === 0 || highlightLinks.has(key)
          ? defaultLinkColor
          : "rgba(160,160,160,0.3)";
      },
      [
        muteConnections,
        showArrayConnections,
        showOnlyForNames,
        nodes,
        highlightLinks,
      ]
    );

    const getLinkWidth = useCallback(
      (link: LinkObject<GraphNode, GraphLink>) => {
        if (muteConnections) return 0;

        const source =
          typeof link.source === "string"
            ? nodes.find((n) => n.id === link.source)
            : link.source;
        const target =
          typeof link.target === "string"
            ? nodes.find((n) => n.id === link.target)
            : link.target;

        const sourceName = source?.name?.toLowerCase() ?? "";
        const targetName = target?.name?.toLowerCase() ?? "";
        const sourceId = source?.id ?? "";
        const targetId = target?.id ?? "";
        const key = `${sourceId}-${targetId}`;

        if (showArrayConnections) {
          const isInList = showOnlyForNames.some((name) =>
            [sourceName, targetName].some((n) => n.includes(name.toLowerCase()))
          );
          if (!isInList) return 0;
        }

        return highlightLinks.has(key) ? 2 : 1;
      },
      [
        muteConnections,
        showArrayConnections,
        showOnlyForNames,
        nodes,
        highlightLinks,
      ]
    );

    const renderPointerPaint = useCallback(
      (
        node: NodeObject<GraphNode>,
        color: string,
        ctx: CanvasRenderingContext2D
      ) => {
        const isFocused = focusedNodeIds.includes(node.id);
        const isHighlighted = highlightNodes.has(node.id);
        const r = isFocused
          ? nodeSize * 1.8
          : isHighlighted
          ? nodeSize * 1.4
          : nodeSize * 0.8;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, r + 2, 0, 2 * Math.PI);
        ctx.fill();
      },
      [focusedNodeIds, highlightNodes]
    );

    useEffect(() => {
      const fg = fgRef.current;
      if (!fg || !width) return;

      // Dynamically calculate link distance
      const baseDistance = 130;
      const minDistance = 40;
      const responsiveDistance = Math.max(
        minDistance,
        baseDistance * (width / 1920)
      );

      fg.d3Force("charge")?.strength(-180);
      fg.d3Force("link")?.distance(responsiveDistance);
    }, [width]);

    useEffect(() => {
      nodes.forEach((n) => {
        const isFocused = focusedNodeIds.includes(n.id);
        const isHighlighted =
          highlightNodes.size === 0 || highlightNodes.has(n.id);

        const targetRadius = isFocused
          ? nodeSize * 1.8
          : highlightNodes.has(n.id)
          ? nodeSize * 1.4
          : nodeSize * 0.8;

        const targetOpacity = isHighlighted ? 1 : 0.1;

        animateValue(
          `r-${n.id}`,
          animatedStyles.nodeRadii[n.id] ?? nodeSize,
          targetRadius,
          300,
          (val) =>
            setAnimatedStyles((prev) => ({
              ...prev,
              nodeRadii: { ...prev.nodeRadii, [n.id]: val },
            }))
        );

        animateValue(
          `op-${n.id}`,
          animatedStyles.nodeOpacities[n.id] ?? 1,
          targetOpacity,
          300,
          (val) =>
            setAnimatedStyles((prev) => ({
              ...prev,
              nodeOpacities: { ...prev.nodeOpacities, [n.id]: val },
            }))
        );
      });

      links.forEach((link) => {
        const sourceId =
          typeof link.source === "string" ? link.source : link.source.id;
        const targetId =
          typeof link.target === "string" ? link.target : link.target.id;
        const key = `${sourceId}-${targetId}`;

        const shouldShow = highlightLinks.size === 0 || highlightLinks.has(key);

        const targetOpacity = shouldShow ? 1 : 0.05;

        animateValue(
          `link-${key}`,
          animatedStyles.linkOpacities[key] ?? 1,
          targetOpacity,
          300,
          (val) =>
            setAnimatedStyles((prev) => ({
              ...prev,
              linkOpacities: { ...prev.linkOpacities, [key]: val },
            }))
        );
      });
    }, [highlightNodes, highlightLinks, focusedNodeIds]);

    useEffect(() => {
      if (!showArrayConnections || !showOnlyForNames.length) return;

      const fg = fgRef.current;
      if (!fg) return;

      const matchingNodes = nodes.filter((n) =>
        showOnlyForNames.includes(n.name)
      );

      if (matchingNodes.length === 0) return;

      // Compute average center
      const avgX =
        matchingNodes.reduce((sum, n) => sum + (n.x || 0), 0) /
        matchingNodes.length;
      const avgY =
        matchingNodes.reduce((sum, n) => sum + (n.y || 0), 0) /
        matchingNodes.length;

      fg.centerAt(avgX, avgY, 1000);
      fg.zoom(2, 1000);
    }, [showArrayConnections, showOnlyForNames, nodes]);

    useEffect(() => {
      const fg = fgRef.current;
      const container = fgContainerRef.current;
      if (!fg || !container) return;

      if (showArrayConnections) {
        // Already handled in other useEffect
        return;
      }

      // Reset when turned OFF
      nodes.forEach((n) => {
        delete n.fx;
        delete n.fy;
      });

      setFocusedNodeIds([]);
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());

      fg.zoom(Math.max(1, minZoom), 1000);
      fg.centerAt(0, 0, 1000);
      fg.d3ReheatSimulation();
    }, [showArrayConnections]);

    useEffect(() => {
      const fg = fgRef.current;
      if (!fg) return;
      fg.d3Force("charge")?.strength(-180);
      fg.d3Force("link")?.distance(130);

      const container = fgContainerRef.current;
      if (!container) return;
      const canvas = container.querySelector("canvas");
      if (!canvas) return;

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const currentZoom = fg.zoom();
        const zoomAmount = event.deltaY * -0.0015;
        let newZoom = currentZoom + zoomAmount;
        newZoom = Math.min(Math.max(newZoom, minZoom), 5);
        fg.zoom(newZoom);
        fg.d3ReheatSimulation();
        return false;
      };

      fg.zoom(Math.max(1, minZoom));
      canvas.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        canvas.removeEventListener("wheel", handleWheel);
      };
    }, []);

    return (
      <div
        // ref={manageRef}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
      >
        <div
          ref={fgContainerRef}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          <ForceGraph2D
            nodePointerAreaPaint={renderPointerPaint}
            onBackgroundClick={resetGraphToDefault}
            ref={fgRef}
            graphData={graphData}
            backgroundColor="#ffffff"
            linkColor={getLinkColor}
            linkWidth={getLinkWidth}
            cooldownTicks={120}
            // minZoom={0.1}
            // maxZoom={3}
            // enableZoomInteraction={false}
            nodeCanvasObject={(node, ctx) => {
              const n = node as NodeObject<GraphNode>;
              const img = imageCache[n.id]; // use cached image

              const r = animatedStyles.nodeRadii[n.id] ?? nodeSize;
              const opacity = animatedStyles.nodeOpacities[n.id] ?? 1;

              const { x = 0, y = 0 } = n;

              ctx.globalAlpha = opacity;

              // Draw outer stroke circle
              ctx.beginPath();
              ctx.arc(x, y, r, 0, 2 * Math.PI);
              ctx.lineWidth = 3;
              ctx.strokeStyle = n.group;
              ctx.stroke();
              ctx.closePath();

              // Draw clipped circular image (only if image is loaded and ready)
              if (img && img.complete && img.naturalWidth > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, r - 2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(
                  img,
                  x - (r - 2),
                  y - (r - 2),
                  (r - 2) * 2,
                  (r - 2) * 2
                );
                ctx.restore();
              }

              ctx.globalAlpha = 1;
            }}
            enableNodeDrag={false}
            onNodeHover={(node) => {
              const n = node as GraphNode | null;
              setHoveredNode(n);
              setHoveredLink(null);

              if (!n) {
                setHighlightNodes(new Set());
                setHighlightLinks(new Set());
                setHoveredConnectedNodeNames([]);
                return;
              }

              const connectedNodes = new Set<string>();
              const connectedLinks = new Set<string>();

              links.forEach((link) => {
                const sourceId =
                  typeof link.source === "string"
                    ? link.source
                    : link.source.id;
                const targetId =
                  typeof link.target === "string"
                    ? link.target
                    : link.target.id;

                if (sourceId === n.id) {
                  connectedNodes.add(targetId);
                  connectedLinks.add(`${sourceId}-${targetId}`);
                } else if (targetId === n.id) {
                  connectedNodes.add(sourceId);
                  connectedLinks.add(`${sourceId}-${targetId}`);
                }
              });

              connectedNodes.add(n.id);
              setHighlightNodes(connectedNodes);
              setHighlightLinks(connectedLinks);

              const names = nodes
                .filter((node) => connectedNodes.has(node.id))
                .map((n) => n.name);
              setHoveredConnectedNodeNames(names);
              //   if (n.id !== lastHoveredNodeIdRef.current) {
              //     lastHoveredNodeIdRef.current = n.id;
              //     hasTriggeredRef.current = false;
              //     if (hoverTimerRef.current) {
              //       clearTimeout(hoverTimerRef.current);
              //     }

              //     hoverTimerRef.current = setTimeout(() => {
              //       if (!hasTriggeredRef.current) {
              //         hasTriggeredRef.current = true;
              //         if (onNodeHover) onNodeHover(n);
              //       }
              //     }, 3000);
              //   }
            }}
            onLinkHover={(link) => {
              setHoveredLink(link as GraphLink | null);
              if (!link) {
                setHighlightNodes(new Set());
                setHighlightLinks(new Set());
                setHoveredConnectedNodeNames([]);
                return;
              }

              const sourceId =
                typeof link.source === "string" ? link.source : link.source.id;
              const targetId =
                typeof link.target === "string" ? link.target : link.target.id;

              setHighlightNodes(new Set([sourceId, targetId]));
              setHighlightLinks(new Set([`${sourceId}-${targetId}`]));
              setHoveredConnectedNodeNames([]);
            }}
            onNodeClick={(node) => {
              const clicked = node as GraphNode;
              const fg = fgRef.current;
              const container = fgContainerRef.current;
              if (!fg || !container) return;

              // Reset fixed positions first
              nodes.forEach((n) => {
                delete n.fx;
                delete n.fy;
              });

              const centerX = container.clientWidth / 2;
              const centerY = container.clientHeight / 2;

              // Fix clicked node in center
              clicked.fx = centerX;
              clicked.fy = centerY;

              // Find connected node IDs
              const connectedNodes: GraphNode[] = [];
              const connectedLinks: string[] = [];

              links.forEach((link) => {
                const sourceId =
                  typeof link.source === "string"
                    ? link.source
                    : link.source.id;
                const targetId =
                  typeof link.target === "string"
                    ? link.target
                    : link.target.id;

                if (sourceId === clicked.id || targetId === clicked.id) {
                  const neighborId =
                    sourceId === clicked.id ? targetId : sourceId;
                  const neighbor = nodes.find((n) => n.id === neighborId);
                  if (neighbor) {
                    connectedNodes.push(neighbor);
                    connectedLinks.push(`${sourceId}-${targetId}`);
                  }
                }
              });

              // Arrange connected nodes around center (like N, S, E, W)
              const radius = 200;
              const angleStep = (2 * Math.PI) / connectedNodes.length;
              connectedNodes.forEach((n, i) => {
                const angle = i * angleStep;
                n.fx = centerX + radius * Math.cos(angle);
                n.fy = centerY + radius * Math.sin(angle);
              });

              // Apply highlighting/fading
              const connectedIds = new Set<string>(
                connectedNodes.map((n) => n.id)
              );
              connectedIds.add(clicked.id);

              setFocusedNodeIds([clicked.id]);
              setHighlightNodes(connectedIds);
              setHighlightLinks(new Set(connectedLinks));

              fg.centerAt(centerX, centerY, 1000);
              fg.zoom(Math.max(2, minZoom), 1000);
              fg.d3ReheatSimulation();

              if (onNodeClick) onNodeClick(clicked);
            }}
            nodeRelSize={nodeSize}
          />
        </div>

        {/* Tooltip for searched node */}
        {searchedNode && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#fff",
              border: "1px solid #ccc",
              padding: 8,
              fontSize: 12,
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            <p>Search Info:</p>
            <strong>{searchedNode.name}</strong>
            <p>{`Conneted to ${searchedConnectedNodeNames.length}:`}</p>
            <ul style={{ paddingLeft: 15 }}>
              {searchedConnectedNodeNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tooltip for hovered node */}
        {hoveredNode && searchedNode?.name !== hoveredNode.name && (
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 10,
              background: "#fff",
              border: "1px solid #ccc",
              padding: 8,
              fontSize: 12,
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            <p>Hovered info:</p>
            <strong>{hoveredNode.name}</strong>
            <p>{`${
              filterList(hoveredConnectedNodeNames, hoveredNode.name).length
            } Connection${
              filterList(hoveredConnectedNodeNames, hoveredNode.name).length > 1
                ? "s"
                : ""
            }:`}</p>
            <ul style={{ paddingLeft: 15 }}>
              {filterList(hoveredConnectedNodeNames, hoveredNode.name).map(
                (name) => (
                  <li key={name}>{name}</li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Tooltip for hovered link */}
        {hoveredLink && hoveredLink.source && hoveredLink.target && (
          <div
            style={{
              position: "absolute",
              top: 70,
              left: 10,
              background: "#fff",
              border: "1px solid #ccc",
              padding: 8,
              fontSize: 12,
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            <p>Hovered info:</p>
            <strong>Link</strong>
            <br />
            <em>
              {typeof hoveredLink.source === "string"
                ? hoveredLink.source
                : hoveredLink.source.name}{" "}
              →{" "}
              {typeof hoveredLink.target === "string"
                ? hoveredLink.target
                : hoveredLink.target.name}
            </em>
          </div>
        )}
        {noMatchMessage && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              border: "1px solid #ccc",
              padding: 8,
              fontSize: 12,
              color: "var(--primary-color)",
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {noMatchMessage}
          </div>
        )}
      </div>
    );
  }
);

export default PeopleGraph;
