// in the code below

// // PeopleGraph.tsx
// import {
//   useRef,
//   useEffect,
//   useImperativeHandle,
//   forwardRef,
//   useState,
//   useContext,
// } from "react";
// import ForceGraph2D from "react-force-graph-2d";
// import type {
//   ForceGraphMethods,
//   NodeObject,
//   LinkObject,
// } from "react-force-graph-2d";
// import { useOnClickOutside } from "../../helper/UseOnClickOutside";
// import ActionContext from "../../context/ActionContext";

// export type GraphNode = {
//   id: string;
//   name: string;
//   img: string;
//   group: string;
//   x?: number;
//   y?: number;
//   fx?: number;
//   fy?: number;
// } ;

// export type GraphLink = {
//   source: string | GraphNode;
//   target: string | GraphNode;
// };

// type Props = {
//   nodes: GraphNode[];
//   links: GraphLink[];
//   onNodeClick?: (node: GraphNode) => void;
// };

// export type PeopleGraphHandle = {
//   focusOnNode: (searchValue: string) => GraphNode[] | null;
// };

// const minZoom = 0.5;

// const PeopleGraph = forwardRef<PeopleGraphHandle, Props>(
//   ({ nodes, links, onNodeClick }, ref) => {
//     const fgRef = useRef<
//       | ForceGraphMethods<
//           NodeObject<GraphNode>,
//           LinkObject<GraphNode, GraphLink>
//         >
//       | undefined
//     >(undefined);

//     const fgContainerRef = useRef<HTMLDivElement>(null);

//     const [focusedNodeIds, setFocusedNodeIds] = useState<string[]>([]);
//     const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
//     const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
//     const [highlightNodes, setHighlightNodes] = useState<Set<string>>(
//       new Set()
//     );
//     const [highlightLinks, setHighlightLinks] = useState<Set<string>>(
//       new Set()
//     );

//     const [searchedNode, setSearchedNode] = useState<GraphNode | null>(null);
//     const [searchedConnectedNodeNames, setSearchedConnectedNodeNames] =
//       useState<string[]>([]);
//     const [hoveredConnectedNodeNames, setHoveredConnectedNodeNames] = useState<
//       string[]
//     >([]);

//     const nodeSize = 22;

//     useEffect(() => {
//       const fg = fgRef.current;
//       if (!fg) return;
//       fg.d3Force("charge")?.strength(-180);
//       fg.d3Force("link")?.distance(130);

//       const container = fgContainerRef.current;
//       if (!container) return;
//       const canvas = container.querySelector("canvas");
//       if (!canvas) return;

//       const handleWheel = (event: WheelEvent) => {
//         event.preventDefault();
//         const currentZoom = fg.zoom();
//         const zoomAmount = event.deltaY * -0.0015;
//         let newZoom = currentZoom + zoomAmount;
//         newZoom = Math.min(Math.max(newZoom, minZoom), 5);
//         fg.zoom(newZoom);
//         fg.d3ReheatSimulation();
//         return false;
//       };

//       fg.zoom(Math.max(1, minZoom));
//       canvas.addEventListener("wheel", handleWheel, { passive: false });

//       return () => {
//         canvas.removeEventListener("wheel", handleWheel);
//       };
//     }, []);

//     useImperativeHandle(ref, () => ({
//       focusOnNode: (searchValue: string) => {
//         const fg = fgRef.current;
//         const container = fgContainerRef.current;
//         if (!fg || !container) return null;

//         if (!searchValue.trim()) {
//           setFocusedNodeIds([]);
//           setSearchedNode(null);
//           setSearchedConnectedNodeNames([]);
//           nodes.forEach((n) => {
//             delete n.fx;
//             delete n.fy;
//           });
//           fg.zoom(Math.max(1, minZoom), 1000);
//           fg.centerAt(0, 0, 1000);
//           fg.d3ReheatSimulation();
//           return null;
//         }

//         const matchedNodes = nodes.filter((n) =>
//           n.name.toLowerCase().includes(searchValue.toLowerCase())
//         );

//         if (matchedNodes.length > 0) {
//           const firstNode = matchedNodes[0];
//           setFocusedNodeIds(matchedNodes.map((n) => n.id));
//           nodes.forEach((n) => {
//             delete n.fx;
//             delete n.fy;
//           });

//           const centerX = container.clientWidth / 2;
//           const centerY = container.clientHeight / 2;

//           firstNode.fx = centerX;
//           firstNode.fy = centerY;
//           firstNode.x = centerX;
//           firstNode.y = centerY;

//           const connectedIds = new Set<string>();
//           links.forEach((link) => {
//             const sourceId =
//               typeof link.source === "string" ? link.source : link.source.id;
//             const targetId =
//               typeof link.target === "string" ? link.target : link.target.id;
//             if (sourceId === firstNode.id) connectedIds.add(targetId);
//             else if (targetId === firstNode.id) connectedIds.add(sourceId);
//           });

//           const connectedNames = nodes
//             .filter((n) => connectedIds.has(n.id))
//             .map((n) => n.name);

//           setSearchedNode(firstNode);
//           setSearchedConnectedNodeNames(connectedNames);

//           fg.centerAt(centerX, centerY, 1000);
//           fg.zoom(Math.max(2, minZoom), 1000);
//           fg.d3ReheatSimulation();
//           return matchedNodes;
//         }

//         return null;
//       },
//     }));

//     const centerAndRearrangeGraph = (clickedNode: GraphNode) => {
//       const fg = fgRef.current;
//       const container = fgContainerRef.current;
//       if (!fg || !container) return;

//       // Unfix all nodes
//       nodes.forEach((n) => {
//         delete n.fx;
//         delete n.fy;
//       });

//       const centerX = container.clientWidth / 2;
//       const centerY = container.clientHeight / 2;

//       clickedNode.fx = centerX;
//       clickedNode.fy = centerY;
//       clickedNode.x = centerX;
//       clickedNode.y = centerY;

//       fg.centerAt(centerX, centerY, 1000);
//       fg.zoom(Math.max(2, minZoom), 1000);
//       fg.d3ReheatSimulation();
//     };

//     const filterList = (list?: string[], param?: string): string[] => {
//         if (Array.isArray(list)) {
//           return list.filter((ch) => ch !== param);
//         }
//         return [];
//       };

//     const actionCtx = useContext(ActionContext);
//     const manageRef = useOnClickOutside(() => {
//       if (Number(actionCtx?.setSingleNodeinfo?.length) > 0) {
//         const fg = fgRef.current as any;
//         setFocusedNodeIds([]);
//         setSearchedNode(null);
//         setSearchedConnectedNodeNames([]);
//         nodes.forEach((n) => {
//           delete n.fx;
//           delete n.fy;
//         });
//         fg.zoom(Math.max(1, minZoom), 1000);
//         fg.centerAt(0, 0, 1000);
//         fg.d3ReheatSimulation();
//         actionCtx?.setSingleNodeinfo && actionCtx?.setSingleNodeinfo([]);
//         return null;
//       }
//     });

//     return (
//       <div
//         ref={manageRef}
//         style={{ width: "100%", height: "100%", overflow: "scroll" }}
//       >
//         <div
//           ref={fgContainerRef}
//           style={{ width: "200rem", height: "200rem", position: "relative" }}
//         >
//           <ForceGraph2D
//             ref={fgRef}
//             graphData={{ nodes, links }}
//             backgroundColor="#ffffff"
//             linkColor={(link) => {
//               const sourceId =
//                 typeof link.source === "string" ? link.source : link.source.id;
//               const targetId =
//                 typeof link.target === "string" ? link.target : link.target.id;
//               const key = `${sourceId}-${targetId}`;
//               return highlightLinks.size === 0 || highlightLinks.has(key)
//                 ? "#365ed9"
//                 : "rgba(160,160,160,0.3)";
//             }}
//             linkWidth={(link) => {
//               const sourceId =
//                 typeof link.source === "string" ? link.source : link.source.id;
//               const targetId =
//                 typeof link.target === "string" ? link.target : link.target.id;
//               const key = `${sourceId}-${targetId}`;
//               return highlightLinks.has(key) ? 2 : 1;
//             }}
//             cooldownTicks={120}
//             nodeCanvasObject={(node, ctx) => {
//               const n = node as NodeObject<GraphNode>;
//               const img = new Image();
//               img.src = n.img;

//               const isFocused = focusedNodeIds.includes(n.id);
//               const isHighlighted =
//                 highlightNodes.size === 0 || highlightNodes.has(n.id);
//               const opacity = isHighlighted ? 1 : 0.1;

//               const r = isFocused
//                 ? nodeSize * 1.8
//                 : highlightNodes.has(n.id)
//                 ? nodeSize * 1.4
//                 : nodeSize * 0.8;

//               const { x = 0, y = 0 } = n;

//               ctx.globalAlpha = opacity;
//               ctx.beginPath();
//               ctx.arc(x, y, r, 0, 2 * Math.PI);
//               ctx.lineWidth = 3;
//               ctx.strokeStyle = n.group;
//               ctx.stroke();
//               ctx.closePath();

//               img.onload = () => {
//                 ctx.save();
//                 ctx.beginPath();
//                 ctx.arc(x, y, r - 2, 0, 2 * Math.PI);
//                 ctx.clip();
//                 ctx.drawImage(
//                   img,
//                   x - (r - 2),
//                   y - (r - 2),
//                   (r - 2) * 2,
//                   (r - 2) * 2
//                 );
//                 ctx.restore();
//               };

//               ctx.globalAlpha = 1;
//             }}
//             nodePointerAreaPaint={(node, color, ctx) => {
//               const n = node as NodeObject<GraphNode>;
//               const isFocused = focusedNodeIds.includes(n.id);
//               const isHighlighted = highlightNodes.has(n.id);
//               const r = isFocused
//                 ? nodeSize * 1.8
//                 : isHighlighted
//                 ? nodeSize * 1.4
//                 : nodeSize * 0.8;
//               ctx.fillStyle = color;
//               ctx.beginPath();
//               ctx.arc(n.x!, n.y!, r + 2, 0, 2 * Math.PI);
//               ctx.fill();
//             }}
//             onNodeHover={(node) => {
//               const n = node as GraphNode | null;
//               setHoveredNode(n);
//               setHoveredLink(null);

//               if (!n) {
//                 setHighlightNodes(new Set());
//                 setHighlightLinks(new Set());
//                 setHoveredConnectedNodeNames([]);
//                 return;
//               }

//               const connectedNodes = new Set<string>();
//               const connectedLinks = new Set<string>();

//               links.forEach((link) => {
//                 const sourceId =
//                   typeof link.source === "string"
//                     ? link.source
//                     : link.source.id;
//                 const targetId =
//                   typeof link.target === "string"
//                     ? link.target
//                     : link.target.id;

//                 if (sourceId === n.id) {
//                   connectedNodes.add(targetId);
//                   connectedLinks.add(`${sourceId}-${targetId}`);
//                 } else if (targetId === n.id) {
//                   connectedNodes.add(sourceId);
//                   connectedLinks.add(`${sourceId}-${targetId}`);
//                 }
//               });

//               connectedNodes.add(n.id);
//               setHighlightNodes(connectedNodes);
//               setHighlightLinks(connectedLinks);

//               const names = nodes
//                 .filter((node) => connectedNodes.has(node.id))
//                 .map((n) => n.name);
//               setHoveredConnectedNodeNames(names);
//             }}
//             onLinkHover={(link) => {
//               setHoveredLink(link as GraphLink | null);
//               if (!link) {
//                 setHighlightNodes(new Set());
//                 setHighlightLinks(new Set());
//                 setHoveredConnectedNodeNames([]);
//                 return;
//               }

//               const sourceId =
//                 typeof link.source === "string" ? link.source : link.source.id;
//               const targetId =
//                 typeof link.target === "string" ? link.target : link.target.id;

//               setHighlightNodes(new Set([sourceId, targetId]));
//               setHighlightLinks(new Set([`${sourceId}-${targetId}`]));
//               setHoveredConnectedNodeNames([]);
//             }}
//             onNodeClick={(node) => {
//               const clicked = node as GraphNode;
//               centerAndRearrangeGraph(clicked);
//               if (onNodeClick) onNodeClick(clicked);
//             }}
//             nodeRelSize={nodeSize}
//             enableNodeDrag={true}
//           />
//         </div>

//         {/* Tooltip for searched node */}
//         {searchedNode && (
//           <div
//             style={{
//               position: "absolute",
//               top: 10,
//               right: 10,
//               background: "#fff",
//               border: "1px solid #ccc",
//               padding: 8,
//               fontSize: 12,
//               boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//               pointerEvents: "none",
//             }}
//           >
//             <p>Search Info:</p>
//             <strong>{searchedNode.name}</strong>
//             <p>{`Conneted to ${searchedConnectedNodeNames.length}:`}</p>
//             <ul style={{ paddingLeft: 15 }}>
//               {searchedConnectedNodeNames.map((name) => (
//                 <li key={name}>{name}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Tooltip for hovered node */}
//         {hoveredNode && searchedNode?.name !== hoveredNode.name &&  (
//           <div
//             style={{
//               position: "absolute",
//               top: 40,
//               left: 10,
//               background: "#fff",
//               border: "1px solid #ccc",
//               padding: 8,
//               fontSize: 12,
//               boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//               pointerEvents: "none",
//             }}
//           >
//             <p>Hovered info:</p>
//             <strong>{hoveredNode.name}</strong>
//             <p>{`${filterList(hoveredConnectedNodeNames, hoveredNode.name).length} Connection${
//               filterList(hoveredConnectedNodeNames, hoveredNode.name).length > 1 ? "s" : ""
//             }:`}</p>
//             <ul style={{ paddingLeft: 15 }}>
//               {filterList(hoveredConnectedNodeNames, hoveredNode.name).map((name) => (
//                 <li key={name}>{name}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Tooltip for hovered link */}
//         {hoveredLink && hoveredLink.source && hoveredLink.target && (
//           <div
//             style={{
//               position: "absolute",
//               top: 70,
//               left: 10,
//               background: "#fff",
//               border: "1px solid #ccc",
//               padding: 8,
//               fontSize: 12,
//               boxShadow: "0 0 5px rgba(0,0,0,0.2)",
//               pointerEvents: "none",
//             }}
//           >
//             <p>Hovered info:</p>
//             <strong>Link</strong>
//             <br />
//             <em>
//               {typeof hoveredLink.source === "string"
//                 ? hoveredLink.source
//                 : hoveredLink.source.name}{" "}
//               →{" "}
//               {typeof hoveredLink.target === "string"
//                 ? hoveredLink.target
//                 : hoveredLink.target.name}
//             </em>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// export default PeopleGraph;

// update that if a boolean value is passed to PeopleGraph component, to  mute connections, the links should be muted, that is, the node links should not be visible